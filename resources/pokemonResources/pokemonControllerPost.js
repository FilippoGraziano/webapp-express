
import { connection } from '../../data/db.js';
import { notFoundError } from '../../errorFunctions.js';

export const createPokemon = async (req, res) => {

    const {
        name,
        height,
        weight,
        n_international,
        generation,
        description,
        male,
        female,
        image
    } = req.body
    if (name === undefined || name === ``) return res.status(400).status(400).json({ error: `body request error`, message: `you have to insert the name of the pokemon` });
    if (typeof name !== `string`) return res.status(400).json({ error: `body request error`, message: `the name should be a string` });
    if (name.length < 3) return res.status(400).json({ error: `body request error`, message: `you have to insert a longest name` });

    if (height === undefined) return res.status(400).json({ error: `body request error`, message: `you have to insert the height of the pokemon` });
    if (typeof height !== `number`) return res.status(400).json({ error: `body request error`, message: `the height should be a number` });
    if (height < 0.1) return res.status(400).json({ error: `body request error`, message: `the height should be bigger than 0` });

    if (weight === undefined) return res.status(400).json({ error: `body request error`, message: `you have to insert the wheigth of the pokemon` });
    if (typeof weight !== `number`) return res.status(400).json({ error: `body request error`, message: `the weight should be a number` });
    if (weight < 0.1) return res.status(400).json({ error: `body request error`, message: `the weight should be bigger than 0` });

    if (n_international === undefined) return res.status(400).json({ error: `body request error`, message: `you have to insert the international number of the pokemon` });
    if (typeof n_international !== `number`) return res.status(400).json({ error: `body request error`, message: `the n_internationl should be a number` });
    if (n_international < 1) return res.status(400).json({ error: `body request error`, message: `the n_internationl should be bigger than 0` });

    if (generation === undefined) return res.status(400).json({ error: `body request error`, message: `you have to insert the generation of the pokemon` });
    if (typeof generation !== `number`) return res.status(400).json({ error: `body request error`, message: `the generation should be a number` });
    if (generation < 1) return res.status(400).json({ error: `body request error`, message: `the generation should be bigger than 0` });
    if (generation > 10) return res.status(400).json({ error: `body request error`, message: `the generation shouldn't be bigger than 10` });

    if (description === undefined) return res.status(400).json({ error: `body request error`, message: `you have to insert the description of the pokemon` });
    if (typeof description !== `string`) return res.status(400).json({ error: `body request error`, message: `the description should be a string` });
    if (description.length < 15) return res.status(400).json({ error: `body request error`, message: `you have to insert a longest description` });

    if (male === undefined) return res.status(400).json({ error: `body request error`, message: `you have to insert the chance of found a male species of the pokemon` });
    if (typeof male !== `number`) return res.status(400).json({ error: `body request error`, message: `the percent of male should be a number` });
    if (male < 0) return res.status(400).json({ error: `body request error`, message: `the percent of male can't be a negative number` });
    if (male > 100) return res.status(400).json({ error: `body request error`, message: `the percent of male can't be bigger than 100` });

    if (female === undefined) return res.status(400).json({ error: `body request error`, message: `you have to insert the chance of found a female species of the pokemon` });
    if (typeof female !== `number`) return res.status(400).json({ error: `body request error`, message: `the percent of female should be a number` });
    if (female < 0) return res.status(400).json({ error: `body request error`, message: `the percent of female can't be a negative number` });
    if (female > 100) return res.status(400).json({ error: `body request error`, message: `the percent of female can't be bigger than 100` });

    if (image === undefined) return res.status(400).json({ error: `body request error`, message: `you have to insert the image of the pokemon` });
    if (image.includes(`..`)) return res.status(400).json({ error: `body request error`, message: `the image file/name shouldn't includes '..'` });
    const regex = /\.\s*(?!png\b)\w+/i;
    if (regex.test(image)) return res.status(400).json({ error: `body request error`, message: `the image file/name should be '.png'` });

    const sql = `
        INSERT INTO pokemon ( name, height, weight, n_international, generation, description, male, female, image ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ? )
    `
    const [result] = await connection.query(sql, [
        name,
        height,
        weight,
        n_international,
        generation,
        description,
        male,
        female,
        image
    ]);

    res.json({
        id: result.insertId,
        name,
        height,
        weight,
        n_international,
        generation,
        description,
        male,
        female,
        image,
    })

};

export const createPokemonEvolution = async (req, res) => {

    const pokemonId = Number(req.params.id);
    if (isNaN(pokemonId)) return res.json({ error: `id error`, message: `the pokemon id should be a number` });

    const sqlPokemon = `SELECT * FROM pokemon WHERE id = ?`;
    const [resultPokemon] = await connection.query(sqlPokemon, pokemonId);
    if (resultPokemon.length === 0) return notFoundError(req, res, `pokemon`);

    const sqlExistEvo = `SELECT * FROM evolutions WHERE pokemon_id = ?`;
    const [resultExistEvo] = await connection.query(sqlExistEvo, pokemonId);
    if (resultExistEvo.length > 0) return res.status(400).json({ error: `existing record`, message: `this pokemon (id: ${pokemonId}) already has an evolution` });

    const sqlEvoPok = `SELECT * FROM pokemon WHERE id = ?`;
    const [resultEvoPok] = await connection.query(sqlEvoPok, evo_pokemon_id);
    if (resultEvoPok.length === 0) return res.status(404).json({ error: `not found`, message: `evo pokemon with this id (${evo_pokemon_id}) doesn't exist` });

    if (evo_pokemon_id === undefined) return res.status(400).json({ error: `body request error`, message: `you have to insert the evolved pokemon ` });
    if (typeof evo_pokemon_id !== `number`) return res.status(400).json({ error: `body request error`, message: `the type of evo_pokemon_id should be a number` });
    const sqlExistEvoPokemon = `SELECT * FROM evolutions WHERE evo_pokemon_id = ?`;
    const [resultExistEvoPokemon] = await connection.query(sqlExistEvoPokemon, evo_pokemon_id);
    if (resultExistEvoPokemon.length > 0) return res.status(400).json({ error: `existing record`, message: `this pokemon (id: ${evo_pokemon_id}) already has a pre evolution` });

    const { evo_type, item_id, evo_method, evo_pokemon_id } = req.body;

    if (pokemonId === evo_pokemon_id) return res.json({ error: `bad request`, message: `the pokemon id can't be the same of evo_pokemon_id` });

    if (evo_type === undefined) return res.status(400).json({ error: `body request error`, message: `you have to insert the type of evolution` });
    if (evo_type === ``) return res.status(400).json({ error: `body request error`, message: `you have to insert the type of evolution` });
    // if (!evo_type.includes(`item`) || !evo_type.includes(`level`) || !evo_type.includes(`trade`));
    if (typeof evo_type !== `string`) return res.status(400).json({ error: `body request error`, message: `the type of evolution should be a string` });

    if (typeof item_id === `number` && (evo_type === `item` || evo_method === `trade with item`)) {
        const sqlItem = ` SELECT * FROM items WHERE id = ? `;
        const [resultItem] = await connection.query(sqlItem, item_id);
        if (resultItem.length === 0) return res.status(404).json({ error: `not found`, message: `item with this id (${item_id}) doesn't exist` });
    }

    if (evo_method === undefined) return res.status(400).json({ error: `body request error`, message: `you have to insert the method of evolution` });
    if (evo_method === `` && evo_type !== `level`) return res.status(400).json({ error: `body request error`, message: `you have to insert the metod of evolution` });
    if (typeof evo_method !== `string` && evo_type !== `level`) return res.status(400).json({ error: `body request error`, message: `the method of evolution should be a string` });

    if ((evo_type === `item` || evo_method === `trade with item`) && typeof item_id !== `number`) return res.status(400).json({ error: `body request error`, message: `the type of item_id should be a number` });
    if ((evo_type === `level` || (evo_type === `trade` && evo_method !== `trade with item`)) && (typeof item_id === `string` || typeof item_id === `number` || typeof item_id === `boolean`)) return res.json({ error: `bad request`, message: `if evo_type is 'level'/'trade' the item should be null/undefined` });
    if (evo_type === `level` && typeof evo_method !== `number`) return res.status(400).json({ error: `body request error`, message: `if evo_type is level the method of evolution should be a number` });

    const sql = `INSERT INTO evolutions ( pokemon_id, evo_type, item_id, evo_method, evo_pokemon_id ) values ( ?, ?, ?, ?, ?)`
    const [result] = await connection.query(sql, [pokemonId, evo_type, item_id, evo_method, evo_pokemon_id])

    res.json({
        id: result.insertId,
        pokemonId,
        evo_type,
        item_id,
        evo_method,
        evo_pokemon_id
    })
};

export const createPokemonStats = async (req, res) => {

    const pokemonId = Number(req.params.id);
    if (isNaN(pokemonId)) return res.json({ error: `id error`, message: `the pokemon id should be a number` });

    const sqlPokemon = `SELECT * FROM pokemon WHERE id = ?`;
    const [resultPokemon] = await connection.query(sqlPokemon, pokemonId);
    if (resultPokemon.length === 0) return notFoundError(req, res, `pokemon`);

    const sqlSame = `SELECT * FROM stats WHERE pokemon_id = ?`
    const [resultSame] = await connection.query(sqlSame, pokemonId);
    if (resultSame.length !== 0) return res.status(400).json({ error: `bad request`, message: `this pokemon (id: ${pokemonId}) already has the stats` });

    const { tot_stats, ps, attack, defense, sp_attack, sp_defense, speed } = req.body;
    if (tot_stats === undefined) return res.status(400).json({ error: `body request error`, message: `you have to insert the total stats of pokemon` });
    if (typeof tot_stats !== `number`) return res.status(400).json({ error: `body request error`, message: `the type of tot_stats should be a number` });
    if (tot_stats > 1530) return res.status(400).json({ error: `body request error`, message: `the total stats can't be higher than 1.530` });
    if (tot_stats < 6) return res.status(400).json({ error: `body request error`, message: `the total stats can't be lower than 6` });

    if (ps === undefined) return res.status(400).json({ error: `body request error`, message: `you have to insert the ps of pokemon` });
    if (typeof ps !== `number`) return res.status(400).json({ error: `body request error`, message: `the type of ps should be a number` });
    if (ps > 255) return res.status(400).json({ error: `body request error`, message: `the stat of ps can't be higher than 255` });
    if (ps < 1) return res.status(400).json({ error: `body request error`, message: `the stat of ps can't be lower than 1` });

    if (attack === undefined) return res.status(400).json({ error: `body request error`, message: `you have to insert the attack of pokemon` });
    if (typeof attack !== `number`) return res.status(400).json({ error: `body request error`, message: `the type of attack should be a number` });
    if (attack > 255) return res.status(400).json({ error: `body request error`, message: `the stat of attack can't be higher than 255` });
    if (attack < 1) return res.status(400).json({ error: `body request error`, message: `the stat of attack can't be lower than 1` });

    if (defense === undefined) return res.status(400).json({ error: `body request error`, message: `you have to insert the defense of pokemon` });
    if (typeof defense !== `number`) return res.status(400).json({ error: `body request error`, message: `the type of defense should be a number` });
    if (defense > 255) return res.status(400).json({ error: `body request error`, message: `the stat of defense can't be higher than 255` });
    if (defense < 1) return res.status(400).json({ error: `body request error`, message: `the stat of defense can't be lower than 1` });

    if (sp_attack === undefined) return res.status(400).json({ error: `body request error`, message: `you have to insert the special attack of pokemon` });
    if (typeof sp_attack !== `number`) return res.status(400).json({ error: `body request error`, message: `the type of sp_attack should be a number` });
    if (sp_attack > 255) return res.status(400).json({ error: `body request error`, message: `the stat of sp_attack can't be higher than 255` });
    if (sp_attack < 1) return res.status(400).json({ error: `body request error`, message: `the stat of sp_attack can't be lower than 1` });

    if (sp_defense === undefined) return res.status(400).json({ error: `body request error`, message: `you have to insert the special defense of pokemon` });
    if (typeof sp_defense !== `number`) return res.status(400).json({ error: `body request error`, message: `the type of sp_defense should be a number` });
    if (sp_defense > 255) return res.status(400).json({ error: `body request error`, message: `the stat of sp_defense can't be higher than 255` });
    if (sp_defense < 1) return res.status(400).json({ error: `body request error`, message: `the stat of sp_defense can't be lower than 1` });

    if (speed === undefined) return res.status(400).json({ error: `body request error`, message: `you have to insert the speed of pokemon` });
    if (typeof speed !== `number`) return res.status(400).json({ error: `body request error`, message: `the type of speed should be a number` });
    if (speed > 255) return res.status(400).json({ error: `body request error`, message: `the stat of speed can't be higher than 255` });
    if (speed < 1) return res.status(400).json({ error: `body request error`, message: `the stat of speed can't be lower than 1` });

    if ((ps + attack + defense + sp_attack + sp_defense + speed) !== tot_stats) return res.status(400).json({ error: `body request error`, message: `tot_stats has to be the same as the sum of the other stats` });

    const sql = `INSERT INTO stats ( pokemon_id, tot_stats, ps, attack, defense, sp_attack, sp_defense, speed) values (?, ?, ?, ?, ?, ?, ?, ?)`
    const [result] = await connection.query(sql, [pokemonId, tot_stats, ps, attack, defense, sp_attack, sp_defense, speed])

    res.json({
        id: result.insertId,
        pokemonId,
        tot_stats,
        ps,
        attack,
        defense,
        sp_attack,
        sp_defense,
        speed
    })
};

export const createPokemonAbilities = async (req, res) => {

    const pokemonId = Number(req.params.id);
    if (isNaN(pokemonId)) return res.json({ error: `id error`, message: `the pokemon id should be a number` });

    const sqlPokemon = `SELECT * FROM pokemon WHERE id = ?`;
    const [resultPokemon] = await connection.query(sqlPokemon, pokemonId);
    if (resultPokemon.length === 0) return notFoundError(req, res, `pokemon`);

    const sqlSame = `SELECT * FROM pokemon_ability WHERE pokemon_id = ?`;
    const [resultSame] = await connection.query(sqlSame, pokemonId);
    if (resultSame.length === 3) return res.status(400).json({ error: `bad request`, message: `this pokemon has reached the max of ability` });

    const { ability_id, primary_ability, secondary_ability, special_ability } = req.body;
    if (ability_id === undefined) return res.status(400).json({ error: `body request error`, message: `you have to insert the ability of pokemon` });
    if (typeof ability_id !== `number`) return res.status(400).json({ error: `body request error`, message: `ability_id should be a number` });

    const sqlAbility = `SELECt * FROM abilities WHERE id = ?`;
    const [resultAbility] = await connection.query(sqlAbility, ability_id);
    if (resultAbility.length === 0) return res.status(404).json({ error: `not found`, message: `Ability with this id (${ability_id}) doesn't exist` });

    if (primary_ability === undefined) return res.status(400).json({ error: `body request error`, message: `Is a primary ability?` });
    if (secondary_ability === undefined) return res.status(400).json({ error: `body request error`, message: `Is a secondary ability?` });
    if (special_ability === undefined) return res.status(400).json({ error: `body request error`, message: `Is a special ability?` });

    if (resultSame.length !== 0) {

        let ability1;
        let ability2;
        resultSame.forEach((ability, i) => (
            i === 0 ?
                ability1 = ability.ability_id :
                i === 1 ?
                    ability2 = ability.ability_id :
                    undefined
        ));
        if (ability_id === ability1 || ability_id === ability2) return res.status(400).json({ error: `bad request`, message: `This pokemon already has this ability` });

        if (primary_ability) {
            let primary = 0;
            resultSame.forEach((ability) => (
                ability.primary_ability === 1 ?
                    primary = 1 :
                    undefined
            ));
            if (primary === 1) return res.status(400).json({ error: `bad request`, message: `The primary ability already exists` });
        }
        if (secondary_ability) {
            let secondary = 0;
            resultSame.forEach((ability) => (
                ability.secondary_ability === 1 ?
                    secondary = 1 :
                    undefined
            ));
            if (secondary === 1) return res.status(400).json({ error: `bad request`, message: `The secondary ability already exists` });
        }
        if (special_ability) {
            let special = 0;
            resultSame.forEach((ability) => (
                ability.special_ability === 1 ?
                    special = 1 :
                    undefined
            ));
            if (special === 1) return res.status(400).json({ error: `bad request`, message: `The special ability already exists` });
        }
    }

    if (primary_ability && secondary_ability) return res.status(400).json({ error: `bad request`, message: `Only one of 'primary_ability' and 'seondary_ability' should be TRUE` });
    if (primary_ability && special_ability) return res.status(400).json({ error: `bad request`, message: `Only one of 'primary_ability' and 'special_ability' should be TRUE` });
    if (secondary_ability && special_ability) return res.status(400).json({ error: `bad request`, message: `Only one of 'secondary_ability' and 'special_ability' should be TRUE` });
    if (!primary_ability && !secondary_ability && !special_ability) return res.status(400).json({ error: `bad request`, message: `One of 'primary_ability', 'seondary_ability' and 'special_ability' should be TRUE` });

    const sql = `INSERT INTO pokemon_ability (pokemon_id, ability_id, primary_ability, secondary_ability, special_ability) values (?, ?, ?, ?, ?)`
    await connection.query(sql, [pokemonId, ability_id, primary_ability, secondary_ability, special_ability])

    res.json({
        pokemonId,
        ability_id,
        primary_ability,
        secondary_ability,
        special_ability
    })
};

export const createPokemonTypes = async (req, res) => {

    const pokemonId = Number(req.params.id);
    if (isNaN(pokemonId)) return res.json({ error: `id error`, message: `the pokemon id should be a number` });

    const sqlPokemon = `SELECT * FROM pokemon WHERE id = ?`;
    const [resultPokemon] = await connection.query(sqlPokemon, pokemonId);
    if (resultPokemon.length === 0) return notFoundError(req, res, `pokemon`);

    const { type_id, type_id2 } = req.body;
    if (type_id === undefined) return res.status(400).json({ error: `bad request`, message: `You have to insert the type of pokemon` });
    if (typeof type_id !== `number`) return res.status(400).json({ error: `bad request`, message: `the type of type_id should be a number` });

    const sqlControll = `SELECT * FROM pokemon_type WHERE pokemon_id = ?`;
    const [resultControll] = await connection.query(sqlControll, pokemonId);
    if (resultControll.length === 1 && type_id === resultControll[0].type_id) return res.status(400).json({ error: `bad request`, message: `The pokemon already has this type` });
    if (resultControll.length === 2) return res.status(400).json({ error: `bad request`, message: `this pokemon (id: ${pokemonId}) can't have more than 2 types` });

    const sqlType = `SELECT * FROM types WHERE id = ?`;
    const [resultType] = await connection.query(sqlType, type_id);
    if (resultType.length === 0) return res.status(400).json({ error: `not found`, message: `Type with this id (id: ${type_id}) doesn't exists` });

    const sql = `INSERT INTO pokemon_type (pokemon_id, type_id) values (?, ?)`;
    if (type_id2 != null) {

        if (resultControll.length === 1) return res.status(400).json({ error: `bad request`, message: `you can't add a second type for this pokemon (id: ${pokemonId}) beacous it already has one type` });
        if (typeof type_id2 !== `number`) return res.status(400).json({ error: `bad request`, message: `the type of type_id2 should be a number` });
        if (type_id2 === type_id) return res.status(400).json({ error: `bad request`, message: `type_id2 can't be the same as type_id` });

        const [resultType2] = await connection.query(sqlType, type_id2);
        if (resultType2.length === 0) return res.status(400).json({ error: `not found`, message: `Type with this id (id: ${type_id2}) doesn't exists` });

        await connection.query(sql, [pokemonId, type_id2]);
    }
    await connection.query(sql, [pokemonId, type_id]);

    const json = type_id2 == null ? { pokemonId, type_id } : { first_type: { pokemonId, type_id }, second_type: { pokemonId, type_id2 } };
    res.json(json);
};

export const createPokemonGames = async (req, res) => {

    const pokemonId = Number(req.params.id);
    if (isNaN(pokemonId)) return res.json({ error: `id error`, message: `the pokemon id should be a number` });

    const sqlPokemon = `SELECT * FROM pokemon WHERE id = ?`;
    const [resultPokemon] = await connection.query(sqlPokemon, pokemonId);
    if (resultPokemon.length === 0) return notFoundError(req, res, `pokemon`);

    const { game_id, pokemon_n_regional, pokedex_zone, regional_form } = req.body;
    if (game_id === undefined) return res.status(400).json({ error: `bad request`, message: `You have to insert the game` });
    if (typeof game_id !== `number`) return res.status(400).json({ error: `bad request`, message: `the type of game_id should be a number` });

    if (pokemon_n_regional === undefined) return res.status(400).json({ error: `bad request`, message: `You have to insert regional number of pokemon` });
    if (pokemon_n_regional < 1) return res.status(400).json({ error: `bad request`, message: `You have to insert a number higher than 0 in pokemon_n_regional` });
    if (typeof pokemon_n_regional !== `number`) return res.status(400).json({ error: `bad request`, message: `the type of pokemon_n_regional should be a number` });

    if (regional_form === undefined || regional_form === null) return res.status(400).json({ error: `bad request`, message: `Is it a regional form?` });

    const sqlGames = `SELECT * FROM games WHERE id = ?`;
    const [resultGame] = await connection.query(sqlGames, game_id);
    if (resultGame.length === 0) return res.status(404).json({ error: `not found`, message: `this game (id: ${game_id}) doesn't exists` });
    if (resultGame[0].name === `X / Y` && (pokedex_zone === undefined || pokedex_zone === null || typeof pokedex_zone !== `string`)) return res.status(400).json({ error: `bad request`, message: `You have to insert a pokedex_zone (central, mountain or coastal) in pokemon ${resultGame[0].name}` });
    if ((resultGame[0].name === 'Sun / Moon' || resultGame[0].name === 'Ultra Sun / Ultra Moon') && (pokedex_zone === undefined || pokedex_zone === null || typeof pokedex_zone !== `string`)) return res.status(400).json({ error: `bad request`, message: `You have to insert a pokedex_zone (akala, melemele, poni or ulaula) in pokemon ${resultGame[0].name}` });
    if (
        (resultGame[0].name !== `X / Y` || resultGame[0].name !== 'Sun / Moon' || resultGame[0].name !== 'Ultra Sun / Ultra Moon')
        &&
        (typeof pokedex_zone === `string` || typeof pokedex_zone === `number` || typeof pokedex_zone === `boolean`)
    )
        return res.status(400).json({ error: `bad request`, message: `if game isn't 'X/Y', 'Sun/Moon' or 'Ultra Sun/Ultra Moon' the pokedex_zone should be null/undefined` });

    const sqlRegionalNumber = `
        SELECT * FROM pokemon_game
        WHERE game_id = ? && pokemon_n_regional = ?
    `;
    let resultRegionalNumber;
    if (pokedex_zone === undefined || pokedex_zone === null) {
        [resultRegionalNumber] = await connection.query(sqlRegionalNumber, [game_id, pokemon_n_regional]);
        if (resultRegionalNumber.length !== 0) return res.status(400).json({ error: `bad request`, message: `Already exist a pokemon in this game (id: ${game_id}) and with this regional number (id: ${pokemon_n_regional})` })
    }

    const sqlRegionalNumberZone = `
        SELECT * FROM pokemon_game
        WHERE game_id = ? && pokemon_n_regional = ? && pokedex_zone = ?
    `;
    const [resultRegionalNumberZone] = await connection.query(sqlRegionalNumberZone, [game_id, pokemon_n_regional, pokedex_zone]);
    if (resultRegionalNumberZone.length !== 0) return res.status(400).json({ error: `bad request`, message: `Already exist a pokemon in this game (${game_id}) and this regional number (${pokemon_n_regional}) in this pokedex zone (${pokedex_zone})` })

    const sql = `INSERT INTO pokemon_game (pokemon_id, game_id, pokemon_n_regional, pokedex_zone, regional_form) values (?, ?, ?, ?, ?)`;
    let result;
    if ((resultGame[0].name === `X / Y`
        &&
        (pokedex_zone === `central` || pokedex_zone === `mountain` || pokedex_zone === `coastal`)
    )
        ||
        ((resultGame[0].name === 'Sun / Moon' || resultGame[0].name === 'Ultra Sun / Ultra Moon')
            &&
            (pokedex_zone === `akala` || pokedex_zone === `melemele` || pokedex_zone === `poni` || pokedex_zone === `ulaula`)
        )
        ||
        ((resultGame[0].name !== `X / Y` || resultGame[0].name !== 'Sun / Moon' || resultGame[0].name !== 'Ultra Sun / Ultra Moon')
            &&
            (pokedex_zone === undefined || pokedex_zone === null)
        )
    ) {
        [result] = await connection.query(sql, [pokemonId, game_id, pokemon_n_regional, pokedex_zone, regional_form]);
    } else return res.status(400).json({ error: `bad request`, message: `You have to insert a pokedex_zone ${resultGame[0].name === `X / Y` ? `(central, mountain or coastal)` : `(akala, melemele, poni or ulaula)`} in pokemon ${resultGame[0].name}` });

    res.json({
        id: result.insertId,
        pokemonId,
        game_id,
        pokemon_n_regional,
        pokedex_zone,
        regional_form
    });
};

export const createPokemonMoves = async (req, res) => {

    const pokemonId = Number(req.params.id);
    if (isNaN(pokemonId)) return res.json({ error: `id error`, message: `the pokemon id should be a number` });

    const sqlPokemon = `SELECT * FROM pokemon WHERE id = ?`;
    const [resultPokemon] = await connection.query(sqlPokemon, pokemonId);
    if (resultPokemon.length === 0) return notFoundError(req, res, `pokemon`);

    const { move_id, learning_gen, learning_level, learning_egg, learning_move_tutor, learning_mt, learning_mn } = req.body;
    if (move_id === undefined) return res.status(400).json({ error: `bad request`, message: `You have to insert the move id` });
    if (typeof move_id !== `number`) return res.status(400).json({ error: `bad request`, message: `the type of move_id should be number` });

    if (learning_gen === undefined) return res.status(400).json({ error: `bad request`, message: `You have to insert learning gen` });
    if (typeof learning_gen !== `number`) return res.status(400).json({ error: `bad request`, message: `the type of learning_gen should be number` });
    if (learning_gen < 1) return res.status(400).json({ error: `bad request`, message: `learning_gen should be higher than 0` });
    if (learning_gen > 11) return res.status(400).json({ error: `bad request`, message: `learning_gen should be lower than 11` });

    if (typeof learning_level === `string` || typeof learning_level === `boolean`) return res.status(400).json({ error: `bad request`, message: `The level should be a number` });
    if (
        (learning_egg === false && learning_move_tutor === false && learning_mt === false && learning_mn === false)
        &&
        (typeof learning_level !== `number` || learning_level < 1 || learning_level > 101)
    )
        return res.status(400).json({ error: `bad request`, message: `you have to insert the learning_level (higer than 0 and lower than 101) if all others are false` });

    if (typeof learning_egg !== `boolean`) return res.status(400).json({ error: `bad request`, message: `Does it learn it from egg?` });
    if (typeof learning_move_tutor !== `boolean`) return res.status(400).json({ error: `bad request`, message: `Does it learn it from move tutor?` });
    if (typeof learning_mt !== `boolean`) return res.status(400).json({ error: `bad request`, message: `Does it learn it from MT?` });
    if (typeof learning_mn !== `boolean`) return res.status(400).json({ error: `bad request`, message: `Does it learn it from MN?` });

    const sqlControllMove = `SELECT * FROM pokemon_move WHERE pokemon_id = ?`;
    const [resultControllMove] = await connection.query(sqlControllMove, pokemonId);
    const [learnedMove] = resultControllMove.filter(move => move.move_id === move_id);
    if (learnedMove !== undefined && learnedMove.learning_gen === learning_gen) return res.status(400).json({ error: `bad request`, message: `This pokemon already has this move (id: ${move_id}) in this gen (gen: ${learning_gen})` });

    const sqlMove = `SELECT * FROM moves WHERE id = ?`;
    const [resultMove] = await connection.query(sqlMove, move_id);
    console.log(resultMove)
    if (resultMove.length === 0) return res.status(404).json({ error: `not found`, message: `this move (id: ${move_id}) doesn't exists` });
    if (learning_mt && resultMove[0].mt === null) return res.status(400).json({ error: `bad request`, message: `This move isn't an MT` });
    if (learning_mn && resultMove[0].mn === null) return res.status(400).json({ error: `bad request`, message: `This move isn't an MN` });
    if ((!learning_mn && resultMove[0].mn !== null) && (learning_level !== undefined || learning_egg || learning_move_tutor)) return res.status(400).json({ error: `bad request`, message: `This move can be learn it only with MN` });
    if (!learning_mn && !learning_mt && learning_level === undefined && !learning_egg && !learning_move_tutor) return res.status(400).json({ error: `bad request`, message: `The pokemon should be learn the move with the level` });

    const sql = `INSERT INTO pokemon_move (move_id, pokemon_id, learning_gen, learning_level, learning_egg, learning_move_tutor, learning_mt, learning_mn) values (?, ?, ?, ?, ?, ?, ?, ?)`;
    await connection.query(sql, [move_id, pokemonId, learning_gen, learning_level, learning_egg, learning_move_tutor, learning_mt, learning_mn]);

    res.json({
        move_id,
        pokemonId,
        learning_gen,
        learning_level,
        learning_egg,
        learning_move_tutor,
        learning_mt,
        learning_mn
    })

};