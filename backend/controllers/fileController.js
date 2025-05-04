import File from '../schemas/file.schema.js' 
import Asset from '../schemas/asset.schema.js'
import User from '../schemas/user.schema.js'
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
        const fileID = req.query.fileID;

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

const getPreviewFilesByAssetID = asyncHandler( async(req, res, next) => {
    try {
        const assetID = req.query.assetID;

        if ( !assetID || !(mongoose.Types.ObjectId.isValid(assetID)) ) {
            return res.status(400).json({
                result: "Solicitud errónea.",
                msg: `Faltan campos obligatorios: ${!assetID ? 'assetID ' : ''}`
            });
        }

        const files = await Asset.findById(assetID, {files: 1}).populate({path: 'files', match: { preview: true }});
        return res.status(200).json({
            result: "OK.",
            files: files.files
        });

    } catch (error) {
        next(error);
    }
})

const getFileByAssetID = asyncHandler( async(req,res,next) => {
    try {
        const assetID = req.query.assetID;

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
    const isPreview   = req.body.preview;

    if ( !fileID || !(mongoose.Types.ObjectId.isValid(fileID)) ) {
        return res.status(400).json({
            result: "Solicitud errónea.",
            msg: `Faltan campos obligatorios: ${!fileID ? 'fileID ' : ''}`
        });
    }

    if ( !name && !description && !isPreview ) {
        return res.status(400).json({
            result: "Solicitud errónea.",
            msg: `Nada que editar. Adjunta un name o una description`
        });
    }

    try {
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

        if ( isPreview != undefined ) {
            file.preview = Boolean(isPreview);
        }

        await file.save();
        return res.status(200).json({
            result: "OK.",
            file: file
        });  
    } catch (error) {
        next(error)
    }

})

const uploadFile = asyncHandler(async (req, res, next) => {
    try{
        
        const author        = req.user.id;
        
        const originalname  = req.file.originalname;
        const mimetype      = req.file.mimetype;
        const size          = req.file.size;
        const filePath      = req.file.path;
        
        const fileName      = req.body.name;
        const description   = req.body.description;
        const isPreview     = req.body.isPreview;

        if ( !description || !author || !originalname || !mimetype || !size || !filePath ) {
            return res.status(400).json({
                result: "Solicitud errónea.",
                msg: `Faltan campos obligatorios: ${!description ? 'description ' : ''}${!author ? 'author ' : ''}${!originalname ? 'originalname ' : ''}${!mimetype ? 'mimetype ' : ''}${!size ? 'size ' : ''}${!filePath ? 'filePath ' : ''}`
            });
        }

        const user = await User.findById(author);

        if ( !user ) {
            return res.status(400).json({
                result: "Solicitud errónea.",
                msg: `Dicho usuario no existe`
            });
        }

        const newFile = new File({
            name: fileName,
            originalName: originalname,
            description: description,
            mimetype: mimetype,
            size: size,
            author: author,
            path: filePath,
            preview: Boolean(isPreview)
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
    getPreviewFilesByAssetID,
    uploadFile,
    editFile
}