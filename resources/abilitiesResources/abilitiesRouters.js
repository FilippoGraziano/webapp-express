import express from "express";
import { createAbilities, deleteAbilities, getAbilities, getAbilitiesById, getAbilitiesByName, updateAbilities } from "./abilitiesController.js";

export const routerAbilities = express.Router();

routerAbilities.get('/', getAbilities);
routerAbilities.get(`/id/:id`, getAbilitiesById);
routerAbilities.get(`/name/:name`, getAbilitiesByName);

routerAbilities.post(`/`, createAbilities);

routerAbilities.put(`/id/:id`, updateAbilities);

routerAbilities.delete(`/id/:id`, deleteAbilities);