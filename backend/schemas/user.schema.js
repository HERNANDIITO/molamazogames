import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email no válido']
    },

    password: {
        type: String,
        required: true,
    },

    signupDate: {
        type: Date,
        required: true 
    },

    profilePic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
    },

    lastLogin: {
        type: Date,
        required: true 
    },

    phone: {
        type: String,
        required: false
    }
    
});

const User = mongoose.model('User', userSchema);
export default User;