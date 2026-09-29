import { connection } from '../data/db.js';

export const getPokemon = async (req, res) => {

    const sql = `SELECT * FROM pokemon`;

    const [result] = await connection.query(sql);

    if (result.length === 0) res.status(404).json({ error: `not found`, message: `list of pokemon not found` })

    res.send(result);

};

export const getPokemonById = async (req, res) => {

    const id = req.params.id;
    const sql = `SELECT * FROM pokemon WHERE id = ?`;

    const [result] = await connection.query(sql, id);

    if (result.length === 0) res.status(404).json({ error: `not found`, message: `pokemon with this path (${req.path}) not found` })

    res.send(result);

};

export const getPokemonByName = async (req, res) => {

    const name = req.params.name;
    const sql = `SELECT * FROM pokemon WHERE name = ?`;

    const [result] = await connection.query(sql, name);

    if (result.length === 0) res.status(404).json({ error: `not found`, message: `pokemon with this path (${req.path}) not found` })

    res.send(result);

};

export const createPokemon = async (req, res) => {

    const {
        name,
        height,
        weight,
        n_regional,
        n_international,
        generation,
        description,
        male,
        female,
        image,
        evolution_level,
        evolution_stone,
        evolution_trade,
        evolution_friendship
    } = req.body
    if (name === undefined) res.json({ error: `body request error`, message: `you have to insert the name of the pokemon` });
    if (height === undefined) res.json({ error: `body request error`, message: `you have to insert the height of the pokemon` });
    if (weight === undefined) res.json({ error: `body request error`, message: `you have to insert the wheigth of the pokemon` });
    if (n_regional === undefined) res.json({ error: `body request error`, message: `you have to insert the regional number of the pokemon` });
    if (n_international === undefined) res.json({ error: `body request error`, message: `you have to insert the international number of the pokemon` });
    if (generation === undefined) res.json({ error: `body request error`, message: `you have to insert the generation of the pokemon` });
    if (description === undefined) res.json({ error: `body request error`, message: `you have to insert the description of the pokemon` });
    if (male === undefined) res.json({ error: `body request error`, message: `you have to insert the chance of found a male species of the pokemon` });
    if (female === undefined) res.json({ error: `body request error`, message: `you have to insert the chance of found a female species of the pokemon` });
    if (image === undefined) res.json({ error: `body request error`, message: `you have to insert the image of the pokemon` });
    if (evolution_level === undefined) res.json({ error: `body request error`, message: `you have to insert the level for the evolution of the pokemon` });
    if (evolution_stone === undefined) res.json({ error: `body request error`, message: `you have to insert if the pokemon evolve with the stone` });
    if (evolution_trade === undefined) res.json({ error: `body request error`, message: `you have to insert if the pokemon evolve with the trade` });
    if (evolution_friendship === undefined) res.json({ error: `body request error`, message: `you have to insert if the pokemon evolve with the friendship` });


    const sql = `
        INSERT INTO pokemon ( name, height, weight, n_regional, n_international, generation, description, male, female, image, evolution_level, evolution_stone, evolution_trade, evolution_friendship ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )
    `
    const [result] = await connection.query(sql, [
        name,
        height,
        weight,
        n_regional,
        n_international,
        generation,
        description,
        male,
        female,
        image,
        evolution_level,
        evolution_stone,
        evolution_trade,
        evolution_friendship
    ]);

    res.json({
        id: result.insertId,
        name,
        height,
        weight,
        n_regional,
        n_international,
        generation,
        description,
        male,
        female,
        image,
        evolution_level,
        evolution_stone,
        evolution_trade,
        evolution_friendship
    })

};

export const updatePokemon = async (req, res) => {

    const {
        name,
        height,
        weight,
        n_regional,
        n_international,
        generation,
        description,
        male,
        female,
        image,
        evolution_level,
        evolution_stone,
        evolution_trade,
        evolution_friendship
    } = req.body
    if (name === undefined) res.json({ error: `body request error`, message: `you have to insert the name of the pokemon` });
    if (height === undefined) res.json({ error: `body request error`, message: `you have to insert the height of the pokemon` });
    if (weight === undefined) res.json({ error: `body request error`, message: `you have to insert the wheigth of the pokemon` });
    if (n_regional === undefined) res.json({ error: `body request error`, message: `you have to insert the regional number of the pokemon` });
    if (n_international === undefined) res.json({ error: `body request error`, message: `you have to insert the international number of the pokemon` });
    if (generation === undefined) res.json({ error: `body request error`, message: `you have to insert the generation of the pokemon` });
    if (description === undefined) res.json({ error: `body request error`, message: `you have to insert the description of the pokemon` });
    if (male === undefined) res.json({ error: `body request error`, message: `you have to insert the chance of found a male species of the pokemon` });
    if (female === undefined) res.json({ error: `body request error`, message: `you have to insert the chance of found a female species of the pokemon` });
    if (image === undefined) res.json({ error: `body request error`, message: `you have to insert the image of the pokemon` });
    if (evolution_level === undefined) res.json({ error: `body request error`, message: `you have to insert the level for the evolution of the pokemon` });
    if (evolution_stone === undefined) res.json({ error: `body request error`, message: `you have to insert if the pokemon evolve with the stone` });
    if (evolution_trade === undefined) res.json({ error: `body request error`, message: `you have to insert if the pokemon evolve with the trade` });
    if (evolution_friendship === undefined) res.json({ error: `body request error`, message: `you have to insert if the pokemon evolve with the friendship` });

    
    const id = req.params.id

    const sql = `
        UPDATE pokemon
        SET name = ?,
            height = ?,
            weight = ?,
            n_regional = ?,
            n_international = ?,
            generation = ?,
            description = ?,
            male = ?,
            female = ?,
            image = ?,
            evolution_level = ?,
            evolution_stone = ?,
            evolution_trade = ?,
            evolution_friendship = ?
        WHERE id = ?
    `

    const [result] = await connection.query(sql, [
        name,
        height,
        weight,
        n_regional,
        n_international,
        generation,
        description,
        male,
        female,
        image,
        evolution_level,
        evolution_stone,
        evolution_trade,
        evolution_friendship,
        id
    ]);

    if (result.affectedRows === 0) res.status(404).json({ error: `not found`, message: `pokemon with this path (${req.path}) not found` })

    res.sendStatus(204);

};

export const deletePokemon = async (req, res) => { };