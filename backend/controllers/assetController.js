import Asset from '../schemas/asset.schema.js';
import Category from '../schemas/category.schema.js';
import User from '../schemas/user.schema.js';
import { createNewTagFunc } from './tagController.js';

import asyncHandler from 'express-async-handler'
import moment from 'moment';

// Obtener todos los assets
const getAssets = asyncHandler(async (req, res, next) => {
    try{
        const assets = await Asset.find();
        res.status(200).json({
            result: "OK.",
            assets: assets
        });
    }
    catch(error){
        next(error);
    }
})

// Obtener un asset por ID
const getAssetByID = asyncHandler(async (req, res, next) => {
    try{

        const asset = await Asset.findById(req.params.id);

        if(!asset){
            return res.status(404).json({ message: 'Asset not found' });
        }

        res.status(200).json({
            result: "OK.",
            asset: asset
        });

    } catch(error){

        res.status(500).json({ message: 'Server error', error: error.message });

    }
})

// Crear un asset
const createAsset = asyncHandler(async (req, res, next) => {
    try{

        console.log(req.user)

        const userID            = req.user.id;
        const name              = req.body.name;
        const description       = req.body.description;
        const categoryIDs       = req.body.categories;
        const tagIDs            = req.body.tags;
        const files             = req.body.files;
        const publicationDate   = moment();
        const updateDate        = moment();
        
        if ( !userID || !name || !description || !categoryIDs || !files ) {
            return res.status(400).json({
                result: "Solicitud errónea.",
                msg: `Faltan campos obligatorios: ${!userID ? 'userID ' : ''}${!name ? 'name ' : ''}${!description ? 'description ' : ''}${!files ? 'files ' : ''}${!categoryIDs ? 'categories ' : ''}`
            });
        }

        let errors = "";

        const user = await User.findById(userID);

        if ( !user ) {
            errors += "Dicho usuario no existe. ";
        }

        const trueCategories = [];
        const falseCategories = [];

        for (const categoryID of categoryIDs) {

            const category = await Category.findById(categoryID);

            if ( category ) {
                trueCategories.push(categoryID);
            } else {
                falseCategories.push(categoryID);
            }

        }

        if ( falseCategories.length > 0 ) {
            errors += `${falseCategories.length} de las ${categoryIDs.length} no existen. `;
        }

        const trueTags = [];

        if ( tagIDs.length > 0 ) {
            for (const tagID of tagIDs) {
                const tagResult = await createNewTagFunc(tagID);
                trueTags.push( tagResult.tag._id );
            }
        }

        const asset = await Asset.create({
            name: name,
            description: description,
            author: userID,
            tags: trueTags,
            categories: trueCategories,
            publicationDate: publicationDate,
            updateDate: updateDate,
        });
    
        res.status(200).json(asset);
    } catch(error){
        res.status(500).json({ message: 'Server error', error: error.message });
    }
})

// Modificar un asset
const updateAsset = async (req, res, next) => {
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
const deleteAsset = asyncHandler(async (req, res, next) => {
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
})

export {
    getAssets,
    getAssetByID,
    createAsset,
    updateAsset,
    deleteAsset,
}