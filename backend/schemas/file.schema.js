import mongoose from 'mongoose';

const fileSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    mimetype: {
        type: String,
        required: true
    },
    format: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Format',
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    preview: {
        type: Boolean,
        required: true,
        default: false
    }
})

const File = mongoose.model('File', fileSchema);
export default File;