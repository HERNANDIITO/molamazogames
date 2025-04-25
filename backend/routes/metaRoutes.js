
import { auth } from '../middlewares/auth.middleware.js'

import express from 'express';
const metaRouter = express.Router();

import { } from '../controllers/metaController.js';

// Obetenemos todos los usuarios registrados del sistema
metaRouter.get("/", auth);


export default metaRouter