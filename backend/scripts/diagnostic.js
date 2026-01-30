import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('=== MongoDB Connection Diagnostic ===\n');

// Test each connection method individually
const testConnections = async () => {
  const configs = [
    {
      name: 'API Key Method',
      uri: process.env.MONGO_URI_API_KEY
    },
    {
      name: 'Standard Method', 
      uri: process.env.MONGO_URI
    },
    {
      name: 'Standard Backup',
      uri: process.env.MONGO_URI_STANDARD
    }
  ];

  for (const config of configs) {
    if (!config.uri) {
      console.log(`${config.name}: ❌ No URI configured`);
      continue;
    }

    console.log(`\n--- Testing ${config.name} ---`);
    console.log(`URI: ${config.uri.substring(0, 60)}...`);

    try {
      await mongoose.connect(config.uri, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 30000
      });
      
      console.log('✅ CONNECTED SUCCESSFULLY!');
      console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
      
      // List collections to verify full access
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log(`📁 Collections found: ${collections.length}`);
      
      await mongoose.connection.close();
      console.log('🔒 Connection closed\n');
      return true; // Exit on first successful connection
      
    } catch (error) {
      console.log(`❌ FAILED: ${error.message}`);
      console.log(`🔧 Error code: ${error.code || 'N/A'}`);
    }
  }

  console.log('\n💥 All connection methods failed');
  console.log('\nPossible issues:');
  console.log('1. Incorrect credentials in connection strings');
  console.log('2. Cluster paused or stopped in Atlas');
  console.log('3. Network/firewall blocking connection');
  console.log('4. Database user permissions insufficient');
  console.log('5. Region mismatch between client and cluster');
  
  return false;
};

testConnections().then(success => {
  process.exit(success ? 0 : 1);
});