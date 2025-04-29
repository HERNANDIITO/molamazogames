import Asset from '../schemas/asset.schema.js';
import Comment from '../schemas/comment.schema.js';
import User from '../schemas/user.schema.js';

import asyncHandler from 'express-async-handler'
import moment from 'moment'

const getAssetComments = asyncHandler( async (req,res,next) => {
    const assetID = req.body.assetID;

    if ( !assetID ) {
        return res.status(400).json({
            result: "Solicitud errónea.",
            msg: `Faltan campos obligatorios: ${!assetID ? 'assetID ' : ''}`
        });
    }

    try {
        const asset = await Asset.findOne({_id: assetID});

        if ( !asset ) {
            return res.status(400).json({
                result: "Solicitud errónea.",
                msg: `Dicho asset no existe`
            });
        }

        const comments = await Comment.find({asset: asset._id});

        return res.status(200).json({
            result: "OK",
            comments: comments
        });

    } catch (error) { next(error) }
})

const postComment = asyncHandler(async (req, res, next) => {
    const assetID = req.body.assetID;
    const userID  = req.body.userID;
    const content = req.body.content;

    if ( !userID || !assetID ) {
        return res.status(400).json({
            result: "Solicitud errónea.",
            msg: `Faltan campos obligatorios: ${!assetID ? 'assetID ' : ''}${!userID ? 'userID ' : ''}${!content ? 'content ' : ''}`
        });
    }

    const user  = User.findOne({_id: userID})
    const asset = Asset.findOne({_id: assetID})

    if ( !user || !asset ) {
        return res.status(400).json({
            result: "Solicitud errónea.",
            msg: `Los siguientes elementos no existen: ${!user ? 'user ' : ''}${!asset ? 'asset ' : ''}`
        });
    }

    const newComment = new Comment({
        asset: assetID,
        author: userID,
        content: content,
        likes: [],
        publicationDate: moment().unix()
    })

    const comment = await newComment.save();

    res.json({
        result: "OK",
        comment: comment
    });
})

export {
    getAssetComments,
    postComment
}