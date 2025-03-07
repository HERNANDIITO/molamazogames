
/**
 * Intentad mantener este archivo lo mas limpio posible
 * para ello podeis sacar funciones a otros archivos e improtarlos en este.
 */


// Importaciones de librerias

require('dotenv').config({
    path: '../.env'
});

const express = require('express');

// Importaciones de archivos

// Constantes
const PORT = process.env.PORT;

// Codigo

const app = express();

app.get("/api", (req, res) => { 
    res.json({
            "users": ["userOne", "userTwo", "userThree"]
        })
});

app.listen(PORT, () => {
    console.log(`Server started on: ${PORT}`);
})