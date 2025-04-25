import mongoose from 'mongoose';

const formatSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true
    },

    meta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'meta',
        required: true
    }
});

const Format = mongoose.model('Format', formatSchema);
export default Format;