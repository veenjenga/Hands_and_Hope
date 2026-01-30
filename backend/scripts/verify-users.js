import mongoose from 'mongoose';
import User from '../models/User.js';

const verifyUsers = async () => {
  try {
    await mongoose.connect('mongodb+srv://infohandsandhope_db_user:8saIR3k5SPCBbomx@admin.z5ogps9.mongodb.net/handsandhope?retryWrites=true&w=majority');
    
    const users = await User.find({ role: { $in: ['admin', 'super-admin'] } });
    console.log('Admin users found:', users.length);
    users.forEach(u => console.log('-', u.email, u.role));
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
};

verifyUsers();