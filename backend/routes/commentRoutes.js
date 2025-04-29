
import { auth } from '../middlewares/auth.middleware.js'

import express from 'express';
const commentRouter = express.Router();

import { getAssetComments, postComment } from '../controllers/commentController.js';

// Obetenemos todos los comentarios de una publicacion dada su ID
commentRouter.get("/getCommentByAssetID", getAssetComments);

// Publica un comentario
commentRouter.post("/post", auth, postComment);


export default commentRouter