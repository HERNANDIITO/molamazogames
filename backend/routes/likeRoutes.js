
import { auth } from '../middlewares/auth.middleware.js'

import express from 'express';
const likeRouter = express.Router();

import { } from '../controllers/likeController.js';

// Obetenemos todos los usuarios registrados del sistema
likeRouter.get("/", auth);


export default likeRouter