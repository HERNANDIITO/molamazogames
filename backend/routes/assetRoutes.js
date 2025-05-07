import express from 'express';
import { getAssets, getAssetByID, createAsset, updateAsset, deleteAsset, deleteFileFromAsset, downloadAsset } from '../controllers/assetController.js';

import { auth } from '../middlewares/auth.middleware.js';

const assetRouter = express.Router();

// Obtener todos los assets
assetRouter.get('/getAssets', getAssets);

// Obtener un asset por su ID
assetRouter.get('/getAssetByID', getAssetByID);

// Obtener un asset por su ID
assetRouter.get('/download', downloadAsset);

// Crear un asset
assetRouter.post('/', auth, createAsset);

// Modificar un asset
assetRouter.put('/', auth, updateAsset);

// Eliminar un aseet
assetRouter.delete('/', auth, deleteAsset);

// Eliminar un archivo de un asset
assetRouter.delete('/deleteFileFromAsset', auth, deleteFileFromAsset);

export default assetRouter;