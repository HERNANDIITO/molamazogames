import mongoose from 'mongoose';

const categoryChild = new mongoose.Schema({
    name: { 
        type: String,
        required: true
    },

    children: {
        type: [this],
        default: undefined
    },
});

const categorySchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true
    },

    children: {
        type: [categoryChild],
        default: undefined
    },

    meta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meta',
        required: true
    }
});

const Category = mongoose.model('Category', categorySchema);
export default Category;