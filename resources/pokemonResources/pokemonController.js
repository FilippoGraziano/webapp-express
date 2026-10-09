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