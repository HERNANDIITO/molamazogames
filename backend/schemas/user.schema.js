import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    displayName:    { type: String, required: true },
    email:          { type: String, required: true, unique: true },
    password:       { type: String, required: true }, // [7-15 chars], 1 simbolo, 1 minuscula, 1 mayuscula, 1 numero
    signupDate:     { type: Date,   required: true },
    lastLogin:      { type: Date,   required: true }
    
});

export default userSchema;