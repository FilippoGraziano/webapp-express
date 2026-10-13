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

export const getGamesByName = async (req, res) => {

};

export const createGames = async (req, res) => {

};

export const updateGames = async (req, res) => {

};

export const deleteGames = async (req, res) => {

};
