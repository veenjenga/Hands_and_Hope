import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: String,
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  quantity: { type: Number, default: 1 },
  buyerEmail: String,
  buyerName: String,
  shippingMethod: { type: String, enum: ['self', 'platform'], default: 'platform' },
  trackingNumber: String,
  rating: Number,
  feedback: String,
  refundStatus: { type: String, enum: ['none', 'requested', 'approved', 'rejected'], default: 'none' },
  refundReason: String,
}, { timestamps: true });

const Order = mongoose.model('Order', OrderSchema);
export default Order;
