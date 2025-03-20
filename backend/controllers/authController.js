import { encryptPassword, checkPassword } from '../helpers/pass.helper.js'
import { generateToken } from '../helpers/token.helper.js'

import asyncHandler from 'express-async-handler'
import moment from 'moment'

import db from '../db/conn.js'
import mongoose from 'mongoose'
import userSchema from '../schemas/user.schema.js'

const User = mongoose.model('users', userSchema);

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
            usuario: user
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
        const user = await User.findOne({email: req.body.email});
        if ( user ) {
            res.status(400).json({ result: "Error. Solicitud erronea", msg: "Este email ya está registrado" });
            return;
        }

        const encryptedPass = await encryptPassword(req.body.pass)

        console.log(encryptedPass)
        
        const nuevoUsuario = new User({
            password: encryptedPass,
            email: req.body.email,
            displayName: req.body.name,
            signupDate: moment().unix(),
            lastLogin: moment().unix()
        })

        nuevoUsuario.save()

        const returnValue = {
            "result": "OK",
            "token": generateToken(nuevoUsuario._id),
            "usuario": nuevoUsuario
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