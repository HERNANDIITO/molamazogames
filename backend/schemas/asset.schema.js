import mongoose from 'mongoose';

const fileSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    }
})

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
        categories: { // Array de categorías
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Category',
            required: true
        },
        tags: { // Array de etiquetas
            type: [mongoose.Schema.Types.ObjectId],
            required: [false],
            ref: 'Tag',
        },
        files: { // Array de enlaces a archivos
            type: [String],
            required: [false, 'Please, add value por erchivos']
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
        // tamaño (guardar o leer al obtener el archivo???)
    }
);

const Asset = mongoose.model('Asset', assetSchema);

export default Asset;