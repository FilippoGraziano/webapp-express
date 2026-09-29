import express from "express";
import { connection } from '../data/db.js';
import { createPokemon, deletePokemon, getPokemon, getPokemonById, getPokemonByName, updatePokemon } from "./pokemonController.js";

export const routerPokemon = express.Router();

routerPokemon.get('/', getPokemon);
routerPokemon.get(`/id/:id`, getPokemonById);
routerPokemon.get(`/name/:name`, getPokemonByName);

routerPokemon.post(`/`, createPokemon);

routerPokemon.put(`/id/:id`, updatePokemon);

routerPokemon.delete(`/id/:id`, deletePokemon);