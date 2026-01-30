import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('=== Advanced MongoDB Connection Test ===\n');

const testAdvancedConnection = async () => {
  // Test raw DNS resolution first
  try {
    const dns = await import('dns/promises');
    console.log('🔍 Testing DNS resolution...');
    const addresses = await dns.resolve('admin.z5ogps9.mongodb.net');
    console.log('✅ DNS resolved:', addresses);
  } catch (dnsError) {
    console.log('❌ DNS resolution failed:', dnsError.message);
    return false;
  }

  // Test connection with maximum debugging
  const connectionUri = process.env.MONGO_URI;
  console.log('\n🔗 Testing connection URI:');
  console.log(`Host: ${connectionUri.split('@')[1].split('/')[0]}`);
  console.log(`Database: ${connectionUri.split('/').pop()?.split('?')[0] || 'default'}`);

  const connectionOptions = {
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 30000,
    maxPoolSize: 1,
    directConnection: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  };

  try {
    console.log('\n🔄 Attempting connection with full debugging...');
    
    // Add detailed event listeners
    mongoose.connection.on('connecting', () => console.log('📡 Connecting to MongoDB...'));
    mongoose.connection.on('connected', () => console.log('✅ Connected to MongoDB!'));
    mongoose.connection.on('disconnected', () => console.log('⚠️ Disconnected from MongoDB'));
    mongoose.connection.on('error', (err) => console.log('❌ Connection error:', err.message));

    await mongoose.connect(connectionUri, connectionOptions);
    
    console.log('🎉 SUCCESS: Database connection established!');
    console.log(`📊 Database name: ${mongoose.connection.db.databaseName}`);
    
    // Test basic operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📁 Available collections: ${collections.length}`);
    
    await mongoose.connection.close();
    console.log('🔒 Connection closed successfully');
    return true;
    
  } catch (error) {
    console.log('\n💥 CONNECTION FAILED');
    console.log('Error details:', error);
    console.log('\nTroubleshooting checklist:');
    console.log('1. ✅ Database user has Atlas Admin role');
    console.log('2. ✅ IP is whitelisted in Atlas Network Access');
    console.log('3. ❓ Cluster status: Check if running (not paused)');
    console.log('4. ❓ Correct database name in connection string');
    console.log('5. ❓ No firewall blocking outbound connections');
    return false;
  }
};

testAdvancedConnection().then(success => {
  process.exit(success ? 0 : 1);
});