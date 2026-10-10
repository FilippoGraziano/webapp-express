import express from "express";
import { createItems, deleteItems, getItems, getItemsById, getItemsByName, updateItems } from "./itemsController.js";

export const routerItems = express.Router();

routerItems.get('/', getItems);
routerItems.get(`/id/:id`, getItemsById);
routerItems.get(`/name/:name`, getItemsByName);

routerItems.post(`/`, createItems);

routerItems.put(`/id/:id`, updateItems);

routerItems.delete(`/id/:id`, deleteItems);