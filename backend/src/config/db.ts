import mongoose from "mongoose";
import { env } from "./env";

// Opens the MongoDB connection using MONGO_URI
export const connectDB = async (): Promise<void> => {
  await mongoose.connect(env.mongoUri);
  console.log("MongoDB connected");
};
