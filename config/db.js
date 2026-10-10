import mongoose from "mongoose";

export const connectDB = async () => {
    const mongodbURI = process.env.MONGO_URI;

    if (!mongodbURI) {
        throw new Error("MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(mongodbURI);
    console.log('✅ Connected to MongoDB');
};