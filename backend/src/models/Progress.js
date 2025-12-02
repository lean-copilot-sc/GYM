import mongoose from 'mongoose';

const ProgressSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['gym', 'physio'], required: true },
  metrics: {
    weight: Number,
    bodyFat: Number,
    measurements: Object,
    painScale: Number,
    mobility: Number,
    strengthScore: Number,
    notes: String
  },
  recordedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Progress || mongoose.model('Progress', ProgressSchema);
