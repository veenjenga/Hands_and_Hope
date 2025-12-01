import mongoose from 'mongoose';

const SchoolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  registrationNumber: String,
  address: String,
  contactEmail: String,
  contactPhone: String,
  approved: { type: Boolean, default: false },
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

const School = mongoose.model('School', SchoolSchema);
export default School;
