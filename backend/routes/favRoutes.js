
import { auth } from '../middlewares/auth.middleware.js'

import express from 'express';
const favRouter = express.Router();

import { } from '../controllers/favController.js';

// Obetenemos todos los usuarios registrados del sistema
favRouter.get("/", auth);


export default favRouter