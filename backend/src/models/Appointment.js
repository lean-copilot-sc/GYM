import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  staffRole: { type: String, enum: ['trainer', 'physio'], required: true },
  start: { type: Date, required: true },
  end: { type: Date },
  notes: String,
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' }
}, { timestamps: true });

export default mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);
