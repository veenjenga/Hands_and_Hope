import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const setupAdminAccounts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ role: 'super-admin' });
    if (existingSuperAdmin) {
      console.log('✅ Super admin already exists:', existingSuperAdmin.email);
      return;
    }

    // Create super admin account
    const superAdminPassword = 'SuperAdmin@2024'; // Change this in production
    const hashedPassword = await bcrypt.hash(superAdminPassword, 10);

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
    console.log('⚠️  Please change this password immediately after first login!');

    // Create sample admin account
    const adminPassword = 'Admin@2024';
    const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

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

    console.log('\n🎉 Admin setup complete!');
    console.log('You can now login to the admin dashboard with these credentials.');

  } catch (error) {
    console.error('❌ Error setting up admin accounts:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔒 Database connection closed');
  }
};

// Run the setup
setupAdminAccounts();