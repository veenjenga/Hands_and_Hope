import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Withdrawal from '../models/Withdrawal.js';

dotenv.config();

const createTestWithdrawal = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hands-and-hope');
    console.log('Connected to MongoDB');

    const sellerEmail = process.argv[2] || 'seller@test.com';
    const amount = parseFloat(process.argv[3]) || 150.0;

    const seller = await User.findOne({ email: sellerEmail });
    if (!seller) {
      console.error('Seller not found with email:', sellerEmail);
      process.exit(1);
    }

    const withdrawal = await Withdrawal.create({
      sellerId: seller._id,
      amount,
      method: 'bank',
      bankName: 'KCB Bank',
      accountNumber: '1234567890',
      accountHolder: seller.name || 'Test Seller',
      status: 'pending',
      requestDate: new Date()
    });

    console.log('Created withdrawal:', withdrawal);
    process.exit(0);
  } catch (err) {
    console.error('Error creating withdrawal:', err);
    process.exit(1);
  }
};

createTestWithdrawal();
