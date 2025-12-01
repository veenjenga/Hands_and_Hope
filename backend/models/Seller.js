import mongoose from 'mongoose';

const SellerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  businessName: String,
  phone: String,
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  documents: [
    {
      url: String,
      filename: String,
      mimeType: String,
      size: Number,
      verified: { type: Boolean, default: false },
      uploadedAt: { type: Date, default: Date.now }
    }
  ],
}, { timestamps: true });

const Seller = mongoose.model('Seller', SellerSchema);
export default Seller;
