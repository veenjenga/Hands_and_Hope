import mongoose from "mongoose";

const connectDB = async (attempt = 1, maxAttempts = 3) => {
  const connectionOptions = {
    serverSelectionTimeoutMS: 8000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10
  };

  try {
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

    // Try connections in order of preference
    const connectionMethods = [
      { name: 'API Key', uri: process.env.MONGO_URI_API_KEY },
      { name: 'Standard', uri: process.env.MONGO_URI },
      { name: 'Standard Backup', uri: process.env.MONGO_URI_STANDARD }
    ];

    for (const method of connectionMethods) {
      if (method.uri) {
        console.log(`🔄 Attempting ${method.name} connection (attempt ${attempt}/${maxAttempts})`);
        try {
          await mongoose.connect(method.uri, connectionOptions);
          console.log(`✅ Connected using ${method.name} authentication`);
          return;
        } catch (error) {
          console.log(`⚠️ ${method.name} connection failed:`, error.message);
          continue;
        }
      }
    }

    throw new Error('All connection methods failed');
    
  } catch (error) {
    console.error(`❌ MongoDB connection attempt ${attempt} failed:`, error.message);
    
    if (attempt < maxAttempts) {
      console.log(`⏳ Retrying in 2 seconds... (attempt ${attempt + 1}/${maxAttempts})`);
      setTimeout(() => {
        connectDB(attempt + 1, maxAttempts);
      }, 2000);
    } else {
      console.log("⚠️ Server will continue running without database connection");
      console.log("🔧 To fix: Check MongoDB Atlas API keys or IP whitelist");
    }
  }
};

export default connectDB;
