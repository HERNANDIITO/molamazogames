import mongoose from 'mongoose';

const metaSchema = new mongoose.Schema({
    meta: {
        type: String,
        enum: [
            "2D",
            "3D",
            "Audio",
            "Video",
            "Codigo",
            "Otros"
        ]
    }
});

const Meta = mongoose.model('Meta', metaSchema);
export default Meta;