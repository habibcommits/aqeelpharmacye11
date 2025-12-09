import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || '';

let isConnected = false;

export async function connectDB(): Promise<void> {
  if (isConnected) {
    return;
  }

  if (!MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not set');
  }

  try {
    await mongoose.connect(MONGO_URI);
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export { mongoose };
