import mongoose, { Schema } from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true
    },

    children: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: []
    }],

    meta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meta',
        required: true
    }
});

const Category = mongoose.model('Category', categorySchema);
export default Category;