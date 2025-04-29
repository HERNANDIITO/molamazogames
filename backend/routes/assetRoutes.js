import express from 'express';
import { getAssets, getAssetByID, createAsset, updateAsset, deleteAsset } from '../controllers/assetController.js';

import { auth } from '../middlewares/auth.middleware.js';

const assetRouter = express.Router();

// Obtener todos los assets
assetRouter.get('/', getAssets);

// Crear un asset
assetRouter.post('/', auth, createAsset);

// Obtener un asset por su ID
assetRouter.get('/:id', getAssetByID);

// Modificar un asset
assetRouter.put('/:id', auth, updateAsset);

// Eliminar un aseet
assetRouter.delete('/:id', auth, deleteAsset);

export default assetRouter;