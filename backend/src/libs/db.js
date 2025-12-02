import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB(uri) {
  if (isConnected) return mongoose;

  if (!uri) {
    throw new Error('Missing MongoDB connection string');
  }

  mongoose.connection.on('connected', () => {
    isConnected = true;
  });

  mongoose.connection.on('error', err => {
    isConnected = false;
    console.error('MongoDB connection error', err);
  });

  await mongoose.connect(uri, {
    maxPoolSize: 5
  });

  isConnected = true;
  return mongoose;
}
