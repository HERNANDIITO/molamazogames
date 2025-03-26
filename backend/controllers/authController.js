import { encryptPassword, checkPassword } from '../helpers/pass.helper.js'
import { generateToken } from '../helpers/token.helper.js'

import asyncHandler from 'express-async-handler'
import moment from 'moment'

import db from '../db/conn.js'
import mongoose from 'mongoose'
import userSchema from '../schemas/user.schema.js'

import { validateEmail, validatePass, validatePhone } from '../helpers/validator.helper.js'

const User = mongoose.model('users', userSchema);

const getAllUsers = asyncHandler(async(req, res, next) => {
    try {
        const users = await User.find( {}, 'name email');
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

    const { name, pass } = req.body;

    if ( !name || !pass ) {
        return res.status(400).json({
            result: "Solicitud errónea.",
            msg: `Faltan campos obligatorios: ${!name ? 'name ' : ''}${!pass ? 'pass ' : ''}`
        });
    }

    if ( !name ) { 
        res.status(400).json({ result: "Solicitud erronea.", msg: "El nombre de usuario no puede quedar vacío." });
        return;
    }

    if ( !pass ) { 
        res.status(400).json({ result: "Solicitud erronea.", msg: "La contraseña no puede quedar vacía." });
        return;
    }

    try {

        const user = await User.findOne({name: name});

        if (!user) {
            res.status(400).json({ result: "Solicitud erronea.", msg: "El nombre de usuario o la contraseña son incorrectos." });
            return; 
        }

        const check = await checkPassword(pass, user.password);
        if (!check) {
            res.status(401).json({ result: "Solicitud erronea.", msg: "El nombre de usuario o la contraseña son incorrectos." });
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
            res.status(400).json({ result: "Error. Solicitud erronea", msg: "El formato de correo electrónico no es válido." });
            return;
        }

        const alreadyName = await User.findOne({name: name});
        if ( alreadyName && alreadyName.name == name ) {
            console.log(alreadyName);
            res.status(400).json({ result: "Error. Solicitud erronea", msg: "Este nombre ya está registrado." });
            return;
        }
        
        const alreadyEmail = await User.findOne({email: email});
        if ( alreadyEmail && alreadyEmail.email == email ) {
            console.log(alreadyEmail);
            res.status(400).json({ result: "Error. Solicitud erronea", msg: "Este email ya está registrado." });
            return;
        }

        if ( !pass || !validatePass(pass) ) {
            res.status(400).json({ result: "Error. Solicitud erronea", msg: "La contraseña no cumple los requisitos." });
            return;
        }

        if ( phone && !validatePhone(phone) ) {
            res.status(400).json({ result: "Error. Solicitud erronea", msg: "Este número de teléfono no es válido. ej: +34784987645" });
            return;
        }

        const encryptedPass = await encryptPassword(pass)

        const nuevoUsuario = new User({
            password: encryptedPass,
            email: email,
            name: req.body.name,
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