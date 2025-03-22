import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const MongoURI = process.env.MongoURI!;

export default async() => {
    try {
        await mongoose.connect(MongoURI);
        console.log('DB Connected...');
    }   
    catch (error) {
        console.log('DB Error :', error);
    }
}