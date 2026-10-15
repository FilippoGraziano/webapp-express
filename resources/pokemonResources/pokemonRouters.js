import express from "express";
import { getPokemon, getPokemonById, getPokemonByName, updatePokemon } from "./pokemonController.js";
import { createPokemon, createPokemonAbilities, createPokemonEvolution, createPokemonGames, createPokemonMoves, createPokemonStats, createPokemonTypes } from "./pokemonControllerPost.js";
import { deletePokemon, deletePokemonAbilities, deletePokemonEvolution, deletePokemonGames, deletePokemonMoves, deletePokemonStats, deletePokemonTypes } from "./pokemonControllerDelete.js";

export const routerPokemon = express.Router();

routerPokemon.get('/', getPokemon);
routerPokemon.get(`/id/:id`, getPokemonById);
routerPokemon.get(`/name/:name`, getPokemonByName);

routerPokemon.post(`/`, createPokemon);
routerPokemon.post(`/id/:id/evolution`, createPokemonEvolution);
routerPokemon.post(`/id/:id/stats`, createPokemonStats);
routerPokemon.post(`/id/:id/abilities`, createPokemonAbilities);
routerPokemon.post(`/id/:id/types`, createPokemonTypes);
routerPokemon.post(`/id/:id/games`, createPokemonGames);
routerPokemon.post(`/id/:id/moves`, createPokemonMoves);

routerPokemon.put(`/id/:id`, updatePokemon);

routerPokemon.delete(`/id/:id`, deletePokemon);
routerPokemon.delete(`/id/:id/evolution`, deletePokemonEvolution);
routerPokemon.delete(`/id/:id/stats`, deletePokemonStats);
routerPokemon.delete(`/id/:id/abilities`, deletePokemonAbilities);
routerPokemon.delete(`/id/:id/types`, deletePokemonTypes);
routerPokemon.delete(`/id/:id/games`, deletePokemonGames);
routerPokemon.delete(`/id/:id/moves`, deletePokemonMoves);