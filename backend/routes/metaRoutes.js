
import { auth } from '../middlewares/auth.middleware.js'

import express from 'express';
const metaRouter = express.Router();

import { setupMeta, getMeta } from '../controllers/metaController.js';

// Obetenemos todas las meta categorias
metaRouter.get("/", getMeta);

// Hacemos el setup de todas las metacategorias.
// Este servicio no deberia de exsitir, pero hasta que no subamos la DB a algun sitio 
// y sea fija, va a ayudarnos durante el desarrollo, podemos quitarlo sin problema al final
metaRouter.post("/setup", auth, setupMeta);


export default metaRouter