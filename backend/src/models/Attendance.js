import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  action: { type: String, enum: ['checkin', 'checkout'], required: true },
  timestamp: { type: Date, default: Date.now },
  location: String
}, { timestamps: true });

export default mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);
