import mongoose from 'mongoose';
import 'dotenv/config';

export async function connectDB() {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/workers_db';
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri, { autoIndex: true });
    console.log('Conectado: mongo');
}
