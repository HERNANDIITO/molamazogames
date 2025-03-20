import { encryptPassword } from '../helpers/pass.helper.js'
import { generateToken } from '../helpers/token.helper.js'
import { asyncHandler } from 'express-async-handler'

import db from '../db/conn.js';
import mongoose from 'mongoose';
import userSchema from '../schemas/user.schema.js';

const User = mongoose.model('users', userSchema);

const getAllUsersAdmin = asyncHandler( async (req, res, next) => {
    try {
        usuarios = await User.find();
        res.json(usuarios);
    }
    catch (err) {
        next(err);
    }
})

const getUserByID = asyncHandler(async (req, res, next) => {

    try {
        const elementoID = req.params.id;
        user = await User.findById(elementoID)
    
        if ( user === null) {
            res.status(401).json({ result: "Solicitud erronea.", msg: "No existe dicho usuario." });
            return;
        }
    
        res.json(user);
    }
    catch (err){
        next(err);
    }


})

const newUser = asyncHandler(async (req, res, next) => {

    const { email, pass, name } = req.body;

    if (!email || !pass || !name) {
        return res.status(400).json({
            result: "Solicitud errónea.",
            msg: `Faltan campos obligatorios: ${!email ? 'email ' : ''}${!pass ? 'pass ' : ''}${!name ? 'name ' : ''}`
        });
    }

    try {
        const encryptedPass = encryptPassword(req.body.pass);

        const nuevoUsuario = new User({
            email,
            displayName: name,
            password: encryptedPass,
            signupDate: moment().unix(),
            lastLogin: moment().unix()
        });

        const user = await nuevoUsuario.save();

        res.json({
            result: "OK",
            token: generateToken(user._id),
            usuario: user
        });

    }
    
    catch (err) {
        next(err);
    }
})

const modifyUserByID = asyncHandler(async (req, res, next) => {
    const elementoId = req.params.id;
    const nuevosRegistros = req.body;

    if ( elementoId === undefined || nuevosRegistros === undefined ) {
        return res.status(400).json({
            result: "Solicitud errónea.",
            msg: `Faltan campos obligatorios: ${!elementoId ? 'ID ' : ''}${!nuevosRegistros ? 'registro ' : ''}`
        });
    }

    try {
        const result = User.findByIdAndUpdate( elementoId, { $set: nuevosRegistros }, { new: true, runValidators: true } );
        if (!result) {
            return res.status(404).json({ result: "Error", msg: "Usuario no encontrado" });
        }
        res.json(result);
    }
    catch (err) {
        next(err);
    }
})

const deleteUserByID = asyncHandler(async (req, res, next) => {
    const elementoId = req.params.id;

    if ( elementoId === undefined ) {
        return res.status(400).json({
            result: "Solicitud errónea.",
            msg: `Faltan campos obligatorios: ${!elementoId ? 'ID ' : ''}`
        });
    }

    try {
        const resultado = User.findByIdAndDelete(elementoId);
        res.json(resultado);
    }
    catch (err) {
        next(err);
    }
})

export {
    getAllUsersAdmin,
    getUserByID,
    newUser,
    modifyUserByID,
    deleteUserByID,
}