import mongoose from 'mongoose';

const assetSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please, add value for name']
        },
        description: {
            type: String,
            required: [false]
        },
        categories: { 
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Category',
            required: true
        },
        meta: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Meta',
            required: true
        },
        tags: { 
            type: [mongoose.Schema.Types.ObjectId],
            required: [false],
            ref: 'Tag',
        },
        files: { 
            type: [mongoose.Schema.Types.ObjectId],
            required: [true],
            ref: 'File',
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Please, add value for autor'],
            ref: 'User'
        },
        publicationDate: {
            type: Date,
            required: [true, 'Please, add value for fecha_publicacion']
        },
        updateDate: {
            type: Date,
            required: [true, 'Please, add value for fecha_actualizacion']
        },
        size: {
            type: Number,
            required: true
        }
    }
);

assetSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    const asset = this; 
    await mongoose.model('Fav').deleteMany({ asset: asset._id });

    for (const fileID of asset.files) {
        await mongoose.model('File').findByIdAndDelete(fileID);   
    }
    
    next();
});

const Asset = mongoose.model('Asset', assetSchema);
export default Asset;