import Tag from '../schemas/tag.schema.js';

import db from '../db/conn.js';
import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler'

const getAllTags = asyncHandler( async (req, res, next) => {
    try {
        const tags = await Tag.find();
        res.json(tags);
    }
    catch (err) {
        next(err);
    }
})

const createNewTagFunc = async (name) => {

    const nameToLowerCase = name.toLowerCase();
    const alreadyTag = await Tag.findOne({ name: nameToLowerCase }, 'name');
    
    if (alreadyTag) {
        return
    }

    const nuevaTag = new Tag({
        name: nameToLowerCase
    });

    const tag = await nuevaTag.save();
    return tag;

}

const createNewTag = asyncHandler( async (req,res,next) => {
    const {name} = req.body;
    if (!name) {
            return res.status(400).json({
                result: "Solicitud errónea.",
                msg: `Faltan campos obligatorios: ${!name ? 'name ' : ''}`
            });
        }

    try {
        const tag = await createNewTagFunc(name);

        if ( !tag ) {
            return res.status(400).json({
                result: "Solicitud errónea.",
                msg: `La etiqueta '${name}' ya existe.`
            });
        }

        res.json({
            result: "OK",
            tag: tag
        });

    } catch (error) {
        next(error)
    }
})

const createNewTags = asyncHandler( async(req,res,next) => {
    const {names} = req.body;

    const tagsNuevas = [];

    for (const name of names) {
        try {
            const tag = await createNewTagFunc(name);

            if ( tag ) {
                tagsNuevas.push(tag);
            }

        } catch (error) {
            next(error)
        }        
    };

    res.json({
        result: "OK",
        tags: tagsNuevas
    });

})

export {
    getAllTags,
    createNewTag,
    createNewTags
}