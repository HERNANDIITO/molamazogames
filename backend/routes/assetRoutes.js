import express from 'express';
import assetController from '../controllers/assetController.js';
const {
    getAssets,
    getAssetByID,
    createAsset,
    updateAsset,
    deleteAsset
} = assetController;

const router = express.Router();

// Obtener todos los assets
router.route('/').get(getAssets);

// Crear un asset
router.route('/').post(createAsset);

// Obtener un asset por su ID
router.route('/:id').get(getAssetByID);

// Modificar un asset
router.route('/:id').put(updateAsset);

// Eliminar un aseet
router.route('/:id').delete(deleteAsset);

//module.exports = router;
export default router;