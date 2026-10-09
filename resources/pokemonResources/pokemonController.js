import { connection } from '../../data/db.js';
import { notFoundError } from '../../errorFunctions.js';

export const getPokemon = async (req, res) => {

    const sql = `SELECT * FROM pokemon`;

    const [result] = await connection.query(sql);

    if (result.length === 0) return notFoundError(req, res, `pokemon`);

    res.send(result);

};

export const getPokemonById = async (req, res) => {

    const id = Number(req.params.id);
    if (isNaN(id)) res.json({ error: `id error`, message: `The id should be a number` });

    const sqlPokemon = `SELECT * FROM pokemon WHERE id = ?`;
    const sqlType = `
        SELECT
            t.type
        FROM types t
        JOIN pokemon_type pt
        ON pt.type_id = t.id
        WHERE pokemon_id = ?
    `
    const sqlEvolution = `
        SELECT
            e.evo_type,
            e.evo_method,
            i.name item_name,
            pe.name evo_name,
            pe.image evo_image
        FROM evolutions e
        JOIN pokemon p
        on p.id = e.pokemon_id 
        JOIN pokemon pe
        ON pe.id = e.evo_pokemon_id
        LEFT JOIN items i
        ON i.id = e.item_id
        WHERE p.id = ?
    `
    const sqlStats = `
        SELECT
            s.tot_stats,
            s.ps,
            s.attack,
            s.defense,
            s.sp_attack,
            s.sp_defense,
            s.speed
        FROM pokemon p
        JOIN stats s
        ON s.pokemon_id = p.id
        WHERE p.id = ?
    `
    const sqlAbilities = `
        SELECT
            a.name,
            a.effect,
            pa.primary_ability,
            pa.secondary_ability,
            pa.special_ability
        FROM abilities a
        JOIN pokemon_ability pa
        ON pa.ability_id = a.id
        WHERE pokemon_id = ?
    `
    const sqlMoves = `
        SELECT
            m.name,
            t.type,
            m.effect,
            m.attack_type,
            m.damage,
            m.accuracy,
            pm.learning_level,
            m.mt,
            m.mn
        FROM moves m
        JOIN pokemon_move pm
        ON pm.move_id = m.id
        JOIN types t
        ON t.id = m.type_id
        WHERE pokemon_id = ?
    `

    const [[resultPokemon]] = await connection.query(sqlPokemon, id);
    if (resultPokemon === undefined) return notFoundError(req, res, `pokemon`);

    const [resultType] = await connection.query(sqlType, id);
    const [[resultEvolution]] = await connection.query(sqlEvolution, id);
    const [resultMoves] = await connection.query(sqlMoves, id);
    const [resultAbilities] = await connection.query(sqlAbilities, id);
    const [[resultStats]] = await connection.query(sqlStats, id);

    if (resultEvolution !== undefined) resultPokemon.evolution = Object.fromEntries(Object.entries(resultEvolution).filter(([_, value]) => value !== null));
    resultPokemon.stats = resultStats;
    resultPokemon.abilities = resultAbilities.map(ability => Object.fromEntries(Object.entries(ability).filter(([_, value]) => value !== 0)));
    resultPokemon.types = resultType.map(type => type.type);
    resultPokemon.moves = resultMoves.map(move => Object.fromEntries(Object.entries(move).filter(([_, value]) => value !== null)));

    res.send(resultPokemon);

};

export const getPokemonByName = async (req, res) => {

    const name = req.params.name;

    const sql = `SELECT * FROM pokemon WHERE name = ?`;
    const sqlType = `
        SELECT
            t.type
        FROM types t
        JOIN pokemon_type pt
        ON pt.type_id = t.id
        JOIN pokemon p
        ON p.id = pt.pokemon_id
        WHERE p.name = ?
    `
    const sqlEvolution = `
        SELECT
            e.evo_type,
            e.evo_method,
            i.name item_name,
            pe.name evo_name,
            pe.image evo_image
        FROM evolutions e
        JOIN pokemon p
        on p.id = e.pokemon_id 
        JOIN pokemon pe
        ON pe.id = e.evo_pokemon_id
        LEFT JOIN items i
        ON i.id = e.item_id
        WHERE p.name = ?
    `
    const sqlStats = `
        SELECT
            s.tot_stats,
            s.ps,
            s.attack,
            s.defense,
            s.sp_attack,
            s.sp_defense,
            s.speed
        FROM pokemon p
        JOIN stats s
        ON s.pokemon_id = p.id
        WHERE p.name = ?
    `
    const sqlAbilities = `
        SELECT
            a.*,
            pa.primary_ability,
            pa.secondary_ability,
            pa.special_ability
        FROM abilities a
        JOIN pokemon_ability pa
        ON pa.ability_id = a.id
        JOIN pokemon p
        ON p.id = pa.pokemon_id
        WHERE p.name = ?
    `
    const sqlMoves = `
        SELECT
            m.id,
            m.name,
            t.type,
            m.effect,
            m.attack_type,
            m.damage,
            m.accuracy,
            pm.learning_level,
            m.mt,
            m.mn
        FROM moves m
        JOIN pokemon_move pm
        ON pm.move_id = m.id
        JOIN types t
        ON t.id = m.type_id
        JOIN pokemon p
        ON p.id = pm.pokemon_id
        WHERE p.name = ?
    `

    const [[resultPokemon]] = await connection.query(sql, name);
    if (resultPokemon === undefined) return notFoundError(req, res, `pokemon`);

    const [resultType] = await connection.query(sqlType, name);
    const [[resultEvolution]] = await connection.query(sqlEvolution, name);
    const [resultMoves] = await connection.query(sqlMoves, name);
    const [resultAbilities] = await connection.query(sqlAbilities, name);
    const [[resultStats]] = await connection.query(sqlStats, name);

    if (resultEvolution !== undefined) resultPokemon.evolution = Object.fromEntries(Object.entries(resultEvolution).filter(([_, value]) => value !== null));
    resultPokemon.stats = resultStats;
    resultPokemon.abilities = resultAbilities.map(ability => Object.fromEntries(Object.entries(ability).filter(([_, value]) => value !== 0)));
    resultPokemon.types = resultType.map(type => type.type);
    resultPokemon.moves = resultMoves.map(move => Object.fromEntries(Object.entries(move).filter(([_, value]) => value !== null)));

    res.send(resultPokemon);

};

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

export const createPokemonTypes = async (req, res) => { };

export const createPokemonMoves = async (req, res) => { };

export const updatePokemon = async (req, res) => {

    const id = Number(req.params.id);
    if (isNaN(id)) res.json({ error: `id error`, message: `The id should be a number` });

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
        UPDATE pokemon
        SET name = ?,
            height = ?,
            weight = ?,
            n_international = ?,
            generation = ?,
            description = ?,
            male = ?,
            female = ?,
            image = ?
        WHERE id = ?
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
        image,
        id
    ]);

    if (result.affectedRows === 0) return notFoundError(req, res, `pokemon`);

    res.sendStatus(204);

};

export const deletePokemon = async (req, res) => {

    const id = Number(req.params.id);
    if (isNaN(id)) res.json({ error: `id error`, message: `The id should be a number` });

    const sql = `DELETE FROM pokemon WHERE id = ?`

    await connection.query(sql, id);

    res.sendStatus(204);

};