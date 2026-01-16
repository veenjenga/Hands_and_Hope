import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: String,
  buyerName: String,
  buyerEmail: String,
  message: String,
  status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
  replies: [
    {
      message: String,
      timestamp: { type: Date, default: Date.now },
      responder: { type: String, enum: ['seller', 'buyer'] }
    }
  ],
}, { timestamps: true });

const Inquiry = mongoose.model('Inquiry', InquirySchema);
export default Inquiry;
