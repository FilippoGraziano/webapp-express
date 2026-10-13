import express from "express";
import { createGames, deleteGames, getGames, getGamesById, getGamesByName, updateGames } from "./gamesController.js";


export const routerGames = express.Router();

routerGames.get('/', getGames);
routerGames.get(`/id/:id`, getGamesById);
routerGames.get(`/name/:name`, getGamesByName);

routerGames.post(`/`, createGames);

routerGames.put(`/id/:id`, updateGames);

routerGames.delete(`/id/:id`, deleteGames);