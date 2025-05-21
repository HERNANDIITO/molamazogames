import { encryptPassword } from '../helpers/pass.helper.js'
import { generateToken } from '../helpers/token.helper.js'

import moment from 'moment'
import asyncHandler from 'express-async-handler'
import mongoose from 'mongoose';
import User from '../schemas/user.schema.js';
import File from '../schemas/file.schema.js'
import { validateEmail, validatePass, validatePhone } from '../helpers/validator.helper.js';

const getAllUsersAdmin = asyncHandler( async (req, res, next) => {
    try {
        const usuarios = await User.find();
        res.json(usuarios);
    }
    catch (err) {
        next(err);
    }
})

const getUserByID = asyncHandler(async (req, res, next) => {

    try {
        const elementoID = req.query.userID;

        if ( !elementoID || !(mongoose.Types.ObjectId.isValid(elementoID)) ) {
            return res.status(400).json({
                result: "Solicitud errónea.",
                msg: `Faltan campos obligatorios: ${!elementoID ? 'elementoID ' : ''}`
            });
        }

        const user = await User.findById(elementoID)
    
        if ( user === null) {
            return res.status(401).json({ result: "Solicitud erronea.", msg: "No existe dicho usuario." });
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
        const alreadyUser = await User.findOne({ email }, 'email')

        if ( alreadyUser ) {
            return res.status(400).json({
                result: "Solicitud errónea.",
                msg: `Email en uso`
            });
        }

        const encryptedPass = await encryptPassword(req.body.pass);

        const nuevoUsuario = new User({
            email,
            name: name,
            password: encryptedPass,
            signupDate: moment(),
            lastLogin: moment()
        });

        const user = await nuevoUsuario.save();

        res.status(200).json({
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

    const userID = req.body.id ? req.body.id : req.user.id;

    const userName  = req.body.userName;
    const email     = req.body.email   ;
    const phone     = req.body.phone   ;
    const pfp       = req.body.pfp     ;
    const newPass   = req.body.pass    ;

    if ( !userID || !(mongoose.Types.ObjectId.isValid(userID)) ) {
        return res.status(400).json({
            result: "Solicitud errónea.",
            msg: `Faltan campos obligatorios: ${!userID ? 'userID ' : ''}`
        });
    }
    
    if ( !userName && !email && !phone && !newPass && !pfp ) {
        return res.status(400).json({
            result: "Solicitud errónea.",
            msg: `No hay nada que editar`
        });
    }
    
    try {
        const user = await User.findById(userID);

        if (!user) {
            return res.status(404).json({ result: "Error", msg: "Usuario no encontrado" });
        }
        
        if ( userName ) { 

            const alreadyName = await User.findOne({name: userName}, 'name');
        
            if ( alreadyName && alreadyName.name == userName && alreadyName._id != req.user.id ) {
                return res.status(400).json({ result: "Error. Solicitud erronea", msg: "Este nombre ya está registrado." });
            }

            user.name = userName

        };

        if ( email ) {

            if (!validateEmail(email)) {
                return res.status(400).json({ result: "Error. Solicitud erronea", msg: "El formato de correo electrónico no es válido." });
            }

            const alreadyEmail = await User.findOne({ email }, 'email')

            if ( alreadyEmail && alreadyEmail._id != req.user.id ) {
                return res.status(400).json({
                    result: "Solicitud errónea.",
                    msg: `Email en uso`
                });
            }

            user.email = email   
        };

        if ( phone ) { 

            if (!validatePhone(phone)) {
                return res.status(400).json({ result: "Error. Solicitud erronea", msg: "El formato de telefono no es válido." });
            }

            user.phone = phone
        };

        if ( pfp ) {
            if ( !(mongoose.Types.ObjectId.isValid(pfp)) ) {
                return res.status(400).json({ result: "Error. Solicitud erronea", msg: "pfp no es una ID de File válida." });
            }

            const pfpFile = File.findById(pfp);

            if ( !pfpFile ) {
                return res.status(400).json({ result: "Error. Solicitud erronea", msg: "pfp no es una ID de File válida." });
            }

            user.profilePic = pfp

        };

        if ( newPass ) {

            if ( !validatePass(newPass) ) {
                return res.status(400).json({ result: "Error. Solicitud erronea", msg: "La contraseña no cumple los requisitos." });
            }

            const encryptedPass = await encryptPassword(newPass)
            user.password = encryptedPass;

        }

        await user.save();

        return res.status(200).json({ result: "OK.", msg: "Usuario actualizado con exito." });
    }
    catch (err) {
        next(err);
    }
})

const deleteUserByID = asyncHandler(async (req, res, next) => {

    const elementoId = req.query.id;

    if ( elementoId === undefined ) {
        return res.status(400).json({
            result: "Solicitud errónea.",
            msg: `Faltan campos obligatorios: ${!elementoId ? 'ID ' : ''}`
        });
    }

    
    if ( !elementoId || !(mongoose.Types.ObjectId.isValid(elementoId)) ) {
        return res.status(400).json({
            result: "Solicitud errónea.",
            msg: `Faltan campos obligatorios: ${!elementoId ? 'elementoId ' : ''}`
        });
    }

    try {
        const resultado = await User.findByIdAndDelete(elementoId);
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