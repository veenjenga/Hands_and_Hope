import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  school: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
  studentId: String,
  disabilityId: String,
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

const Student = mongoose.model('Student', StudentSchema);
export default Student;
