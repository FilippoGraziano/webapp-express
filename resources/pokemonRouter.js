import express from "express";
import { connection } from '../data/db.js';

export const routerPokemon = express.Router();

routerPokemon.get('/', async (req, res) => {

    const sql = `SELECT * FROM pokemon`;

    const [result] = await connection.query(sql);

    if (result.length === 0) res.status(404).json({ error: `not found`, message: `list of pokemon not found` })

    res.send(result);

})

routerPokemon.get(`/:id`, async (req, res) => {

    const id = req.params.id;
    const sql = `SELECT * FROM pokemon WHERE id = ?`;

    const [result] = await connection.query(sql, id);

    if (result.length === 0) res.status(404).json({ error: `not found`, message: `pokemon with this id (${req.path}) not found` })

    res.send(result);
    
})