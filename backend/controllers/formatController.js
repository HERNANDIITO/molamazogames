import Format from '../schemas/format.schema.js';
import Meta from '../schemas/meta.schema.js';

import asyncHandler from 'express-async-handler'

import formats from '../db/formatData.js';

const setupFormats = asyncHandler( async (req, res, next) => {

    const newFormats = [];

    for (const formatArray of formats) {

        const metaCat = await Meta.findOne({meta: formatArray[0].meta})

        for (const format of formatArray) {
            try {
                const alreadyFormat = await Format.findOne({ name: format.name });
                
                if (alreadyFormat) {
                    continue;
                }
            
                const newFormat = new Format({
                    name: format.name,
                    meta: metaCat._id
                });

                const formatAdded = await newFormat.save();
                newFormats.push(formatAdded);

            } catch (error) {
                next(error)
            }
        };

    }


    return res.status(200).json({
        result: "OK",
        newFormats: newFormats 
    });
})

const getFormats = asyncHandler( async (req, res, next) => {
    const meta = req.query.meta;

    const responseFormats = [];

    if ( !meta ) {

        const formats = await Format.find().populate('meta');
        responseFormats.push(...formats);

    } else {
        const metaDoc = await Meta.findOne({meta: meta});

        if ( !metaDoc ) {
            return res.status(400).json({
                result: "Solicitud errónea.",
                msg: `La metacategoría indicada (${meta} no existe)`
            });
        }

        const formats = await Format.find({meta: metaDoc._id}).populate('meta')
        responseFormats.push(...formats);
    }

    return res.status(200).json({
        result: "OK.",
        responseFormats: responseFormats
    });

});

export {
    setupFormats,
    getFormats
}