import mongoose from 'mongoose';

const TherapyExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  painScale: Number,
  mobilityRange: String,
  instructions: String,
  do: [String],
  dont: [String],
  day: { type: String, required: true }
}, { _id: false });

const TherapyPlanSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  physioId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'Therapy Plan' },
  notes: String,
  exercises: [TherapyExerciseSchema]
}, { timestamps: true });

export default mongoose.models.TherapyPlan || mongoose.model('TherapyPlan', TherapyPlanSchema);
