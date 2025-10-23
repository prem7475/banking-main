import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local. For MongoDB Atlas, use your Atlas connection string.');
}

// Check if it's a MongoDB Atlas URI (contains 'mongodb+srv://' or 'mongodb://' with cluster)
const isAtlasUri = MONGODB_URI.includes('mongodb+srv://') || (MONGODB_URI.includes('mongodb://') && MONGODB_URI.includes('.mongodb.net'));

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    // Use MongoDB Memory Server for development if no real URI is provided
    let uri = MONGODB_URI;
    if (MONGODB_URI === "mongodb://localhost:27017/banking") {
      const mongod = await MongoMemoryServer.create();
      uri = mongod.getUri();
    }

    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
