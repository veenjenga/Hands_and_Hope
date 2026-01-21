import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// ✅ Import all routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Route mounting
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/activities", activityRoutes);

// Health check routes
app.get("/", (req, res) => {
  res.json({ 
    message: "Hands and Hope Backend is running!",
    timestamp: new Date(),
    status: "OK"
  });
});

app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    service: "Hands and Hope API",
    timestamp: new Date()
  });
});

// ✅ MongoDB connection and server start
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});