import mongoose from 'mongoose';

const WithdrawalSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['bank', 'mobile'], default: 'bank' },
  bankName: { type: String },
  accountNumber: { type: String },
  accountHolder: { type: String },
  provider: { type: String },
  phoneNumber: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'completed', 'rejected'], default: 'pending' },
  requestDate: { type: Date, default: Date.now },
  approvalDate: { type: Date },
  completedDate: { type: Date }
});

const Withdrawal = mongoose.model('Withdrawal', WithdrawalSchema);
export default Withdrawal;
