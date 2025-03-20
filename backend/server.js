
/**
 * Intentad mantener este archivo lo mas limpio posible
 * para ello podeis sacar funciones a otros archivos e improtarlos en este.
 */

// Importaciones de librerias ----------

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import userRouter from './routes/userRoutes.js';
import authRouter from './routes/authRoutes.js';

// Constantes --------------------------
const PORT  = process.env.PORT;
const app = express();

// Configuración -----------------------
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routers -----------------------------
app.use('/user', userRouter);
app.use('/auth', authRouter);

// Servidor ----------------------------
app.listen(PORT, () => {
    console.log(`Server started on: ${PORT}`);
})