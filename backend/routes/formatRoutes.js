
import { auth } from '../middlewares/auth.middleware.js'

import express from 'express';
const formatRouter = express.Router();

import { } from '../controllers/formatController.js';

// Obetenemos todos los usuarios registrados del sistema
formatRouter.get("/", auth);


export default formatRouter