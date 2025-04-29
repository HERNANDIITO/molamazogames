import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    asset: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asset',
        required: true
    },

    date: {
        type: Date,
        required: true 
    },
});

const History = mongoose.model('History', historySchema);
export default History;