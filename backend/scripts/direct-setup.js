import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const setupAdminAccounts = async () => {
  try {
    console.log('🚀 Setting up admin accounts...');
    
    // Try direct connection with explicit options
    const connectionOptions = {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      maxPoolSize: 5
    };

    // Try API key connection first
    console.log('🔄 Connecting with API key...');
    await mongoose.connect(process.env.MONGO_URI_API_KEY, connectionOptions);
    console.log('✅ Connected to MongoDB with API key!');
    
  } catch (apiError) {
    console.log('⚠️ API key connection failed, trying standard connection...');
    try {
      await mongoose.connect(process.env.MONGO_URI, connectionOptions);
      console.log('✅ Connected with standard credentials!');
    } catch (stdError) {
      console.log('❌ Both connection methods failed');
      console.log('🔧 Manual setup required - please check MongoDB Atlas configuration');
      process.exit(1);
    }
  }

  try {
    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ role: 'super-admin' });
    if (existingSuperAdmin) {
      console.log('✅ Super admin already exists:', existingSuperAdmin.email);
    } else {
      // Create super admin account
      const superAdminPassword = 'SuperAdmin@2024';
      const hashedPassword = await bcrypt.hash(superAdminPassword, 12);

      const superAdmin = new User({
        name: 'Super Administrator',
        email: 'superadmin@handsandhope.com',
        password: hashedPassword,
        role: 'super-admin',
        active: true
      });

      await superAdmin.save();
      console.log('✅ Super admin created successfully!');
      console.log('📧 Email:', superAdmin.email);
      console.log('🔑 Password:', superAdminPassword);
    }

    // Check if regular admin exists
    const existingAdmin = await User.findOne({ role: 'admin', email: 'admin@handsandhope.com' });
    if (existingAdmin) {
      console.log('✅ Admin already exists:', existingAdmin.email);
    } else {
      // Create sample admin account
      const adminPassword = 'Admin@2024';
      const hashedAdminPassword = await bcrypt.hash(adminPassword, 12);

      const admin = new User({
        name: 'Administrator',
        email: 'admin@handsandhope.com',
        password: hashedAdminPassword,
        role: 'admin',
        active: true
      });

      await admin.save();
      console.log('✅ Sample admin created successfully!');
      console.log('📧 Email:', admin.email);
      console.log('🔑 Password:', adminPassword);
    }

    console.log('\n🎉 Admin setup complete!');
    console.log('➡️  You can now login to the admin dashboard');

  } catch (error) {
    console.error('❌ Error setting up admin accounts:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔒 Database connection closed');
    process.exit(0);
  }
};

setupAdminAccounts();