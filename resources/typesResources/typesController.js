import { connection } from '../../data/db.js';
import { notFoundError } from '../../errorFunctions.js';

export const getTypes = async (req, res) => {

    const sql = `SELECT * FROM types ORDER BY id`;

    const [result] = await connection.query(sql);

    if (result.length === 0) return notFoundError(req, res, `type`);

    res.send(result);

};

export const getTypesById = async (req, res) => {

    const id = Number(req.params.id);
    if (isNaN(id)) res.json({ error: `id error`, message: `The id should be a number` });

    const sql = `SELECT * FROM types WHERE id = ?`;

    const [result] = await connection.query(sql, id);

    if (result.length === 0) return notFoundError(req, res, `type`);

    res.send(result);

};

export const getTypesByName = async (req, res) => {

    const name = req.params.name;
    const sql = `SELECT * FROM types WHERE type = ?`;

    const [result] = await connection.query(sql, name);

    if (result.length === 0) return notFoundError(req, res, `type`);

    res.send(result);

};

export const createTypes = async (req, res) => {

    const { type } = req.body
    if (type === undefined) res.json({ error: `body request error`, message: `you have to insert the type` });


    const sql = `INSERT INTO types (type) VALUES (?)`
    const [result] = await connection.query(sql, [type]);

    res.json({
        id: result.insertId,
        type
    })

};

export const updateTypes = async (req, res) => {

    const id = Number(req.params.id);
    if (isNaN(id)) res.json({ error: `id error`, message: `The id should be a number` });

    const { type } = req.body
    if (type === undefined) res.json({ error: `body request error`, message: `you have to insert the type` });


    const sql = `
        UPDATE types
        SET type = ?
        WHERE id = ?
    `
    const [result] = await connection.query(sql, [type, id]);

    if (result.affectedRows === 0) return notFoundError(req, res, `type`);

    res.sendStatus(204);

};

export const deleteTypes = async (req, res) => {

    const id = Number(req.params.id);
    if (isNaN(id)) res.json({ error: `id error`, message: `The id should be a number` });

    const sql = `DELETE FROM types WHERE id = ?`

    await connection.query(sql, id);

    res.sendStatus(204);

};
