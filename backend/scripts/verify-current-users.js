import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const verifyUsers = async () => {
  try {
    await mongoose.connect('mongodb+srv://infohandsandhope_db_user:8saIR3k5SPCBbomx@admin.z5ogps9.mongodb.net/handsandhope?retryWrites=true&w=majority');
    
    const users = await User.find({ 
      email: { $in: ['superadmin@handsandhope.com', 'admin@handsandhope.com'] } 
    });
    
    console.log('Users found:', users.length);
    
    for (const user of users) {
      console.log('-', user.email, user.role);
      
      if (user.email === 'superadmin@handsandhope.com') {
        const isMatch = await bcrypt.compare('SuperAdmin@2024', user.password);
        console.log('  SuperAdmin password match:', isMatch);
      }
      
      if (user.email === 'admin@handsandhope.com') {
        const isMatch = await bcrypt.compare('Admin@2024', user.password);
        console.log('  Admin password match:', isMatch);
      }
    }
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
};

verifyUsers();