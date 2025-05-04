import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
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

    publicationDate: {
        type: Date,
        required: true 
    },

    content: {
        type: String,
        required: true
    }
});

commentSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    const comment = this; 
    await mongoose.model('Like').deleteMany({ comment: comment._id });
    next();
});

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;