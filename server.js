import express from 'express';
import { routerPokemon } from './resources/pokemonRouter.js';

const app = express();
const port = 3000;

app.use(`/pokemon`, routerPokemon);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});