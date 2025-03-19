import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    displayName:    { type: String, required: true },
    email:          { type: String, required: true, unique: true },
    password:       { type: String, required: true },
    signupDate:     { type: Date,   required: true },
    lastLogin:      { type: Date,   required: true }
    
});

export default userSchema;