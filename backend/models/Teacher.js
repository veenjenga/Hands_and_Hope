import mongoose from 'mongoose';

const TeacherSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  school: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
  subject: String,
  staffId: String,
  documents: [],
}, { timestamps: true });

const Teacher = mongoose.model('Teacher', TeacherSchema);
export default Teacher;
