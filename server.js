import express from 'express';
import { routerPokemon } from './resources/pokemonRouters.js';

const app = express();
const port = process.env.SERVER_PORT;

app.use(express.json());

app.use(express.static(`public`));

app.use(`/pokemon`, routerPokemon);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});