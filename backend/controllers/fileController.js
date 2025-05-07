import File from '../schemas/file.schema.js' 
import Format from '../schemas/format.schema.js'
import Asset from '../schemas/asset.schema.js'
import User from '../schemas/user.schema.js'
import asyncHandler from 'express-async-handler'
import archiver from 'archiver'
import fs from 'fs'

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

const downloadFile = asyncHandler( async(req, res, next) => {
    const fileID = req.query.fileID;
    
    if(!fileID || !(mongoose.Types.ObjectId.isValid(fileID))){
        return res.status(400).json({
            result:"Solicitud erronea",
            msg: `Faltan campos obligatorios o no son validos: ${!fileID ? 'fileID ' : ''}${!(mongoose.Types.ObjectId.isValid(fileID)) ? 'fileID no es una ID válida ' : ''}`
        });
    }

    const file = await File.findById(fileID);

    if (!file) {
        return res.status(404).send('Archivo no encontrado.');
    }

    if ( file.size > 2000000 ) {
        const zip = archiver('zip', {
            zlib: { level: 9 },
        });

        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${file.name}.zip"`);
        
        zip.pipe(res);

        const filePath = file.path;
        zip.append(fs.createReadStream(filePath), { name: file.originalName });
        
        zip.finalize();

        res.on('finish', () => {
            return res.status(200);
        });
    }

    res.download(file.path, file.originalName, (err) => {
        if (err) {
            console.error('Error al descargar el archivo:', err);
            return res.status(500);
        }
    });

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

const getFormatByMimeType = async (mimeType) => {
    const mimeMap = {
        // Formatos de imagen
        'image/jpeg': 'JPG/JPEG',
        'image/png': 'PNG',
        'image/svg+xml': 'SVG',
        'image/tiff': 'TIFF',
        'image/vnd.ms-dds': 'DDS',
        'image/tga': 'TGA',
      
        // Formatos de audio
        'audio/mpeg': 'MP3',
        'audio/ogg': 'OGG',
        'audio/wav': 'WAV',
        'audio/flac': 'FLAC',
        'audio/x-midi': 'MIDI',
        'audio/x-wav': 'WAV',
        'audio/x-ms-wma': 'WAV',
        
        // Formatos de video
        'video/mp4': 'MP4',
        'video/webm': 'WEBM',
        'video/x-msvideo': 'AVI',
        'video/avi': 'AVI',
        'video/mpeg': 'MP4',  // Es posible que algunas veces se reconozca como MPEG en lugar de MP4
        'video/quicktime': 'MOV',
        'video/x-flv': 'FLV',  // Flash Video
        'video/x-matroska': 'WEBM',  // WebM también puede ser un tipo de Matroska
      
        // Formatos de 3D
        'application/vnd.blender': 'BLEND',
        'model/x-obj': 'OBJ',
        'application/x-tar': 'STL',
        'application/json': 'GLTF / GLB',  // GLTF se usa también con JSON
        'application/octet-stream': 'FBX',  // FBX generalmente no tiene un MIME type estándar
      
        // Formatos de código
        'text/x-csrc': 'C',
        'text/x-c++src': 'C++',
        'application/javascript': 'JavaScript++',
        'text/lua': 'Lua',
        'text/x-python': 'Python',
        'application/typescript': 'TypeScript',
        'application/yaml': 'YAML',
        'text/html': 'HTML',  // HTML también es relevante en algunos casos como "Código"
        
        // Otros
        'application/json': 'JSON',
        'application/pdf': 'PDF',
        'application/zip': 'ZIP',
        'application/xml': 'XML',
        'text/csv': 'CSV',
        'text/plain': 'Otros',
        'application/x-sqlite3': 'SQL / SQLite',  // SQLite3
        'application/ini': 'INI',
        'application/x-navmesh': 'NAVMESH / AI Graphs' // Para gráficos de inteligencia artificial
    };
  
    // Buscar en el mapa de MIME types
    const formatName = mimeMap[mimeType];

    // Buscar el formato correspondiente en los arrays
    if ( formatName ) {
        const file = await Format.findOne({ name: { $regex: formatName, $options: 'i' } });
        if ( file ) {
            return file._id
        }
    }

    const otros = await Format.findOne({name: "Otros"});
  
    // Si no se encuentra un formato válido, devolver 'Otros'
    return otros._id;
};

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

        const formatID = await getFormatByMimeType(mimetype);

        const newFile = new File({
            name: fileName,
            originalName: originalname,
            description: description,
            mimetype: mimetype,
            size: size,
            author: author,
            path: filePath,
            preview: isPreview,
            format: formatID
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
    editFile,
    downloadFile
}