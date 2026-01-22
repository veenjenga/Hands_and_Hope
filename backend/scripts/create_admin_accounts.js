import mongoose from 'mongoose';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hands-and-hope';

const createAdminAccounts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Admin account
    const adminEmail = 'admin@handsandhope.com';
    const adminPassword = 'Admin@2024';

    // Super Admin account
    const superAdminEmail = 'superadmin@handsandhope.com';
    const superAdminPassword = 'SuperAdmin@2024';

    // Check if admin already exists
    let adminUser = await User.findOne({ email: adminEmail });
    if (adminUser) {
      console.log('⚠️  Admin account already exists. Updating password...');
      adminUser.password = adminPassword;
      await adminUser.save();
      console.log('✅ Admin account password updated');
    } else {
      adminUser = new User({
        name: 'Admin User',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        phone: '+1234567890',
        active: true,
      });
      await adminUser.save();
      console.log('✅ Admin account created:', adminEmail);
    }

    // Check if super-admin already exists
    let superAdminUser = await User.findOne({ email: superAdminEmail });
    if (superAdminUser) {
      console.log('⚠️  Super Admin account already exists. Updating password...');
      superAdminUser.password = superAdminPassword;
      await superAdminUser.save();
      console.log('✅ Super Admin account password updated');
    } else {
      superAdminUser = new User({
        name: 'Super Admin User',
        email: superAdminEmail,
        password: superAdminPassword,
        role: 'super-admin',
        phone: '+0987654321',
        active: true,
      });
      await superAdminUser.save();
      console.log('✅ Super Admin account created:', superAdminEmail);
    }

    console.log('\n📋 Demo Credentials:');
    console.log('Admin:');
    console.log(`  Email: ${adminEmail}`);
    console.log(`  Password: ${adminPassword}`);
    console.log('\nSuper Admin:');
    console.log(`  Email: ${superAdminEmail}`);
    console.log(`  Password: ${superAdminPassword}`);

    await mongoose.connection.close();
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createAdminAccounts();
