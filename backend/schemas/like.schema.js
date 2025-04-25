import mongoose, { Schema } from 'mongoose';

const likeSchema = new mongoose.Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },

    comment: {
        type: Schema.Types.ObjectId,
        ref: 'comment'
    }
});

const Like = mongoose.model('Like', likeSchema);
export default Like;