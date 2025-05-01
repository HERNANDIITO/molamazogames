import History from '../schemas/history.schema.js';

import asyncHandler from 'express-async-handler'
import moment from 'moment'
import User from '../schemas/user.schema.js';
import Asset from '../schemas/asset.schema.js';

const getUserHistory = asyncHandler( async (req, res, next) => {
    const userID = req.user.id

    if ( !userID || !(mongoose.Types.ObjectId.isValid(userID)) ) {
        return res.status(400).json({
            result: "Solicitud errónea.",
            msg: `Faltan campos obligatorios: ${!userID ? 'userID ' : ''}`
        });
    }

    try {
        
        const user  = await User.findById(userID);

        if ( !user ) {
            return res.status(400).json({
                result: "Solicitud errónea.",
                msg: `Elemento inexistente: ${!user ? 'user ' : ''}`
            });
        }

        const entries = await History.find({ author: userID });

        return res.status(200).json({
            result: "OK.",
            history: entries 
        });

    } catch (error) { next(error) }

})

const postHistory = asyncHandler( async (req, res, next) => {

    const userID = req.user.id
    const assetID = req.body.assetID

    if ( !userID || !assetID || !(mongoose.Types.ObjectId.isValid(userID)) || !(mongoose.Types.ObjectId.isValid(assetID))  ) {
        return res.status(400).json({
            result: "Solicitud errónea.",
            msg: `Faltan campos obligatorios: ${!userID ? 'userID ' : ''}${!assetID ? 'assetID ' : ''}`
        });
    }

    try {

        const user  = await User.findById(userID);
        const asset = await Asset.findById(assetID);

        if ( !user || !asset ) {
            return res.status(400).json({
                result: "Solicitud errónea.",
                msg: `Elemento inexistente: ${!user ? 'user ' : ''}${!asset ? 'asset ' : ''}`
            });
        }

        const newEntry = new History({
            author: userID,
            asset: assetID,
            date: moment()
        })

        const entry = await newEntry.save();

        return res.status(200).json({
            result: "OK.",
            history: entry 
        });

    } catch (error) { next(error); }

})

const clearUserHistory = asyncHandler( async(req, res, next) => {

    const userID = req.user.id

    if ( !userID || !(mongoose.Types.ObjectId.isValid(userID)) ) {
        return res.status(400).json({
            result: "Solicitud errónea.",
            msg: `Faltan campos obligatorios: ${!userID ? 'userID ' : ''}`
        });
    }

    const user = User.findById(userID);

    if ( !user ) {
        return res.status(400).json({
            result: "Solicitud errónea.",
            msg: `Dicho usuario no existe`
        });
    }

    const deletedEntries = await History.deleteMany({author: userID});
    return res.status(200).json({
        result: "OK.",
        history: deletedEntries
    });

})

export {
    getUserHistory,
    postHistory,
    clearUserHistory
}