import File from '../schemas/file.schema.js' 
import Asset from '../schemas/asset.schema.js'
import asyncHandler from 'express-async-handler'

import mongoose from 'mongoose'

const getFiles = asyncHandler( async(req,res,next) => {
    try {

        const files = await File.find();
        return res.status(200).json({
            result: "OK.",
            files: files
        });

    } catch (error) {
        next(error);
    }
})

const getFileByID = asyncHandler( async(req,res,next) => {
    try {
        const fileID = req.body.fileID;

        if ( !fileID || !(mongoose.Types.ObjectId.isValid(fileID)) ) {
            return res.status(400).json({
                result: "Solicitud errónea.",
                msg: `Faltan campos obligatorios: ${!fileID ? 'fileID ' : ''}`
            });
        }

        const file = await File.findById(fileID);

        if ( !file ) {
            return res.status(400).json({
                result: "Solicitud errónea.",
                msg: `Dicho archivo no existe`
            });
        }

        return res.status(200).json({
            result: "OK.",
            file: file
        });

    } catch (error) {
        next(error);
    }
})

const getFileByAssetID = asyncHandler( async(req,res,next) => {
    try {
        const assetID = req.body.assetID;

        if ( !assetID || !(mongoose.Types.ObjectId.isValid(assetID)) ) {
            return res.status(400).json({
                result: "Solicitud errónea.",
                msg: `Faltan campos obligatorios: ${!assetID ? 'assetID ' : ''}`
            });
        }

        const files = await Asset.findById(assetID, {files: 1}).populate('files');
        return res.status(200).json({
            result: "OK.",
            files: files.files
        });

    } catch (error) {
        next(error);
    }
})

const editFile = asyncHandler( async(req,res,next) => {

    const fileID      = req.body.fileID;
    const name        = req.body.name;
    const description = req.body.description;

    if ( !fileID || !(mongoose.Types.ObjectId.isValid(fileID)) ) {
        return res.status(400).json({
            result: "Solicitud errónea.",
            msg: `Faltan campos obligatorios: ${!fileID ? 'fileID ' : ''}`
        });
    }

    if ( !name && !description ) {
        return res.status(400).json({
            result: "Solicitud errónea.",
            msg: `Nada que editar. Adjunta un name o una description`
        });
    }

    const file = await File.findById(fileID);

    if ( !file ) {
        return res.status(400).json({
            result: "Solicitud errónea.",
            msg: `Dicho file no existe`
        });
    }

    if ( name ){
        file.name = name;
    }

    if ( description ) {
        file.description = description;
    }

    await file.save();
    return res.status(200).json({
        result: "OK.",
        file: file
    });

})

const uploadFile = asyncHandler(async (req, res, next) => {
    try{

        const { originalname: originalname, mimetype: mimetype, size: size, path: filePath } = req.file;
        console.log(originalname, mimetype, size, filePath)
        const description   = req.body.description;
        const author        = req.user.id;

        if ( !description || !author || !originalname || !mimetype || !size || !filePath ) {
            return res.status(400).json({
                result: "Solicitud errónea.",
                msg: `Faltan campos obligatorios: ${!description ? 'description ' : ''}${!author ? 'author ' : ''}${!originalname ? 'originalname ' : ''}${!mimetype ? 'mimetype ' : ''}${!size ? 'size ' : ''}${!filePath ? 'filePath ' : ''}`
            });
        }

        const newFile = new File({
            name: req.file.filename,
            originalName: originalname,
            description: description,
            mimetype: mimetype,
            size: size,
            author: author,
            path: filePath
        });

        const file = await newFile.save();

        return res.status(200).json({
            result: "OK.",
            file: file
        });

    }
    catch(error){
        next(error);
    }
})


export {
    getFiles,
    getFileByID,
    getFileByAssetID,
    uploadFile,
    editFile
}