import express from "express";
import { deletePokemon, getPokemon, getPokemonById, getPokemonByName, updatePokemon } from "./pokemonController.js";
import { createPokemon, createPokemonAbilities, createPokemonEvolution, createPokemonGames, createPokemonMoves, createPokemonStats, createPokemonTypes } from "./pokemonControllerPost.js";

export const routerPokemon = express.Router();

routerPokemon.get('/', getPokemon);
routerPokemon.get(`/id/:id`, getPokemonById);
routerPokemon.get(`/name/:name`, getPokemonByName);

routerPokemon.post(`/`, createPokemon);
routerPokemon.post(`/id/:id/evolution`, createPokemonEvolution);
routerPokemon.post(`/id/:id/stats`, createPokemonStats);
routerPokemon.post(`/id/:id/abilities`, createPokemonAbilities);
routerPokemon.post(`/id/:id/types`, createPokemonTypes);
routerPokemon.post(`/id/:id/moves`, createPokemonMoves);
routerPokemon.post(`/id/:id/games`, createPokemonGames);

routerPokemon.put(`/id/:id`, updatePokemon);

routerPokemon.delete(`/id/:id`, deletePokemon);