
import { auth } from '../middlewares/auth.middleware.js'

import express from 'express';
const categoryRouter = express.Router();

import {getAllCategories, getFatherCategories, setupCategories} from '../controllers/categoryController.js';

// Obetenemos todas las categorias. 
// acepta el parametro META para obtener todas las categorias de dicho meta
categoryRouter.get("/", getAllCategories);

// Obetenemos todos los usuarios registrados del sistema
// acepta el parametro META para obtener todas las categorias de dicho meta
categoryRouter.get("/getFatherCategories", getFatherCategories);

// Obetenemos todos los usuarios registrados del sistema
categoryRouter.post("/setup", auth, setupCategories);


export default categoryRouter