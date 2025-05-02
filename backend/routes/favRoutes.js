
import { auth } from '../middlewares/auth.middleware.js'

import express from 'express';
const favRouter = express.Router();

import { getAssetFavs, getUserFavs, postFav } from '../controllers/favController.js';

// Obetenemos todos los favs de un usuario
favRouter.get("/userFavs", auth, getUserFavs);

// Obetenemos todos los favs de un asset
favRouter.get("/assetFavs", getAssetFavs);

// Añadimos un fav
favRouter.post("/postFav", auth, postFav);

export default favRouter