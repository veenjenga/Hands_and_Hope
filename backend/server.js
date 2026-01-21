import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// ✅ Import models (ensures they're registered with Mongoose)
import User from "./models/User.js";
import Product from "./models/Product.js";
import Order from "./models/Order.js";
import Inquiry from "./models/Inquiry.js";
import Caregiver from "./models/Caregiver.js";
import Seller from "./models/Seller.js";
import Teacher from "./models/Teacher.js";
import Student from "./models/Student.js";
import School from "./models/School.js";

// ✅ Import all routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import buyerRoutes from "./routes/buyerRoutes.js";   // ✅ Added buyer routes
import uploadRoutes from "./routes/uploadRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();

// ✅ Middleware
// Allow an optional CLIENT_URL in .env for CORS origin restriction
const corsOptions = {
  origin: [
    process.env.CLIENT_URL,
    "http://localhost:3001",
    "http://localhost:3002",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:3002",
    "https://hands-and-hope.onrender.com",
    "https://sellers-awb5.onrender.com"
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// serve uploaded files
import path from 'path';
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ✅ Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Hands and Hope API Server', 
    status: 'Running',
    timestamp: new Date().toISOString()
  });
});

// ✅ Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ✅ Route mounting
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/buyers", buyerRoutes);   // ✅ Added this line
app.use('/api/uploads', uploadRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Connect to MongoDB and start server
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});