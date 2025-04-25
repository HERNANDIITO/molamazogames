
import { auth } from '../middlewares/auth.middleware.js'

import express from 'express';
const categoryRouter = express.Router();

import { } from '../controllers/categoryController.js';

// Obetenemos todos los usuarios registrados del sistema
categoryRouter.get("/", auth);


export default categoryRouter