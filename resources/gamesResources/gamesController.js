import { connection } from '../../data/db.js';
import { notFoundError } from '../../errorFunctions.js';

export const getGames = async (req, res) => {

    const sql = `SELECT * FROM games`;

    const [result] = await connection.query(sql);

    if (result.length === 0) return notFoundError(req, res, `games`);

    res.send(result);

};

export const getGamesById = async (req, res) => {

    const id = Number(req.params.id);
    if (isNaN(id)) res.json({ error: `id error`, message: `The id should be a number` });

    const sql = `SELECT * FROM games WHERE id = ?`;

    const [result] = await connection.query(sql, id);
    if (result.length === 0) return notFoundError(req, res, `games`);

    res.send(result);

};

export const createGames = async (req, res) => {

    const { name, region, region_2 } = req.body
    if (name === undefined) res.json({ error: `body request error`, message: `you have to insert the name` });
    if (region === undefined) res.json({ error: `body request error`, message: `you have to insert the region` });


    const sql = `INSERT INTO games (name, region, region_2) VALUES (?, ?, ?)`
    const [result] = await connection.query(sql, [name, region, region_2]);

    res.json({
        id: result.insertId,
        name,
        region,
        region_2
    })

};

export const updateGames = async (req, res) => {

    const id = Number(req.params.id);
    if (isNaN(id)) res.json({ error: `id error`, message: `The id should be a number` });

    const { name, region, region_2 } = req.body
    if (name === undefined) res.json({ error: `body request error`, message: `you have to insert the name` });
    if (region === undefined) res.json({ error: `body request error`, message: `you have to insert the region` });

    let sql = `
        UPDATE games
        SET name = ?,
            region = ?
        WHERE id = ?
    `;
    if (region_2 !== undefined) sql =`
        UPDATE games
        SET name = ?,
            region = ?,
            region_2 = ?
        WHERE id = ?
    `;

    let result;
    if (region_2 !== undefined) [result] = await connection.query(sql, [name, region, region_2, id])
    else [result] = await connection.query(sql, [name, region, id]);

    if (result.affectedRows === 0) return notFoundError(req, res, `games`);

    res.sendStatus(204);

};

export const deleteGames = async (req, res) => {

    const id = Number(req.params.id);
    if (isNaN(id)) res.json({ error: `id error`, message: `The id should be a number` });

    const sql = `DELETE FROM games WHERE id = ?`

    await connection.query(sql, id);

    res.sendStatus(204);

};
