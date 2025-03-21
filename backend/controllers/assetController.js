import Asset from '../schemas/asset.schema.js';

// Obtener todos los assets
const getAssets = async (req, res) => {
    try{
        const assets = await Asset.find();
        res.status(200).json(assets);
    }
    catch(error){
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// Obtener un asset por ID
const getAssetByID = async (req, res) => {
    try{
        const asset = await Asset.findById(req.params.id);

        /*if(!asset){
            return res.status(404).json({ message: 'Asset not found' });
        }*/

        res.status(200).json(asset);
    } catch(error){
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// Crear un asset
const createAsset = async (req, res) => {
    try{   
        /*if(!req.body){
            return res.status(400).json({ message: 'Missing body' });
        }*/

        const asset = await Asset.create({
            title: req.body.title
        });
    
        res.status(200).json(asset);
    } catch(error){
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// Modificar un asset
const updateAsset = async (req, res) => {
    try{
        const asset = await Asset.findById(req.params.id);

        /*if(!asset){
            return res.status(404).json({ message: 'Asset not found' });
        }*/

        const update = await Asset.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.status(200).json(update);
    } catch(error){
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// Borrar un asset
const deleteAsset = async (req, res) => {
    try{
        const asset = await Asset.findById(req.params.id);

        /*if(!asset){
            return res.status(404).json({ message: 'Asset not found' });
        }*/
        
        await asset.deleteOne();
        res.status(200).json({message: req.params.id});
    } catch(error){
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export default {
    getAssets,
    getAssetByID,
    createAsset,
    updateAsset,
    deleteAsset,
}