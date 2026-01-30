import mongoose from "mongoose";

const connectDB = async () => {
  const connectionOptions = {
    serverSelectionTimeoutMS: 8000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10
  };

  // Add connection event listeners
  mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB connected successfully');
  });
  
  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });
  
  mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB disconnected');
  });
  
  mongoose.connection.on('reconnected', () => {
    console.log('🔄 MongoDB reconnected');
  });

  try {
    // Use only the working connection method (Standard)
    console.log('🔄 Attempting Standard connection...');
    await mongoose.connect(process.env.MONGO_URI, connectionOptions);
    console.log('✅ Connected using Standard authentication');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log("⚠️ Server will continue running without database connection");
    console.log("🔧 Check MongoDB Atlas configuration");
  }
};

export default connectDB;
