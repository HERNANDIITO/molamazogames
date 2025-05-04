import Category from '../schemas/category.schema.js';
import Meta from '../schemas/meta.schema.js';

import asyncHandler from 'express-async-handler'

import allCats from '../db/categoryData.js';

async function getAllCategoryAndChildrenIds(categoryIds) {
    const allIds = new Set();

    async function collectChildren(ids) {
        for (const id of ids) {
            if (!allIds.has(id.toString())) {
                allIds.add(id.toString());
                const category = await Category.findById(id).populate('meta');
                if (category && category.children.length > 0) {
                    await collectChildren(category.children);
                }
            }
        }
    }

    await collectChildren(categoryIds);
    return Array.from(allIds);
}

async function checkCategory(categoryID) {

    const categories = await Category.find();

    for (const category of categories) {

        if ( category._id == categoryID ) { return category; }

        if ( category.children ) {
            for (const child of category.children) {
                if ( child._id == categoryID ) { return category; }
            }
        }

    }

    return undefined;
}

const getAllCategories = asyncHandler( async (req, res, next) => {

    const metaName = req.query.meta;

    try {

        let categories;

        if ( metaName ) {
            const meta = await Meta.findOne({meta: metaName})
            categories = await Category.find({meta: meta._id}, {__v:0, meta:0});
        } else {
            categories = await Category.find({}, {__v:0}).populate('meta');
        }

        res.status(200).json({
            result: 'OK',
            categories: categories
        });
        
    }

    catch (err) {
        next(err);
    }
})

const setupCategories = asyncHandler( async (req, res, next) => {

    try {

      const metas = await Meta.find();

      for (const categoryData of allCats) {

        const meta = metas.find(findingMeta => {
          if ( findingMeta.meta == categoryData.meta ) { return true; }
          return false;
        })

        categoryData.meta = meta._id;

        const category = await Category.create(categoryData);
        await category.save();

      }

    } catch (error) {
        next(error);
    }

    res.status(200).json({
        result: "OK"
    })

})

export {
    getAllCategories,
    setupCategories,
    getAllCategoryAndChildrenIds,
    checkCategory
}