import mongoose from 'mongoose';

const AssistanceRequestSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['pending', 'received', 'resolved'], default: 'pending' },
}, { timestamps: true });

const AssistanceRequest = mongoose.model('AssistanceRequest', AssistanceRequestSchema);
export default AssistanceRequest;
