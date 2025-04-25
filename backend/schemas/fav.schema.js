import mongoose from 'mongoose';

const favSchema = new mongoose.Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    asset: {
        type: Schema.Types.ObjectId,
        ref: 'Asset'
    }
});

const Fav = mongoose.model('Fav', favSchema);
export default Fav;