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
    if (isNaN(id)) return res.json({ error: `id error`, message: `The id should be a number` });

    const sqlPokemon = `SELECT * FROM pokemon WHERE id = ?`;
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
            a.*,
            pa.primary_ability,
            pa.secondary_ability,
            pa.special_ability
        FROM abilities a
        JOIN pokemon_ability pa
        ON pa.ability_id = a.id
        WHERE pokemon_id = ?
    `
    const sqlType = `
        SELECT
            t.type
        FROM types t
        JOIN pokemon_type pt
        ON pt.type_id = t.id
        WHERE pokemon_id = ?
    `
    const sqlGames = `
        SELECT
            pg.id,
            g.name,
            g.region,
            g.region_2,
            pg.pokemon_n_regional,
            pg.pokedex_zone,
            pg.regional_form
        FROM pokemon_game pg
        JOIN pokemon p
        ON p.id = pg.pokemon_id
        JOIN games g
        ON g.id = pg.game_id
        WHERE p.id = ?
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
        WHERE pokemon_id = ?
    `

    const [[resultPokemon]] = await connection.query(sqlPokemon, id);
    if (resultPokemon === undefined) return notFoundError(req, res, `pokemon`);

    const [[resultEvolution]] = await connection.query(sqlEvolution, id);
    const [[resultStats]] = await connection.query(sqlStats, id);
    const [resultAbilities] = await connection.query(sqlAbilities, id);
    const [resultType] = await connection.query(sqlType, id);
    const [resultGames] = await connection.query(sqlGames, id);
    const [resultMoves] = await connection.query(sqlMoves, id);

    if (resultEvolution !== undefined) resultPokemon.evolution = Object.fromEntries(Object.entries(resultEvolution).filter(([_, value]) => value !== null));
    resultPokemon.stats = resultStats;
    resultPokemon.abilities = resultAbilities.map(ability => Object.fromEntries(Object.entries(ability).filter(([_, value]) => value !== 0)));
    resultPokemon.types = resultType.map(type => type.type);
    resultPokemon.games = resultGames.map(game => Object.fromEntries(Object.entries(game).filter(([_, value]) => value !== null)));
    resultPokemon.moves = resultMoves.map(move => Object.fromEntries(Object.entries(move).filter(([_, value]) => value !== null)));

    res.send(resultPokemon);

};

export const getPokemonByName = async (req, res) => {

    const name = req.params.name;
    if (typeof name === `number`) return res.json({error: `bad request`, message: `the name should be a string`})

    const sql = `SELECT * FROM pokemon WHERE name = ?`;
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
    const sqlGames = `
        SELECT
            pg.id,
            g.name,
            g.region,
            g.region_2,
            pg.pokemon_n_regional,
            pg.pokedex_zone,
            pg.regional_form
        FROM pokemon_game pg
        JOIN pokemon p
        ON p.id = pg.pokemon_id
        JOIN games g
        ON g.id = pg.game_id
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

    const [[resultEvolution]] = await connection.query(sqlEvolution, name);
    const [[resultStats]] = await connection.query(sqlStats, name);
    const [resultAbilities] = await connection.query(sqlAbilities, name);
    const [resultType] = await connection.query(sqlType, name);
    const [resultGames] = await connection.query(sqlGames, name);
    const [resultMoves] = await connection.query(sqlMoves, name);

    if (resultEvolution !== undefined) resultPokemon.evolution = Object.fromEntries(Object.entries(resultEvolution).filter(([_, value]) => value !== null));
    resultPokemon.stats = resultStats;
    resultPokemon.abilities = resultAbilities.map(ability => Object.fromEntries(Object.entries(ability).filter(([_, value]) => value !== 0)));
    resultPokemon.types = resultType.map(type => type.type);
    resultPokemon.games = resultGames.map(game => Object.fromEntries(Object.entries(game).filter(([_, value]) => value !== null)));
    resultPokemon.moves = resultMoves.map(move => Object.fromEntries(Object.entries(move).filter(([_, value]) => value !== null)));

    res.send(resultPokemon);

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
    if (name === undefined || name === ``) return res.json({ error: `body request error`, message: `you have to insert the name of the pokemon` });
    if (typeof name !== `string`) return res.json({ error: `body request error`, message: `the name should be a string` });
    if (name.length < 3) return res.json({ error: `body request error`, message: `you have to insert a longest name` });

    if (height === undefined) return res.json({ error: `body request error`, message: `you have to insert the height of the pokemon` });
    if (typeof height !== `number`) return res.json({ error: `body request error`, message: `the height should be a number` });
    if (height < 0.1) return res.json({ error: `body request error`, message: `the height should be bigger than 0` });

    if (weight === undefined) return res.json({ error: `body request error`, message: `you have to insert the wheigth of the pokemon` });
    if (typeof weight !== `number`) return res.json({ error: `body request error`, message: `the weight should be a number` });
    if (weight < 0.1) return res.json({ error: `body request error`, message: `the weight should be bigger than 0` });

    if (n_international === undefined) return res.json({ error: `body request error`, message: `you have to insert the international number of the pokemon` });
    if (typeof n_international !== `number`) return res.json({ error: `body request error`, message: `the n_internationl should be a number` });
    if (n_international < 1) return res.json({ error: `body request error`, message: `the n_internationl should be bigger than 0` });

    if (generation === undefined) return res.json({ error: `body request error`, message: `you have to insert the generation of the pokemon` });
    if (typeof generation !== `number`) return res.json({ error: `body request error`, message: `the generation should be a number` });
    if (generation < 1) return res.json({ error: `body request error`, message: `the generation should be bigger than 0` });
    if (generation > 10) return res.json({ error: `body request error`, message: `the generation shouldn't be bigger than 10` });

    if (description === undefined) return res.json({ error: `body request error`, message: `you have to insert the description of the pokemon` });
    if (typeof description !== `string`) return res.json({ error: `body request error`, message: `the description should be a string` });
    if (description.length < 15) return res.json({ error: `body request error`, message: `you have to insert a longest description` });

    if (male === undefined) return res.json({ error: `body request error`, message: `you have to insert the chance of found a male species of the pokemon` });
    if (typeof male !== `number`) return res.json({ error: `body request error`, message: `the percent of male should be a number` });
    if (male < 0) return res.json({ error: `body request error`, message: `the percent of male can't be a negative number` });
    if (male > 100) return res.json({ error: `body request error`, message: `the percent of male can't be bigger than 100` });

    if (female === undefined) return res.json({ error: `body request error`, message: `you have to insert the chance of found a female species of the pokemon` });
    if (typeof female !== `number`) return res.json({ error: `body request error`, message: `the percent of female should be a number` });
    if (female < 0) return res.json({ error: `body request error`, message: `the percent of female can't be a negative number` });
    if (female > 100) return res.json({ error: `body request error`, message: `the percent of female can't be bigger than 100` });

    if (image === undefined) return res.json({ error: `body request error`, message: `you have to insert the image of the pokemon` });
    if (image.includes(`..`)) return res.json({ error: `body request error`, message: `the image file/name shouldn't includes '..'` });
    const regex = /\.\s*(?!png\b)\w+/i;
    if (regex.test(image)) return res.json({ error: `body request error`, message: `the image file/name should be '.png'` });
    
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