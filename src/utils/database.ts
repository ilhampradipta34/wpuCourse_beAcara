import mongoose from "mongoose";
import { DATABASE_URL } from "./env";
import UserModel from "../models/userModel";

const db = async () => {
  try {
    await mongoose.connect(DATABASE_URL, {
      dbName: "db-acara",
    });
    console.log("✅ MongoDB connected");
    // 🔁 Sinkronisasi index (sekali saat konek)
    await UserModel.syncIndexes();
    console.log("✅ UserModel indexes synced");

    return Promise.resolve("Database connected");
  } catch (error) {
    return Promise.reject(error);
  }
};

export default db;
