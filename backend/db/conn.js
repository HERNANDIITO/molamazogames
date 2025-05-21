// Importamos Mongo
import mongoose from 'mongoose';

// Importamos dotenv
import dotenv from 'dotenv';
dotenv.config();

// Conexion
mongoose.connect(process.env.MONGO_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to Mongoose'))
  .catch(error => console.log('Connection failed:', error));

export default mongoose;