import mongoose, { Schema } from 'mongoose';

const commentSchema = new mongoose.Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    asset: {
        type: Schema.Types.ObjectId,
        ref: 'Asset',
        required: true
    },

    publicationDate: {
        type: Date,
        required: true 
    },

    content: {
        type: String,
        required: true
    },

    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'Likes',
        default: []
    }]


});

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;