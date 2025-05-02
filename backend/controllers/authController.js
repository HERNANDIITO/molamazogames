import { encryptPassword, checkPassword } from '../helpers/pass.helper.js'
import { generateToken } from '../helpers/token.helper.js'

import asyncHandler from 'express-async-handler'
import moment from 'moment'

import db from '../db/conn.js'
import mongoose from 'mongoose'
import userSchema from '../schemas/user.schema.js'

import {validateEmail, validatePass} from '../helpers/validator.helper.js'

<<<<<<< Updated upstream
const User = mongoose.model('users', userSchema);
=======
const getUserByTokenFunc = async (userID) => {
    if ( !(mongoose.Types.ObjectId.isValid(userID)) ) {
        return res.status(400).json({
            result: "Solicitud errónea.",
            msg: `Dicho usuario no existe`
        });
    }

    const user = await User.findById(userID)
    return user;

}
>>>>>>> Stashed changes

const getAllUsers = asyncHandler(async(req, res, next) => {
    try {
        const users = await User.find( {}, 'displayName email');
        res.json(users);
    }
    catch (err) {
        next(err)
    }
})

const getUserByToken = asyncHandler(async(req, res, next) => {
    const ID = req.user.id;

    if ( ID === undefined ) {
        return res.status(400).json({
            result: "Solicitud errónea.",
            msg: `Faltan campos obligatorios: ${!ID ? 'ID ' : ''}`
        });
    }

    try {
        const user = await User.findById(req.user.id)
        res.json(user)
    }
    catch (err) {
        next(err);
    }

})

const login = asyncHandler(async(req, res, next) => {

    const { email, pass } = req.body;

    if ( !email || !pass ) {
        return res.status(400).json({
            result: "Solicitud errónea.",
            msg: `Faltan campos obligatorios: ${!email ? 'email ' : ''}${!pass ? 'pass ' : ''}`
        });
    }

    if ( !email ) { 
        res.status(400).json({ result: "Solicitud erronea.", msg: "No has adjuntado un email" });
        return;
    }

    if ( !pass ) { 
        res.status(400).json({ result: "Solicitud erronea.", msg: "No has adjuntado un pass" });
        return;
    }

    try {

        const user = await User.findOne({email: email});

        if (!user) {
            res.status(400).json({ result: "Solicitud erronea.", msg: "Dicho email no está registrado" });
            return; 
        }

        const check = checkPassword(pass, user.password);
        if (!check) {
            res.status(401).json({ result: "Solicitud erronea.", msg: "No autorizado" });
            return;
        }

        user.lastLogin = moment().unix();
        user.save();

        const token = generateToken(user._id);
    
        const returnValue = {
            result: "OK",
            token: token,
        }

        res.status(202).json(returnValue);

    }

    catch(err) {
        next(err)
    }
})

const register = asyncHandler(async(req, res, next) => {

    const { email, pass, name } = req.body;

    if ( !email || !pass || !name ) {
        return res.status(400).json({
            result: "Solicitud errónea.",
            msg: `Faltan campos obligatorios: ${!email ? 'email ' : ''}${!pass ? 'pass ' : ''}${!name ? 'name ' : ''}`
        });
    }

    try {
        const { email, pass, name, phone } = req.body;

        if ( !email || !validateEmail(email) ) {
            res.status(400).json({ result: "Error. Solicitud erronea", msg: "Email inválido" });
            return;
        }

        const user = await User.findOne({email: email});
        if ( user ) {
            res.status(400).json({ result: "Error. Solicitud erronea", msg: "Este email ya está registrado" });
            return;
        }

        if ( !pass || !validatePass(pass) ) {
            res.status(400).json({ result: "Error. Solicitud erronea", msg: "Esta contraseña no cumple los requisitos necesarios" });
            return;
        }

        const encryptedPass = await encryptPassword(pass)

        const nuevoUsuario = new User({
            password: encryptedPass,
            email: email,
            displayName: req.body.name,
            phone: phone,
            signupDate: moment(),
            lastLogin: moment()
        })

        nuevoUsuario.save()

        const returnValue = {
            "result": "OK",
            "token": generateToken(nuevoUsuario._id),
        }

        res.json(returnValue);
    }
    catch (err) {
        next(err);
    }
})

export {
    getAllUsers,
    getUserByToken,
    login,
    register
}