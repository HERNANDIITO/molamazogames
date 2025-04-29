
import { auth } from '../middlewares/auth.middleware.js'

import express from 'express';
const formatRouter = express.Router();

import { getFormats, setupFormats } from '../controllers/formatController.js';

// Obetenemos todos los formatos dada la metacategoria (opcional)
formatRouter.get("/", getFormats );

formatRouter.post("/setup", auth, setupFormats )

export default formatRouter