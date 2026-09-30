import express from "express";
import { createMoves, deleteMoves, getMoves, getMovesById, getMovesByName, updateMoves } from "./movesController.js";

export const routerMoves = express.Router();

routerMoves.get('/', getMoves);
routerMoves.get(`/id/:id`, getMovesById);
routerMoves.get(`/name/:name`, getMovesByName);

routerMoves.post(`/`, createMoves);

routerMoves.put(`/id/:id`, updateMoves);

routerMoves.delete(`/id/:id`, deleteMoves);