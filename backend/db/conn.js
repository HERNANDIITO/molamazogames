// db/conn.js
import mongoose from 'mongoose';

const MONGO_STRING = process.env.MONGO_STRING;

if (!MONGO_STRING) {
  throw new Error('MONGO_STRING no está definido en las variables de entorno');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
