import express from 'express';
import cors from "cors";
import { routerPokemon } from './resources/pokemonResources/pokemonRouters.js';
import { routerTypes } from './resources/typesResources/typesRouters.js';
import { routerMoves } from './resources/movesResources/movesRouters.js';
import { routerAbilities } from './resources/abilitiesResources/abilitiesRouters.js';

const app = express();
const port = process.env.SERVER_PORT;

app.use(cors({
  origin: `http://localhost:5173`
}));

app.use(express.json());

app.use(express.static(`public`));

app.use(`/pokemon`, routerPokemon);
app.use(`/types`, routerTypes);
app.use(`/moves`, routerMoves);
app.use(`/abilities`, routerAbilities);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});