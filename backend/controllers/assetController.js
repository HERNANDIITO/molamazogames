import Asset from '../schemas/asset.schema.js';
import File from '../schemas/file.schema.js';
import Category from '../schemas/category.schema.js';
import User from '../schemas/user.schema.js';
import { createNewTagFunc } from './tagController.js';

import asyncHandler from 'express-async-handler'
import moment from 'moment';
import mongoose from 'mongoose';

// Obtener todos los assets
const getAssets = asyncHandler(async (req, res, next) => {

    const orderBy     = req.body.orderBy;
    const searchBar   = req.body.searchBar;
    const tags        = req.body.tags;
    const author      = req.body.author;
    const category    = req.body.category;
    const format      = req.body.format;
    const size        = req.body.size;
    const meta        = req.body.meta;

    try{

        const filters = {};
                
        if (searchBar) {
            filters.$or = [
                { name: { $regex: searchBar, $options: 'i' } },
                { description: { $regex: searchBar, $options: 'i' } }
            ];
        }
        
        if (tags && tags.length > 0) { 
            filters.tags = { $in: tags };    
        }
        
        if (author) { 
            filters.author = author    
        }
        
        if (category && category.length > 0) { 
            filters.category = { $in: category };    
        }
        
        if (format) { 
            filters.format = format    
        }
        
        if (size.max && size.min) { 
            filters.size = { $gte: size.max, $lte: size.min };      
        } else if (size.min) {
            filters.size = { $gte: size.min };
        } else if (size.max) {
            filters.size = { $lte: size.max };
        }
        
        if (meta) { 
            filters.meta = meta      
        }

        console.log("FILTERS", filters)
        console.log("ORDER BY", orderBy)

        const assets = await Asset.find(filters).sort(orderBy);
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

        const assetID = req.body.assetID
        
        if(!assetID || !(mongoose.Types.ObjectId.isValid(assetID))){
            return res.status(400).json({
                result:"Solicitud erronea",
                msg: `Faltan campos obligatorios: ${!assetID ? 'assetID ' : ''}`
            });
        }
        
        const asset = await Asset.findById(assetID);

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

        const userID            = req.user.id;
        const name              = req.body.name;
        const description       = req.body.description;
        const categoryIDs       = req.body.categories;
        const tagIDs            = req.body.tags;
        const files             = req.body.files;
        const publicationDate   = moment();
        const updateDate        = moment();

        if ( !userID || !(mongoose.Types.ObjectId.isValid(userID)) ||!name || !description || !categoryIDs || !files ) {
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

            if ( !(mongoose.Types.ObjectId.isValid(categoryID)) ) {
                falseCategories.push(categoryID);
                continue;
            }

            const category = await Category.findById(categoryID);

            if ( category ) {
                trueCategories.push(categoryID);
            } else {
                falseCategories.push(categoryID);
            }

        }

        if ( falseCategories.length > 0 ) {
            errors += `${falseCategories.length} categorias de las ${categoryIDs.length} enviadas no existen. `;
        }

        const trueTags = [];

        if ( tagIDs.length > 0 ) {
            for (const tagID of tagIDs) {
                const tagResult = await createNewTagFunc(tagID);
                trueTags.push( tagResult.tag._id );
            }
        }

        const falseFileIDs = [];
        let assetSize = 0;
        for (const fileID of files) {

            if ( !(mongoose.Types.ObjectId.isValid(fileID)) ){
                falseFileIDs.push(fileID);
                continue;
            }

            const file = await File.findById(fileID);

            if ( !file ) {
                falseFileIDs.push(fileID);
            } else {
                assetSize += file.size;
            }
        }

        if ( falseFileIDs.length > 0 ) {
            errors += `${falseFileIDs.length} archivos de los ${files.length} enviados no existen. `;
        }

        if ( errors ) {
            return res.status(400).json({
                result: "Solicitud errónea.",
                msg: errors
            });
        }

        const asset = await Asset.create({
            name: name,
            description: description,
            author: userID,
            tags: trueTags,
            categories: trueCategories,
            publicationDate: publicationDate,
            updateDate: updateDate,
            size: assetSize,
            files: files
        });
    
        res.status(200).json(asset);
    } catch(error){
        res.status(500).json({ message: 'Server error', error: error.message });
    }
})

const updateAsset = asyncHandler(async (req, res, next) => {
    try {

        const assetID       = req.body.assetID    ;
        const userID        = req.user.id         ;
        const newName       = req.body.name       ;
        const newDesc       = req.body.description;
        const newCategories = req.body.categories ;
        const newTags       = req.body.tags       ;
        const newFiles      = req.body.files      ;

        if ( !assetID || !(mongoose.Types.ObjectId.isValid(assetID)) ||
             !userID  || !(mongoose.Types.ObjectId.isValid(userID )) ) {
                return res.status(400).json({
                    result:"Solicitud erronea.",
                    msg: `Faltan campos obligatorios: ${!assetID ? 'assetID ' : ''}${!userID ? 'userID ' : ''}`
                });
        }

        if ( !newName && !desc && !categories && !tags && !files ) {
            return res.status(400).json({
                result:"Solicitud erronea.",
                msg: `No hay nada que cambiar`
            });
        }

        const asset = await Asset.findById(assetID);

        let error = "";

        if ( newName ) { asset.name = newName; }
        if ( newDesc ) { asset.desc = newDesc; }

        if ( newCategories ) {
            let errorCats = 0;
            for (const categoryID of newCategories) {
                if ( !(mongoose.Types.ObjectId.isValid(categoryID)) ) {
                    errorCats++;
                    continue;
                }

                const category = await Category.findById(categoryID);

                if ( !category ) {
                    errorCats++;
                    continue;
                }
            }

            asset.categories = newCategories;

            if ( errorCats > 0 ) { error += `${errorCats} categorias de las ${newCategories.length} solicitadas no existen.` }
        }

        if ( newTags ) {
            const tagIDs = [];
            for (const tag of newTags) {
                const newTag = await createNewTagFunc(tag);
                tagIDs.push(newTag._id);
            }

            asset.tags = tagIDs;
        }

        if ( newFiles ) {
            const currentFiles = asset.files;
            console.log("currentFiles", currentFiles);
            const removedFiles = currentFiles.filter(file => !newFiles.includes(file));
            const addedFiles   = newFiles.filter(file => !currentFiles.includes(file));

            let errorFiles = 0;

            for (const removedFile of removedFiles) {
                if ( !(mongoose.Types.ObjectId.isValid(removedFile)) ) {
                    errorFiles++;
                    break;
                }

                const file = await File.findById(removedFile);

                if ( !file ) {
                    errorFiles++;
                    break;
                }

                await file.deleteOne();
                asset.files.pull(removedFile);
            }

            if ( errorFiles > 0 ) { error += `Uno de los archivos a eliminar no existe` }

            errorFiles = 0;
            for (const addedFile of addedFiles) {
                if ( !(mongoose.Types.ObjectId.isValid(addedFile)) ) {
                    errorFiles++;
                    break;
                }

                const file = await File.findById(addedFile);

                if ( !file ) {
                    errorFiles++;
                    break;
                }

                asset.files.push(addedFile);
            }
        }

        if (error) {
            return res.status(400).json({
                result:"Algo ha ido mal.",
                msg: error
            });
        }

        await asset.save();
        return res.status(200).json({
            result: "OK.",
            updatedAsset: asset
        })

    } catch (error) {
        next(error)
    }
})

const deleteFileFromAsset = asyncHandler( async (req,res,next) => {
    try {

        const assetID = req.body.assetID;
        const fileID  = req.body.fileID;

        if ( !assetID || !(mongoose.Types.ObjectId.isValid(assetID)) ||
             !fileID  || !(mongoose.Types.ObjectId.isValid(fileID))) {
                return res.status(400).json({
                    result:"Solicitud erronea.",
                    msg: `Faltan campos obligatorios: ${!assetID ? 'assetID ' : ''}${!fileID ? 'fileID ' : ''}`
                });
        }

        const asset = await Asset.findById(assetID);
        const file  = await File.findById(fileID);

        if ( !asset || !file ) {
            return res.status(400).json({
                result:"Solicitud erronea.",
                msg: `Los siguientes elementos no existen: ${!asset ? 'asset ' : ''}${!file ? 'file ' : ''}`
            });
        }

        if ( asset.author != req.user.id ) {
            return res.status(403).json({
                result:"Permiso denegado.",
                msg: `No puedes editar un asset que no te pertenece`
            });  
        }

        await file.deleteOne();
        
        asset.files.pull(fileID);
        await asset.save()

        return res.status(400).json({
            result:"OK.",
            msg: `${file.name} eliminado con exito de ${asset.name}`
        });

    } catch (error) {
        next(error)
    }
})

// Borrar un asset
const deleteAsset = asyncHandler(async (req, res, next) => {

    try{
        const assetID = req.body.assetID;

        if(!assetID || !(mongoose.Types.ObjectId.isValid(assetID))){
            return res.status(404).json({
                result:"Solicitud erronea.",
                msg: `Faltan campos obligatorios: ${!assetID ? 'assetID ' : ''}`
            });
        }

        const asset = await Asset.findById(assetID);

        if ( !asset ) {
            return res.status(404).json({
                result:"Solicitud erronea.",
                msg: `Dicho asset no existe`
            });
        }

        if ( asset.author != req.user.id ) {
            return res.status(403).json({
                result:"Permiso denegado.",
                msg: `No puedes eliminar un asset que no te pertenece`
            });  
        }
        
        const deletion = await asset.deleteOne();
        res.status(200).json({
            result: "OK.",
            deletedAsset: deletion
        });

    } catch(error){
        next(error)
    }
})

export {
    getAssets,
    getAssetByID,
    createAsset,
    updateAsset,
    deleteAsset,
    deleteFileFromAsset
}