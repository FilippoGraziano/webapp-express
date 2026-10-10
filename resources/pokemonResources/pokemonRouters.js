import express from "express";
import { deletePokemon, getPokemon, getPokemonById, getPokemonByName, updatePokemon } from "./pokemonController.js";
import { createPokemon, createPokemonAbilities, createPokemonEvolution, createPokemonMoves, createPokemonStats, createPokemonTypes } from "./pokemonControllerPost.js";

export const routerPokemon = express.Router();

routerPokemon.get('/', getPokemon);
routerPokemon.get(`/id/:id`, getPokemonById);
routerPokemon.get(`/name/:name`, getPokemonByName);

routerPokemon.post(`/`, createPokemon);
routerPokemon.post(`/:id/evolution`, createPokemonEvolution);
routerPokemon.post(`/:id/stats`, createPokemonStats);
routerPokemon.post(`/:id/abilities`, createPokemonAbilities);
routerPokemon.post(`/:id/types`, createPokemonTypes);
routerPokemon.post(`/:id/moves`, createPokemonMoves);

routerPokemon.put(`/id/:id`, updatePokemon);

routerPokemon.delete(`/id/:id`, deletePokemon);