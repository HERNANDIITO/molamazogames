
import { auth } from '../middlewares/auth.middleware.js'

import express from 'express';
const commentRouter = express.Router();

import { } from '../controllers/commentController.js';

// Obetenemos todos los usuarios registrados del sistema
commentRouter.get("/", auth);


export default commentRouter