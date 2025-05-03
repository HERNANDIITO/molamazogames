
import { auth } from '../middlewares/auth.middleware.js'

import express from 'express';
const userRouter = express.Router();

import { deleteUserByID, getAllUsersAdmin, getUserByID, modifyUserByID, newUser } from '../controllers/userController.js';

// Obetenemos todos los usuarios registrados del sistema
userRouter.get("/", auth, getAllUsersAdmin);

// Obtenemos el usuario indicado por el
userRouter.get("/", auth, getUserByID);

// Registramos un nuevo usuario con toda su información.
userRouter.post("/", auth, newUser);

// Modificamos el usuario.
userRouter.put("/", auth, modifyUserByID)

// Eliminamos el usuario.
userRouter.delete("/", auth, deleteUserByID);

export default userRouter