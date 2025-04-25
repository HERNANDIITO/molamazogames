
import { auth } from '../middlewares/auth.middleware.js'

import express from 'express';
const tagRouter = express.Router();

import { } from '../controllers/tagController.js';

// Obetenemos todos los usuarios registrados del sistema
tagRouter.get("/", auth);


export default tagRouter