import mongoose from 'mongoose';

const assetSchema = mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, 'Please, add value for nombre']
        },
        licencia: {
            type: String,
            required: [true, 'Please, value for licencia']
        },
        descripcion: {
            type: String,
            required: [false]
        },
        categorias: { // Array de categorías
            type: [String],
            required: [true, 'Please, add value for categorias']
        },
        etiquetas: { // Array de etiquetas
            type: [String],
            required: [false]
        },
        archivos: { // Array de enlaces a archivos
            type: [String],
            required: [true, 'Please, add value por erchivos']
        },
        autor: {
            type: String,
            required: [true, 'Please, add value for autor']
        },
        fecha_publicacion: {
            type: Date,
            required: [true, 'Please, add value for fecha_publicacion']
        },
        fecha_actualizacion: {
            type: Date,
            required: [true, 'Please, add value for fecha_actualizacion']
        },
        // tamaño (guardar o leer al obtener el archivo???)
    }
);

const Asset = mongoose.model('Asset', assetSchema);

export default Asset;