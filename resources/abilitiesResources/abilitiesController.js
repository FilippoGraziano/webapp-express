import { connection } from '../../data/db.js';
import { notFoundError } from '../../errorFunctions.js';

export const getAbilities = async (req, res) => {

    const sql = `SELECT * FROM abilities`;

    const [result] = await connection.query(sql);

    if (result.length === 0) return notFoundError(req, res, `ability`);

    res.send(result);

};

export const getAbilitiesById = async (req, res) => {

    const id = Number(req.params.id);
    if (isNaN(id)) res.json({ error: `id error`, message: `The id should be a number` });

    const sql = `SELECT * FROM ABILITIES WHERE id = ?`;

    const [result] = await connection.query(sql, id);

    if (result.length === 0) return notFoundError(req, res, `ability`);

    res.send(result);

};

export const getAbilitiesByName = async (req, res) => {

    const name = req.params.name;
    const sql = `SELECT * FROM abilities WHERE name = ?`;

    const [result] = await connection.query(sql, name);

    if (result.length === 0) return notFoundError(req, res, `ability`);

    res.send(result);

};

export const createAbilities = async (req, res) => {

    const { name, effect } = req.body
    if (name === undefined) res.json({ error: `body request error`, message: `you have to insert the name` });
    if (effect === undefined) res.json({ error: `body request error`, message: `you have to insert the effect` });


    const sql = `INSERT INTO abilities (name, effect) VALUES (?, ?)`
    const [result] = await connection.query(sql, [name, effect]);

    res.json({
        id: result.insertId,
        name,
        effect
    })

};

export const updateAbilities = async (req, res) => {

    const id = Number(req.params.id);
    if (isNaN(id)) res.json({ error: `id error`, message: `The id should be a number` });

    const { name, effect } = req.body
    if (name === undefined) res.json({ error: `body request error`, message: `you have to insert the name` });
    if (effect === undefined) res.json({ error: `body request error`, message: `you have to insert the effect` });


    const sql = `
        UPDATE abilities
        SET name = ?,
            effect = ?
        WHERE id = ?
    `
    const [result] = await connection.query(sql, [name, effect, id]);

    if (result.affectedRows === 0) return notFoundError(req, res, `abilities`);

    res.sendStatus(204);

};

export const deleteAbilities = async (req, res) => {

    const id = Number(req.params.id);
    if (isNaN(id)) res.json({ error: `id error`, message: `The id should be a number` });

    const sql = `DELETE FROM abilities WHERE id = ?`

    await connection.query(sql, id);

    res.sendStatus(204);

};
