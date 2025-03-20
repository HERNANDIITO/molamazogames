
import moment from 'moment';
import { encryptPassword, checkPassword } from '../helpers/pass.helper.js'
import { generateToken } from '../helpers/token.helper.js'
import { auth } from '../middlewares/auth.middleware.js'

import db from '../db/conn.js';
import mongoose from 'mongoose';
import userSchema from '../schemas/user.schema.js';

import express from 'express';
const userRouter = express.Router();

const User = mongoose.model('users', userSchema);

// Obetenemos todos los usuarios registrados del sistema
userRouter.get("", auth, (req, res, next) => {
    User.find().then((usuarios) => {
        res.json(usuarios);
    }).catch((err) => { next(err) })
});

// Obtenemos el usuario indicado por el {id}
userRouter.get("/:id", auth, (req, res, next) => {
    const elementoID = req.params.id;

    User.findById(elementoID).then((user) => {
        if ( user === null) {
            res.status(401).json({ result: "Solicitud erronea.", msg: "No existe dicho usuario." });
            return;
        }

        res.json(user);
    }).catch( (err) => { next(err) } )
});

// Registramos un nuevo usuario con toda su información.
userRouter.post("", auth, (req, res, next) => {

    if ( !req.body.email ) { 
        res.status(400).json({ result: "Solicitud erronea.", msg: "No has adjuntado un email" });
        return;
    }

    if ( !req.body.pass ) { 
        res.status(400).json({ result: "Solicitud erronea.", msg: "No has adjuntado un pass" });
        return;
    }

    if ( !req.body.name ) { 
        res.status(400).json({ result: "Solicitud erronea.", msg: "No has adjuntado un name" });
        return;
    }

    encryptPassword(req.body.pass).then( (encryptedPass) => {
        
        const nuevoUsuario = new User({
            email: req.body.email,
            displayName: req.body.name,
            password: encryptedPass,
            signupDate: moment().unix(),
            lastLogin: moment().unix()
        })
        
        nuevoUsuario.save().then( (user) => {

            const returnValue = {
                "result": "OK",
                "token": generateToken(user._id),
                "usuario": user
            }
    
            res.json(returnValue);
    
        }).catch((err) => { next(err) });
    }).catch((err) => { next(err) });
});

// Modificamos el usuario {id}.
userRouter.put("/:id", auth, (req, res, next) => {
    const elementoId = req.params.id;
    const nuevosRegistros = req.body;
  
    User.findByIdAndUpdate(
        elementoId,
        { $set: nuevosRegistros },
        { new: true, runValidators: true }
    ).then((result) => {
        if (!result) {
            return res.status(404).json({ result: "Error", msg: "Usuario no encontrado" });
        }
        res.json(result);
    }).catch((err) => { next(err) });
})

// Eliminamos el usuario {id}.
userRouter.delete("/:id", auth, (req, res, next) => {
    const elementoId = req.params.id;
    User.findByIdAndDelete(elementoId).then((resultado) => {
        res.json(resultado);
    }).catch( (err) => { next(err) } );
});

// ----- AUTH -----

// Obtenemos todos los usuarios registrados en el sistema
// (mostramos versión reducida de GET ).
// SOLO USUARIO Y EMAIL
userRouter.get("/auth", auth, (req, res, next) => {
    User.find( {}, 'displayName email').then((usuarios) => {
        res.json(usuarios);
    }).catch((err) => { next(err); })
});

// Obtenemos el usuario a partir de un token jwt válido.
userRouter.get("/auth/me", auth, (req, res, next) => {
    User.findById(req.user.id).then((user) => {
        res.json(user);
    }).catch((err) => { next(err) })
});

// Realiza una identificación o login (signIn).
// Si todo es correcto, genera y devuelve un token jwt válido.
userRouter.post("/auth", (req, res, next) => {

    // TODO: Sincronizar lastlogin
    
    if ( !req.body.email ) { 
        res.status(400).json({ result: "Solicitud erronea.", msg: "No has adjuntado un email" });
        return;
    }

    if ( !req.body.pass ) { 
        res.status(400).json({ result: "Solicitud erronea.", msg: "No has adjuntado un pass" });
        return;
    }

    User.findOne({email: req.body.email}).then((user) => {
        if (!user) {
            res.status(400).json({ result: "Solicitud erronea.", msg: "Dicho email no está registrado" });
            return; 
        }
        checkPassword(req.body.pass, user.password).then( (check) => {
            if (!check) {
                res.status(401).json({ result: "Solicitud erronea.", msg: "No autorizado" });
                return;
            }

            user.lastLogin = moment().unix();
            user.save().then(() => {
                const token = generateToken(user._id);
    
                const returnValue = {
                    result: "OK",
                    token: token,
                    usuario: user
                }
    
                res.status(202).json(returnValue);
            }).catch((err) => { next(err) })

                
        }).catch((err) => { next(err) })
    }).catch((err) => { next(err) })
});

// Realiza un registro mínimo (signUp) de un usuario.
// Si todo va bien, genera y devuelve un token jwt válido.
// Registramos un nuevo usuario con toda su información.
userRouter.post("/auth/reg", (req, res, next) => {

    // TODO: Cambiar nombres de valores

    if ( !req.body.name ) { 
        res.status(400).json({ result: "Error. Solicitud erronea", msg: "No has adjuntado un displayName" });
        return;
    }

    if ( !req.body.email ) { 
        res.status(400).json({ result: "Error. Solicitud erronea", msg: "No has adjuntado un email" });
        return;
    }

    if ( !req.body.pass ) { 
        res.status(400).json({ result: "Error. Solicitud erronea", msg: "No has adjuntado un pass" });
        return;
    }

    User.findOne({email: req.body.email}).then((result) => {
        if ( result ) {
            res.status(400).json({ result: "Error. Solicitud erronea", msg: "Este email ya está registrado" });
            return;
        }

        encryptPassword(req.body.pass).then( (encryptedPass) => {
            const nuevoUsuario = new User({
                password: encryptedPass,
                email: req.body.email,
                displayName: req.body.name,
                signupDate: moment().unix(),
                lastLogin: moment().unix()
            })
            
            nuevoUsuario.save().then((user) => {

                const returnValue = {
                    "result": "OK",
                    "token": generateToken(user._id),
                    "usuario": user
                }
        
                res.json(returnValue);
        
            }).catch((err) => {
                next(err)
            });
        });
    }).catch((err) => {
        next(err);
    })
});

export default userRouter