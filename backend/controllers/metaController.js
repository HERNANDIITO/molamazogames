import Meta from '../schemas/meta.schema.js';
import asyncHandler from 'express-async-handler'

const setupMeta = asyncHandler( async (req, res, next) => {
    const metaCategories = [
        "2D",
        "3D",
        "Audio",
        "Video",
        "Codigo",
        "Otros"
    ]

    const newMetaCategories = [];

    for (const metaCat of metaCategories) {
        try {

            const alreadyMeta = await Meta.findOne({ meta: metaCat }, 'meta');
            
            if (alreadyMeta) {
                continue;
            }
        
            const newMetaCat = new Meta({
                meta: metaCat
            });
        
            const meta = await newMetaCat.save();
            newMetaCategories.push(meta);
        } catch (error) {
            next(error)
        }
    };

    res.json({
        result: "OK",
        newMetaCategories: newMetaCategories 
    });
})

const getMeta = asyncHandler( async (req, res, next) => {
    try {
        const metaCategories = await Meta.find();
        res.json(metaCategories);
    }
    catch (err) {
        next(err);
    }
});

export {
    setupMeta,
    getMeta
}