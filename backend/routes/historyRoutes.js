
import { auth } from '../middlewares/auth.middleware.js'

import express from 'express';
const historyRouter = express.Router();

import { clearUserHistory, getUserHistory, postHistory } from '../controllers/historyController.js';

// Obtenemos las entradas del historial de un usuario
historyRouter.get("/", auth, getUserHistory);

// Añadimos una entrada al historial del usuario
historyRouter.post("/", auth, postHistory);

// Limpiamos el historial del usuario
historyRouter.delete("/", auth, clearUserHistory);


export default historyRouter