import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Add connection event listeners to monitor connection status
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
    
    await mongoose.connect(process.env.MONGO_URI);
    
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    console.log("⚠️ Server will continue running without database connection");
    // Don't exit the process, let the server continue running
  }
};

export default connectDB;
