import { auth } from '../middlewares/auth.middleware.js'

import express from 'express';
const authRouter = express.Router();

import { getAllUsers, getUserByToken, login, register } from '../controllers/authController.js';

// Obtenemos todos los usuarios registrados en el sistema
// (mostramos versión reducida de GET ).
// SOLO USUARIO Y EMAIL
authRouter.get("/", auth, getAllUsers);

// Obtenemos el usuario a partir de un token jwt válido.
authRouter.get("/me", auth, getUserByToken);

// Realiza una identificación o login (signIn).
// Si todo es correcto, genera y devuelve un token jwt válido.
authRouter.post("/", login);

// Realiza un registro mínimo (signUp) de un usuario.
// Si todo va bien, genera y devuelve un token jwt válido.
// Registramos un nuevo usuario con toda su información.
authRouter.post("/reg", register);


export default authRouter