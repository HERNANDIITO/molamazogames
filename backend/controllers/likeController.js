import Like from '../schemas/like.schema.js';
import Comment from '../schemas/comment.schema.js';
import User from '../schemas/user.schema.js';

import asyncHandler from 'express-async-handler'

const getUserLikes = asyncHandler( async (req,res,next) => {

    const user = req.body.userID;

    if ( !user ) {
        return res.status(400).json({
            result: "Solicitud errónea.",
            msg: `Faltan campos obligatorios: ${!userID ? 'userID ' : ''}`
        });
    }

    try {

        const likes = await Like.find({ author: user });
        const commentIDs = likes.map(like => like.comment);
        const comments = await Comment.find({ '_id': { $in: commentIDs } });
        return res.status(200).json({
            result: "OK",
            comments: comments
        });

    } catch(error) {
        next(error);
    }

});

const getCommentLikes = asyncHandler( async (req,res,next) => {
    const comment = req.body.commentID;

    if ( !comment ) {
        return res.status(400).json({
            result: "Solicitud errónea.",
            msg: `Faltan campos obligatorios: ${!commentID ? 'commentID ' : ''}`
        });
    }

    try {

        const likes = await Like.find({ comment: comment });
        const userIDs = likes.map(like => like.author);
        const users = await User.find({ '_id': { $in: userIDs } }, {__v: 0});
        return res.status(200).json({
            result: "OK",
            users: users
        });

    } catch(error) {

        next(error);

    }
});

const postLike = asyncHandler( async (req,res,next) => {

    const commentID = req.body.commentID;
    const userID = req.user.id;

    if ( !commentID || !userID ) {
        return res.status(400).json({
            result: "Solicitud errónea.",
            msg: `Faltan campos obligatorios: ${!commentID ? 'commentID ' : ''}${!userID ? 'userID ' : ''}`
        });
    }

    const comment = await Comment.findOne({ _id: commentID });
    const user  = await User.findOne({ _id: userID });

    if ( !comment || !user ) {
        return res.status(400).json({
            result: "Solicitud errónea.",
            msg: `Datos erroneos: ${!commentID ? 'commentID ' : ''}${!userID ? 'userID ' : ''}`
        });
    }

    const nuevoLike = new Like({
        author: user._id,
        comment: comment._id
    });

    const like = await nuevoLike.save();
    return res.status(200).json({
        result: "OK",
        like: like
    });

});


export {
    getUserLikes,
    getCommentLikes,
    postLike
}