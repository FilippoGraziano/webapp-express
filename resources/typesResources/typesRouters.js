import express from "express";
import { createTypes, deleteTypes, getTypes, getTypesById, getTypesByName, updateTypes } from "./typesController.js";

export const routerTypes = express.Router();

routerTypes.get('/', getTypes);
routerTypes.get(`/id/:id`, getTypesById);
routerTypes.get(`/name/:name`, getTypesByName);

routerTypes.post(`/`, createTypes);

routerTypes.put(`/id/:id`, updateTypes);

routerTypes.delete(`/id/:id`, deleteTypes);