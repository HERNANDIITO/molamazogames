import Asset from '../schemas/asset.schema.js';
import File from '../schemas/file.schema.js';
import User from '../schemas/user.schema.js';
import { createNewTagFunc } from './tagController.js';
import { checkCategory, getAllCategoryAndChildrenIds } from './categoryController.js';
import fs from 'fs';
import archiver from 'archiver';

import asyncHandler from 'express-async-handler'
import moment from 'moment';
import mongoose from 'mongoose';
import Meta from '../schemas/meta.schema.js';
import Format from '../schemas/format.schema.js';

// Obtener todos los assets
const getAssets = asyncHandler(async (req, res, next) => {

    const orderBy     = req.query.orderBy   ? req.query.orderBy   : undefined;
    const searchBar   = req.query.searchBar ? req.query.searchBar : undefined;
    const tags        = req.query.tags      ? req.query.tags      : undefined;
    const author      = req.query.author    ? req.query.author    : undefined;
    const category    = req.query.category  ? req.query.category  : undefined;
    const format      = req.query.format    ? req.query.format    : undefined;
    const size        = req.query.size      ? req.query.size      : undefined;
    const meta        = req.query.meta      ? req.query.meta      : undefined;
    const isStrict    = req.query.isStrict  ? req.query.isStrict === 'true' : false;

    try {

        const filters = [];
                
        if (searchBar) {
            filters.push({ $or: [
                { name: { $regex: searchBar, $options: 'i' } },
                { description: { $regex: searchBar, $options: 'i' } }
            ]});
        }
        
        if (tags && tags.length > 0) {

            const tagIDs = [];


            for (const tag of tags) {
                tagIDs.push((await createNewTagFunc(tag)).tag._id);
            }

            if ( isStrict ) {
                filters.push({ tags: { $all: tagIDs } });
            } else {
                filters.push({ tags: { $in: tagIDs } });
            }
        }

        if (author) {
            let possibleAuthors = [];

            for (const possibleAuthor of author) {                
                if ( isStrict ) {
                    const user = await User.findOne({ name: possibleAuthor }).select('_id');
                    if ( !user ) { continue; };
                    possibleAuthors.push( user._id );
                } else {
                    const users = await User.find({ name: { $regex: possibleAuthor, $options: 'i' } }).select('_id');
                    possibleAuthors.push( ...(users.map(user => user._id)) )
                }
            }

            filters.push({ author: { $in: possibleAuthors } });
        }

        if (category && category.length > 0) {
            const expandedCategoryIds = await getAllCategoryAndChildrenIds(category);

            if ( isStrict ) {
                filters.push({ categories: { $all: expandedCategoryIds } });
            } else {
                filters.push({ categories: { $in: expandedCategoryIds } });
            }
        }

        if ( size ) {
            if (size.max && size.min) { 
                filters.push({ size: { $gte: size.max, $lte: size.min } });      
            } else if (size.min) {
                filters.push({ size: { $gte: size.min } });
            } else if (size.max) {
                filters.push({ size: { $lte: size.max } });
            }
        }

        const metaFilters = [];
        if (meta && Array.isArray(meta)) {
            for (const m of meta) {
                if (!mongoose.Types.ObjectId.isValid(m)) {
                    const metaObj = await Meta.findOne({ meta: m });
                    if (metaObj) {
                        metaFilters.push({ meta: metaObj._id });
                    }
                } else {
                    metaFilters.push({ meta: m });
                }
            }
        }

        const query = isStrict ? { $and: filters } : { $or: filters };

        console.log("query", query);

        if (metaFilters.length > 0) {
            if (!query.$and) {
                query.$and = [];
            }

            query.$and.push(...metaFilters);
        }
        
        if (format) {
            // Encontrar todos los archivos con ese formato
            const filesWithFormat = await File.find({ format: format });

            // Extraemos los IDs de esos archivos
            const fileIds = filesWithFormat.map(file => file._id);

            // Ahora buscamos los assets que tengan esos archivos
            if ( isStrict ) {

                if (!query.$and) {
                    query.$and = [];  // Si no existe $and, inicializarlo como un array
                }

                query.$and.push({ files: { $in: fileIds } });

            } else {

                if (!query.$or) {
                    query.$or = [];  // Si no existe $or, inicializarlo como un array
                }

                query.$or.push({ files: { $in: fileIds } });

            }

        }

        if ( orderBy ) {
            orderBy[Object.keys(orderBy)[0]] = parseInt(orderBy[Object.keys(orderBy)[0]], 10);
        }

        // Primero, estructuramos la consulta inicial con el query y la lógica de filtro por formato
        let assets = await Asset.find(query).sort(orderBy).populate('author tags image').populate({
            path: 'categories',
            populate: {
                path: 'meta'
            }
        }).populate('files');

        if ( isStrict && format ) {
            assets = assets.filter((asset) => {
                for (const file of asset.files) {
                    if ( format.includes(file.format) ) {
                        return true;
                    }
                }
                return false;
            })
        } else if ( !isStrict && format ) {
            const assetsFormat = await Asset.aggregate([
                {
                  $lookup: {
                    from: 'files',
                    localField: 'files',
                    foreignField: '_id',
                    as: 'fileDetails'
                  }
                },
                {
                  $match: {
                    'fileDetails.format': { $in: format }
                  }
                }
            ]);
            assets.push([...assetsFormat]);
        }
        
        return res.status(200).json({
            result: "OK.",
            assets: assets,
            results: assets.length
        });
    }
    catch(error){
        next(error);
    }
})

const downloadAsset = asyncHandler( async (req, res, next) => {
    const assetID = req.query.assetID;

    if(!assetID || !(mongoose.Types.ObjectId.isValid(assetID))){
        return res.status(400).json({
            result:"Solicitud erronea",
            msg: `Faltan campos obligatorios o no son validos: ${!assetID ? 'assetID ' : ''}${!(mongoose.Types.ObjectId.isValid(assetID)) ? 'assetID no es una ID válida ' : ''}`
        });
    }

    try {
        const asset = await Asset.findById(assetID).populate('files');

        const zip = archiver('zip', {
            zlib: { level: 9 }, // Nivel de compresión máximo
        });

        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${asset.name}.zip"`);

        zip.pipe(res);

        for (let file of asset.files) {
            const filePath = file.path;  // Asumimos que tienes el path completo en la base de datos
            zip.append(fs.createReadStream(filePath), { name: file.originalName });
        }

        zip.finalize();

        res.on('finish', () => {
            return res.status(200);
        });

    } catch (error) {
        next(error)
    }
})

// Obtener un asset por ID
const getAssetByID = asyncHandler(async (req, res, next) => {
    try{

        const assetID = req.query.assetID
        
        if(!assetID || !(mongoose.Types.ObjectId.isValid(assetID))){
            return res.status(400).json({
                result:"Solicitud erronea",
                msg: `Faltan campos obligatorios o no son validos: ${!assetID ? 'assetID ' : ''}${!(mongoose.Types.ObjectId.isValid(assetID)) ? 'assetID no es una ID válida ' : ''}`
            });
        }
        
        const asset = await Asset.findById(assetID).populate('author categories files tags meta image');

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
        const image             = req.body.image;
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
        let meta = [];

        for (const categoryID of categoryIDs) {

            if ( !(mongoose.Types.ObjectId.isValid(categoryID)) ) {
                falseCategories.push(categoryID);
                continue;
            }

            const category = await checkCategory(categoryID);

            if ( category ) {
                trueCategories.push(categoryID);
                if ( !meta.includes(category.meta.toString() ) ) {
                    meta.push(category.meta.toString() );
                }

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
                const format = await Format.findById(file.format);

                if ( !meta.includes(format.meta.toString() ) ) {
                    meta.push(format.meta.toString() );
                }

                assetSize += file.size;
            }
        }

        if ( falseFileIDs.length > 0 ) {
            errors += `${falseFileIDs.length} archivos de los ${files.length} enviados no existen. `;
        }

        if ( image ) {
            // Comprobamos que image sea una id valida
            if ( !(mongoose.Types.ObjectId.isValid(image)) ) {
                errors += `La ID para la imagen de portada no es válida.`;
            } else {

                // Si es  una ID valida comprobamos que haya un elemento con dicha id en la bd
                const newImage = await File.findById(image);
                if ( !newImage ) {
                    errors += `La imagen que se pretende poner como portada, no existe.`;
                }
            }
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
            files: files,
            meta: meta,
            image: image
        });
    
        res.status(200).json(asset);
    } catch(error){
        next(error)
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
        const image         = req.body.image      ;

        if ( !assetID || !(mongoose.Types.ObjectId.isValid(assetID)) ||
             !userID  || !(mongoose.Types.ObjectId.isValid(userID )) ) {
                return res.status(400).json({
                    result:"Solicitud erronea.",
                    msg: `Faltan campos obligatorios: ${!assetID ? 'assetID ' : ''}${!userID ? 'userID ' : ''}`
                });
        }

        if ( !newName && !desc && !newCategories && !tags && !newFiles && !image ) {
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

                const category = await checkCategory(categoryID);

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

        if ( image ) {
            // Comprobamos que image sea una id valida
            if ( !(mongoose.Types.ObjectId.isValid(image)) ) {
                error += `La ID para la imagen de portada no es válida.`;
            } else {

                // Si es  una ID valida comprobamos que haya un elemento con dicha id en la bd
                const newImage = await File.findById(image);
                if ( !newImage ) {
                    error += `La imagen que se pretende poner como portada, no existe.`;
                } else {
                    // Si la ID es valida y hay un elemento con dicha ID procedemos a eliminar la foto existente
                    await File.deleteOne({_id: asset.image});

                    asset.image = image;
                }
            }
        }

        if ( newFiles ) {
            const currentFiles = asset.files;
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

        const assetID = req.query.assetID;
        const fileID  = req.query.fileID;

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
        const assetID = req.query.assetID;

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
    deleteFileFromAsset,
    downloadAsset
}