
import { connection } from '../../data/db.js';
import { notFoundError } from '../../errorFunctions.js';

export const getItems = async (req, res) => {

    const sql = `SELECT * FROM items`;

    const [result] = await connection.query(sql);

    if (result.length === 0) return notFoundError(req, res, `items`);

    res.send(result);

};

export const getItemsById = async (req, res) => {

    const id = Number(req.params.id);
    if (isNaN(id)) res.json({ error: `id error`, message: `The id should be a number` });

    const sqlItem = `SELECT * FROM items WHERE id = ?`;
    const sqlGames = `
        SELECT
            g.name,
            ig.effect
        FROM games g
        JOIN item_game ig
        ON ig.game_id = g.id
        JOIN items i
        ON i.id = ig.item_id
        WHERE i.id = ?
    `

    const [[resultItem]] = await connection.query(sqlItem, id);
    if (resultItem === undefined) return notFoundError(req, res, `items`);

    const [resultGames] = await connection.query(sqlGames, id);

    resultItem.games = resultGames;

    res.send(resultItem);

};

export const getItemsByName = async (req, res) => {

    const name = req.params.name;

    const sqlItem = `SELECT * FROM items WHERE name = ?`;
    const sqlGames = `
        SELECT
            g.name,
            ig.effect
        FROM games g
        JOIN item_game ig
        ON ig.game_id = g.id
        JOIN items i
        ON i.id = ig.item_id
        WHERE i.name = ?
    `

    const [[resultItem]] = await connection.query(sqlItem, name);
    if (resultItem === undefined) return notFoundError(req, res, `items`);

    const [resultGames] = await connection.query(sqlGames, name);

    resultItem.games = resultGames;

    res.send(resultItem);

};

export const createItems = async (req, res) => {

    const { name, type } = req.body
    if (name === undefined) res.json({ error: `body request error`, message: `you have to insert the name` });
    if (type === undefined) res.json({ error: `body request error`, message: `you have to insert the type` });


    const sql = `INSERT INTO items (name, type) VALUES (?, ?)`
    const [result] = await connection.query(sql, [name, type]);

    res.json({
        id: result.insertId,
        name,
        type
    })

};

export const updateItems = async (req, res) => { };

export const deleteItems = async (req, res) => { };
