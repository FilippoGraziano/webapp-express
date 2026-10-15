import { connection } from '../../data/db.js';

export const deletePokemon = async (req, res) => {

    const pokemonId = Number(req.params.id);
    if (typeof pokemonId !== `number`) res.json({ error: `id error`, message: `The id should be a number` });

    const sql = `DELETE FROM pokemon WHERE id = ?`

    await connection.query(sql, pokemonId);

    res.sendStatus(204);

};

export const deletePokemonEvolution = async (req, res) => {

    const pokemonId = Number(req.params.id);
    if (typeof pokemonId !== `number`) res.json({ error: `id error`, message: `The id should be a number` });

    const sql = `DELETE FROM evolutions WHERE pokemon_id = ?`

    await connection.query(sql, pokemonId);

    res.sendStatus(204);

};

export const deletePokemonStats = async (req, res) => {

    const pokemonId = Number(req.params.id);
    if (typeof pokemonId !== `number`) res.json({ error: `id error`, message: `The id should be a number` });

    const sql = `DELETE FROM stats WHERE pokemon_id = ?`

    await connection.query(sql, pokemonId);

    res.sendStatus(204);

};

export const deletePokemonAbilities = async (req, res) => {

    const pokemonId = Number(req.params.id);
    if (typeof pokemonId !== `number`) res.json({ error: `id error`, message: `The id should be a number` });

    const sql = `DELETE FROM pokemon_ability WHERE pokemon_id = ?`

    await connection.query(sql, pokemonId);

    res.sendStatus(204);

};

export const deletePokemonTypes = async (req, res) => {

    const pokemonId = Number(req.params.id);
    if (typeof pokemonId !== `number`) res.json({ error: `id error`, message: `The id should be a number` });

    const sql = `DELETE FROM pokemon_type WHERE pokemon_id = ?`

    await connection.query(sql, pokemonId);

    res.sendStatus(204);

};

export const deletePokemonGames = async (req, res) => {

    const pokemonId = Number(req.params.id);
    if (typeof pokemonId !== `number`) res.json({ error: `id error`, message: `The id should be a number` });

    const sql = `DELETE FROM pokemon_game WHERE pokemon_id = ?`

    await connection.query(sql, pokemonId);

    res.sendStatus(204);

};

export const deletePokemonMoves = async (req, res) => {

    const pokemonId = Number(req.params.id);
    if (typeof pokemonId !== `number`) res.json({ error: `id error`, message: `The id should be a number` });

    const sql = `DELETE FROM pokemon_move WHERE pokemon_id = ?`

    await connection.query(sql, pokemonId);

    res.sendStatus(204);

};
