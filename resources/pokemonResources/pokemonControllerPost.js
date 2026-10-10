
import { connection } from '../../data/db.js';

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
    if (name === undefined) res.json({ error: `body request error`, message: `you have to insert the name of the pokemon` });
    if (height === undefined) res.json({ error: `body request error`, message: `you have to insert the height of the pokemon` });
    if (weight === undefined) res.json({ error: `body request error`, message: `you have to insert the wheigth of the pokemon` });
    if (n_international === undefined) res.json({ error: `body request error`, message: `you have to insert the international number of the pokemon` });
    if (generation === undefined) res.json({ error: `body request error`, message: `you have to insert the generation of the pokemon` });
    if (description === undefined) res.json({ error: `body request error`, message: `you have to insert the description of the pokemon` });
    if (male === undefined) res.json({ error: `body request error`, message: `you have to insert the chance of found a male species of the pokemon` });
    if (female === undefined) res.json({ error: `body request error`, message: `you have to insert the chance of found a female species of the pokemon` });
    if (image === undefined) res.json({ error: `body request error`, message: `you have to insert the image of the pokemon` });

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

    const pokemonId = req.params.id;

    const { evo_type, item_id, evo_method, evo_pokemon_id } = req.body;
    if (evo_type === undefined) return res.json({ error: `body request error`, message: `you have to insert the type of evolution` });
    if (evo_method === undefined) return res.json({ error: `body request error`, message: `you have to insert the method of evolution` });
    if (evo_pokemon_id === undefined) return res.json({ error: `body request error`, message: `you have to insert the evolved pokemon ` });
    if (item_id !== undefined) {
        const sqlItem = ` SELECT * FROM items WHERE id = ? `;
        const [resultItem] = await connection.query(sqlItem, item_id);
        if (resultItem.length === 0) return res.json({ error: `not found`, message: `item with this id (${item_id}) doesn't exist` });
    }

    const sqlEvoPok = ` SELECT * FROM pokemon WHERE id = ? `;
    const [resultEvoPok] = await connection.query(sqlEvoPok, evo_pokemon_id);
    if (resultEvoPok.length === 0) return res.json({ error: `not found`, message: `pokemon with this id (${evo_pokemon_id}) doesn't exist` });

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

    const pokemonId = req.params.id;

    const { tot_stats, ps, attack, defense, sp_attack, sp_defense, speed } = req.body;
    if (tot_stats === undefined) return res.json({ error: `body request error`, message: `you have to insert the total stats of pokemon` });
    if (ps === undefined) return res.json({ error: `body request error`, message: `you have to insert the ps of pokemon` });
    if (attack === undefined) return res.json({ error: `body request error`, message: `you have to insert the attack of pokemon` });
    if (defense === undefined) return res.json({ error: `body request error`, message: `you have to insert the defense of pokemon` });
    if (sp_attack === undefined) return res.json({ error: `body request error`, message: `you have to insert the special attack of pokemon` });
    if (sp_defense === undefined) return res.json({ error: `body request error`, message: `you have to insert the special defense of pokemon` });
    if (speed === undefined) return res.json({ error: `body request error`, message: `you have to insert the speed of pokemon` });

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

    const pokemonId = req.params.id;

    const { ability_id, primary_ability, secondary_ability, special_ability } = req.body;
    if (ability_id === undefined) return res.json({ error: `body request error`, message: `you have to insert the ability of pokemon` });
    if (primary_ability === undefined) return res.json({ error: `body request error`, message: `Is a primary ability?` });
    if (secondary_ability === undefined) return res.json({ error: `body request error`, message: `Is a secondary ability?` });
    if (special_ability === undefined) return res.json({ error: `body request error`, message: `Is a special ability?` });

    const sqlAbility = `SELECt * FROM abilities WHERE id = ?`;
    const [resultAbility] = await connection.query(sqlAbility, ability_id);
    if (resultAbility.length === 0) return res.json({ error: `not found`, message: `Ability with this id (${ability_id}) doesn't exist` })

    if (primary_ability && secondary_ability) return res.json({ error: `bad request`, message: `Only one of the 'primary_ability' or 'seondary_ability' should be TRUE` });
    if (primary_ability && special_ability) return res.json({ error: `bad request`, message: `Only one of the 'primary_ability' or 'special_ability' should be TRUE` });
    if (secondary_ability && special_ability) return res.json({ error: `bad request`, message: `Only one of the 'secondary_ability' or 'special_ability' should be TRUE` });
    if (!primary_ability && !secondary_ability && !special_ability) return res.json({ error: `bad request`, message: `One of the 'primary_ability', 'seondary_ability' or 'special_ability' should be TRUE` });

    const sqlSame = `SELECT * FROM pokemon_ability WHERE pokemon_id = ?`
    const [resultSame] = await connection.query(sqlSame, pokemonId)
    if (resultSame.length !== 0) {

        let ability1;
        let ability2;
        let ability3;
        resultSame.forEach((ability, i) => (
            i === 0 ?
                ability1 = ability.ability_id :
                i === 1 ?
                    ability2 = ability.ability_id :
                    i === 2 ?
                        ability3 = ability.ability_id :
                        undefined
        ));
        if (ability_id === ability1 || ability_id === ability2 || ability_id === ability3) return res.json({ error: `bad request`, message: `This pokemon already has this ability` });

        if (primary_ability) {
            let primary = 0;
            resultSame.forEach((ability, i) => (
                ability.primary_ability === 1 ?
                    primary = 1 :
                    undefined
            ));
            if (primary === 1) return res.json({ error: `bad request`, message: `The primary ability already exists` });
        }
        if (secondary_ability) {
            let secondary = 0;
            resultSame.forEach((ability, i) => (
                ability.secondary_ability === 1 ?
                    secondary = 1 :
                    undefined
            ));
            if (secondary === 1) return res.json({ error: `bad request`, message: `The secondary ability already exists` });
        }
        if (special_ability) {
            let special = 0;
            resultSame.forEach((ability, i) => (
                ability.special_ability === 1 ?
                    special = 1 :
                    undefined
            ));
            if (special === 1) return res.json({ error: `bad request`, message: `The special ability already exists` });
        }
    }

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

    const pokemonId = req.params.id;

    const { type_id } = req.body;
    if (type_id === undefined) return res.json({ error: `bad request`, message: `You have to insert the type of pokemon` });

    const sqlType = `SELECT * FROM types WHERE id = ?`;
    const [resultType] = await connection.query(sqlType, type_id);
    if (resultType.length === 0) return res.json({ error: `not found`, message: `Type with this id (${type_id}) doesn't exists` });

    const sqlControll = `SELECT * FROM pokemon_type WHERE pokemon_id = ?`;
    const [resultControll] = await connection.query(sqlControll, pokemonId);
    if (resultControll.length === 1 && type_id === resultControll[0].type_id) return res.json({ error: `bad request`, message: `The pokemon already has this type` });
    if (resultControll.length === 2) return res.json({ error: `bad request`, message: `The pokemon can't have more than 2 types` });

    const sql = `INSERT INTO pokemon_type (pokemon_id, type_id) values (?, ?)`;
    await connection.query(sql, [pokemonId, type_id]);

    res.json({
        pokemonId,
        type_id
    });
};

export const createPokemonMoves = async (req, res) => {

    const pokemonId = req.params.id;

    const { move_id, learning_gen, learning_level, learning_egg, learning_move_tutor, learning_mt, learning_mn } = req.body;
    if (move_id === undefined) return res.json({ error: `bad request`, message: `You have to insert the move id` });
    if (learning_gen === undefined) return res.json({ error: `bad request`, message: `You have to insert learning gen` });
    if (learning_level !== undefined) {
        if (isNaN(learning_level) || learning_level === ``) return res.json({ error: `bad request`, message: `The level should be a number` });
    }
    if (learning_egg === undefined) return res.json({ error: `bad request`, message: `Does it learn it from egg?` });
    if (learning_move_tutor === undefined) return res.json({ error: `bad request`, message: `Does it learn it from move tutor?` });
    if (learning_mt === undefined) return res.json({ error: `bad request`, message: `Does it learn it from MT?` });
    if (learning_mn === undefined) return res.json({ error: `bad request`, message: `Does it learn it from MN?` });

    const sqlControll = `SELECT * FROM pokemon_move WHERE pokemon_id = ?`;
    const [resultControll] = await connection.query(sqlControll, pokemonId);
    const learnedMove = resultControll.filter(move => move.move_id === move_id);
    if (learnedMove.length !== 0) return res.json({ error: `bad request`, message: `This pokemon already has this move` });

    const sqlMove = `SELECT * FROM moves WHERE id = ?`;
    const [resultMove] = await connection.query(sqlMove, move_id);
    if (resultMove.length === 0) return res.json({ error: `not found`, message: `Move with this id (${move_id}) doesn't exists` });
    if (learning_mt && resultMove[0].mt === null) return res.json({ error: `bad request`, message: `This move isn't an MT` });
    if (learning_mn && resultMove[0].mn === null) return res.json({ error: `bad request`, message: `This move isn't an MN` });
    if ((!learning_mn && resultMove[0].mn !== null) || (learning_level !== undefined || learning_egg || learning_move_tutor)) return res.json({ error: `bad request`, message: `This move can be learn it only with MN` });
    if (!learning_mn && !learning_mt && learning_level === undefined && !learning_egg && !learning_move_tutor) return res.json({ error: `bad request`, message: `The pokemon should be learn the move with the level` });

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