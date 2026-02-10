import mongoose from 'mongoose';

const RefundSchema = new mongoose.Schema({
  orderId: { type: String },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName: String,
  buyerName: String,
  buyerEmail: String,
  amount: { type: Number, default: 0 },
  reason: String,
  date: Date,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

const Refund = mongoose.model('Refund', RefundSchema);
export default Refund;
