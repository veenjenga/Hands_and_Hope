import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Checking Environment Configuration...\n');

// Check required environment variables
const requiredVars = ['MONGO_URI', 'JWT_SECRET', 'PORT'];
const missingVars = [];

requiredVars.forEach(varName => {
  if (!process.env[varName]) {
    missingVars.push(varName);
  }
});

if (missingVars.length > 0) {
  console.log('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.log(`   - ${varName}`));
  process.exit(1);
}

console.log('✅ All required environment variables present');
console.log(`📦 MONGO_URI: ${process.env.MONGO_URI.substring(0, 50)}...`);
console.log(`🔐 JWT_SECRET: ${process.env.JWT_SECRET ? '[SET]' : '[NOT SET]'}`);
console.log(`🚪 PORT: ${process.env.PORT || 5000}`);

// Test MongoDB connection
console.log('\n🔌 Testing MongoDB Connection...');
console.log('📝 Connection String:', process.env.MONGO_URI.split('@')[1]); // Hide username/password

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected successfully!');
  console.log('📊 Database name:', mongoose.connection.db.databaseName);
  mongoose.connection.close();
  process.exit(0);
});

mongoose.connection.on('error', (err) => {
  console.log('❌ MongoDB connection failed!');
  console.log('🔧 Troubleshooting steps:');
  console.log('   1. Check if your IP is whitelisted in MongoDB Atlas');
  console.log('   2. Verify the connection string is correct');
  console.log('   3. Ensure MongoDB Atlas cluster is running');
  console.log('   4. Check network connectivity');
  console.log('\n📋 Error details:', err.message);
  process.exit(1);
});

// Attempt connection with timeout
setTimeout(() => {
  console.log('⏰ Connection timeout - MongoDB not responding');
  process.exit(1);
}, 15000);

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
});