import { connection } from '../../data/db.js';
import { notFoundError } from '../../errorMiddleware.js';

export const getMoves = async (req, res) => {

    const sql = `SELECT * FROM moves ORDER BY id`;

    const [result] = await connection.query(sql);

    if (result.length === 0) notFoundError(req, res, `moves`);

    res.send(result);

};

export const getMovesById = async (req, res) => {

    const id = Number(req.params.id);
    if (isNaN(id)) res.json({ error: `id error`, message: `The id should be a number` });

    const sql = `SELECT * FROM moves WHERE id = ?`;

    const [result] = await connection.query(sql, id);

    if (result.length === 0) notFoundError(req, res, `moves`);

    res.send(result);

};

export const getMovesByName = async (req, res) => {

    const name = req.params.name;
    const sql = `SELECT * FROM moves WHERE type = ?`;

    const [result] = await connection.query(sql, name);

    if (result.length === 0) notFoundError(req, res, `moves`);

    res.send(result);

};

export const createMoves = async (req, res) => {

    const { type_id, name, effect, attack_type, damage, accuracy, mt, mn } = req.body

    if (type_id === undefined) res.json({ error: `body request error`, message: `you have to insert the type_id` });
    const typeSql = `SELECT * FROM types WHERE id = ?`
    const [typeResult] = await connection.query(typeSql, type_id);
    if (typeResult.length === 0) res.status(404).json({ error: `not found`, message: `type with id ${type_id} doesn't exist` })

    if (name === undefined) res.json({ error: `body request error`, message: `you have to insert the name` });
    if (effect === undefined) res.json({ error: `body request error`, message: `you have to insert the effect` });
    if (attack_type === undefined) res.json({ error: `body request error`, message: `you have to insert the attack_type` });
    if (damage === undefined) res.json({ error: `body request error`, message: `you have to insert the damage` });
    if (accuracy === undefined) res.json({ error: `body request error`, message: `you have to insert the accuracy` });
    if (mt === undefined) res.json({ error: `body request error`, message: `you have to insert the number of the mt` });
    if (mn === undefined) res.json({ error: `body request error`, message: `you have to insert the number of the mn` });


    const sql = `INSERT INTO moves (type_id, name, effect, attack_type, damage, accuracy, mt, mn) VALUES (?, ?, ?, ?, ?, ?, ?, ? )`
    const [result] = await connection.query(sql, [type_id, name, effect, attack_type, damage, accuracy, mt, mn]);

    res.json({
        id: result.insertId,
        type_id,
        name,
        effect,
        attack_type,
        damage,
        accuracy,
        mt,
        mn,
    })

};

export const updateMoves = async (req, res) => {

    const id = Number(req.params.id);
    if (isNaN(id)) res.json({ error: `id error`, message: `The id should be a number` });

    const { type_id, name, effect, attack_type, damage, accuracy, mt, mn } = req.body

    if (type_id === undefined) res.json({ error: `body request error`, message: `you have to insert the type_id` });
    const typeSql = `SELECT * FROM types WHERE id = ?`
    const [typeResult] = await connection.query(typeSql, type_id);
    if (typeResult.length === 0) res.status(404).json({ error: `not found`, message: `type with id ${type_id} doesn't exist` })

    if (name === undefined) res.json({ error: `body request error`, message: `you have to insert the name` });
    if (effect === undefined) res.json({ error: `body request error`, message: `you have to insert the effect` });
    if (attack_type === undefined) res.json({ error: `body request error`, message: `you have to insert the attack_type` });
    if (damage === undefined) res.json({ error: `body request error`, message: `you have to insert the damage` });
    if (accuracy === undefined) res.json({ error: `body request error`, message: `you have to insert the accuracy` });
    if (mt === undefined) res.json({ error: `body request error`, message: `you have to insert the number of the mt` });
    if (mn === undefined) res.json({ error: `body request error`, message: `you have to insert the number of the mn` });


    const sql = `
        UPDATE moves
        SET type_id = ?, 
            name = ?, 
            effect = ?, 
            attack_type = ?, 
            damage = ?, 
            accuracy = ?, 
            mt = ?, 
            mn = ?
        WHERE id = ?
    `
    const [result] = await connection.query(sql, [type_id, name, effect, attack_type, damage, accuracy, mt, mn, id]);

    if (result.affectedRows === 0) notFoundError(req, res, `type`);

    res.sendStatus(204);

};

export const deleteMoves = async (req, res) => {

    const id = Number(req.params.id);
    if (isNaN(id)) res.json({ error: `id error`, message: `The id should be a number` });

    const sql = `DELETE FROM moves WHERE id = ?`

    await connection.query(sql, id);

    res.sendStatus(204);

};
