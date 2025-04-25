import mongoose, { Schema } from 'mongoose';

const formatSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true
    },

    meta: {
        type: Schema.Types.ObjectId,
        ref: 'meta',
        required: true
    }
});

const Format = mongoose.model('Format', assetSchema);
export default Format;