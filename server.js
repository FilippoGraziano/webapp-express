import express from 'express';
import { routerPokemon } from './resources/pokemonResources/pokemonRouters.js';
import { routerTypes } from './resources/typesResources/typesRouters.js';

const app = express();
const port = process.env.SERVER_PORT;

app.use(express.json());

app.use(express.static(`public`));

app.use(`/pokemon`, routerPokemon);
app.use(`/types`, routerTypes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});