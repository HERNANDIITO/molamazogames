
import { auth } from '../middlewares/auth.middleware.js'

import express from 'express';
const tagRouter = express.Router();

import { createNewTag, createNewTags, getAllTags } from '../controllers/tagController.js';

// Obetenemos todas las tags del sistema
tagRouter.get("/", auth, getAllTags);

// Obetenemos crea una nueva tag dado el nombre
tagRouter.post("/", auth, createNewTag);

// Obetenemos crea muchas tags de golpe dada una array de nombres
tagRouter.post("/bulkTags", auth, createNewTags);


export default tagRouter