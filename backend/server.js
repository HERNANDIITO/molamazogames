
/**
 * Intentad mantener este archivo lo mas limpio posible
 * para ello podeis sacar funciones a otros archivos e improtarlos en este.
 */

// Importaciones de librerias

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import db from './db/conn.js';

// Importaciones de archivos

// Constantes
const PORT  = process.env.PORT;
const app = express();

// Codigo

app.get("/api", (req, res) => { 
    res.json({
            "users": ["userOne", "userTwo", "userThree"]
        })
});

app.listen(PORT, () => {
    console.log(`Server started on: ${PORT}`);
})