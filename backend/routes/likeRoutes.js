
import { auth } from '../middlewares/auth.middleware.js'

import express from 'express';
const likeRouter = express.Router();

import { getCommentLikes, getUserLikes, postLike } from '../controllers/likeController.js';

// Obetenemos todos los likes de un usuario
likeRouter.get("/userLikes", auth, getUserLikes);

// Obetenemos todos los likes de un comentario
likeRouter.get("/commentLikes", getCommentLikes);

// Añadimos un like
likeRouter.post("/postLike", auth, postLike);

export default likeRouter