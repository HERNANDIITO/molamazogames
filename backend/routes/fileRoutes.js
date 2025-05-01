import express from 'express';
import { getFiles, getFileByID, getFileByAssetID, uploadFile, editFile } from '../controllers/fileController.js';

import { auth } from '../middlewares/auth.middleware.js';
import { upload } from '../db/storage.js'

const fileRouter = express.Router();

// Obtener todos los assets
fileRouter.get('/getAllFiles', getFiles);

// Obtener obtener asset dada la ID
fileRouter.get('/getFileByID', getFileByID);

// Obtener obtener asset dada la ID
fileRouter.get('/getFileByAssetID', getFileByAssetID);

// Subir un archivo
fileRouter.post('/', auth, upload.single('file'), uploadFile);

// Editar archivo dada la ID
fileRouter.put('/', auth, editFile);

export default fileRouter;