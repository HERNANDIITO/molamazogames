import Fav from '../schemas/fav.schema.js';
import Asset from '../schemas/asset.schema.js';
import User from '../schemas/user.schema.js';

import asyncHandler from 'express-async-handler'

const getUserFavs = asyncHandler( async (req,res,next) => {

    const userID = req.query.userID;

    if ( !userID || !(mongoose.Types.ObjectId.isValid(userID)) ) {
        return res.status(400).json({
            result: "Solicitud errónea.",
            msg: `Faltan campos obligatorios: ${!userID ? 'userID ' : ''}`
        });
    }

    try {

        const favs = await Fav.find({ author: userID });
        const assetIDs = favs.map(fav => fav.asset);
        const assets = await Asset.find({ '_id': { $in: assetIDs } });
        return res.status(200).json({
            result: "OK",
            assets: assets
        });

    } catch(error) {
        next(error);
    }

});

const getAssetFavs = asyncHandler( async (req,res,next) => {
    const assetID = req.query.assetID;

    if ( !assetID || !(mongoose.Types.ObjectId.isValid(assetID)) ) {
        return res.status(400).json({
            result: "Solicitud errónea.",
            msg: `Faltan campos obligatorios: ${!assetID ? 'assetID ' : ''}`
        });
    }

    try {

        const asset = await Asset.findOne({ _id: assetID });

        if ( !asset ) {
            return res.status(400).json({
                result: "Solicitud errónea.",
                msg: `Ese asset no existe`
            });
        }

        const favs = await Fav.find({ asset: asset._id });
        const userIDs = favs.map(fav => fav.author);
        const users = await User.find({ '_id': { $in: userIDs } }, { password: 0, email: 0, signupDate: 0, lastLogin: 0, __v:0 });

        return res.status(200).json({
            result: "OK",
            users: users
        });

    } catch(error) {

        next(error);

    }
});

const postFav = asyncHandler( async (req,res,next) => {

    const assetID = req.body.assetID;
    const userID = req.body.userID;

    if ( !assetID || !userID ) {
        return res.status(400).json({
            result: "Solicitud errónea.",
            msg: `Faltan campos obligatorios: ${!assetID ? 'assetID ' : ''}${!userID ? 'userID ' : ''}`
        });
    }

    const asset = await Asset.findOne({ _id: assetID });
    const user  = await User.findOne({ _id: userID });

    if ( !asset || !user ) {
        return res.status(400).json({
            result: "Solicitud errónea.",
            msg: `Datos erroneos: ${!assetID ? 'assetID ' : ''}${!userID ? 'userID ' : ''}`
        });
    }

    const nuevoFav = new Fav({
        author: user._id,
        asset: asset._id
    });

    const fav = await nuevoFav.save();
    return res.status(200).json({
        result: "OK",
        fav: fav
    });

});


export {
    getUserFavs,
    getAssetFavs,
    postFav
}