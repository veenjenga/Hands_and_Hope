import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// ✅ Import all routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import buyerRoutes from "./routes/buyerRoutes.js";   // ✅ Added buyer routes
import profileRoutes from "./routes/profileRoutes.js"; // ✅ Added profile routes
import activityRoutes from "./routes/activityRoutes.js"; // ✅ Added activity routes

dotenv.config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Route mounting
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/buyers", buyerRoutes);   // ✅ Added this line
app.use("/api", profileRoutes); // ✅ Added profile routes
app.use("/api/activity", activityRoutes); // ✅ Added activity routes

// ✅ MongoDB connection and server start
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
})
.catch(err => console.error("❌ MongoDB connection error:", err));