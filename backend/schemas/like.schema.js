import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        required: true
    }
});

const Like = mongoose.model('Like', likeSchema);
export default Like;