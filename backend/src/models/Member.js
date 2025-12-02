import mongoose from 'mongoose';

const MemberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  membershipType: { type: String, default: 'standard' },
  assignedTrainer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedPhysio: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  medicalConditions: [String],
  startDate: { type: Date, default: Date.now },
  renewalDate: Date,
  notes: String,
  status: { type: String, enum: ['active', 'inactive', 'paused'], default: 'active' }
}, { timestamps: true });

export default mongoose.models.Member || mongoose.model('Member', MemberSchema);
