import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// ✅ Import all routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import buyerRoutes from "./routes/buyerRoutes.js";   // ✅ Added buyer routes

dotenv.config();

const app = express();

// ✅ Middleware
// Allow an optional CLIENT_URL in .env for CORS origin restriction
const corsOptions = {
  origin: process.env.CLIENT_URL || true,
};
app.use(cors(corsOptions));
app.use(express.json());

// ✅ Route mounting
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/buyers", buyerRoutes);   // ✅ Added this line

// Connect to MongoDB and start server
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
}).catch(err => {
  console.error("❌ Failed to start server:", err);
});
