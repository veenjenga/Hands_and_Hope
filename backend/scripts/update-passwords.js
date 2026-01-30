import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const updatePasswords = async () => {
  try {
    await mongoose.connect('mongodb+srv://infohandsandhope_db_user:8saIR3k5SPCBbomx@admin.z5ogps9.mongodb.net/?appName=admin');
    
    // Update super admin
    const superAdminHash = await bcrypt.hash('SuperAdmin@2024', 12);
    await mongoose.connection.db.collection('users').updateOne(
      { email: 'superadmin@handsandhope.com' },
      { $set: { password: superAdminHash } }
    );
    console.log('✅ Super admin password updated');
    
    // Update admin
    const adminHash = await bcrypt.hash('Admin@2024', 12);
    await mongoose.connection.db.collection('users').updateOne(
      { email: 'admin@handsandhope.com' },
      { $set: { password: adminHash } }
    );
    console.log('✅ Admin password updated');
    
    // Verify
    const superUser = await mongoose.connection.db.collection('users').findOne({ email: 'superadmin@handsandhope.com' });
    const isAdminMatch = await bcrypt.compare('SuperAdmin@2024', superUser.password);
    console.log('Super admin verification:', isAdminMatch);
    
    const adminUser = await mongoose.connection.db.collection('users').findOne({ email: 'admin@handsandhope.com' });
    const isAdmin2Match = await bcrypt.compare('Admin@2024', adminUser.password);
    console.log('Admin verification:', isAdmin2Match);
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
};

updatePasswords();