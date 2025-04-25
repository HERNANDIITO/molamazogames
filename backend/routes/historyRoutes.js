
import { auth } from '../middlewares/auth.middleware.js'

import express from 'express';
const historyRouter = express.Router();

import { } from '../controllers/historyController.js';

// Obetenemos todos los usuarios registrados del sistema
historyRouter.get("/", auth);


export default historyRouter