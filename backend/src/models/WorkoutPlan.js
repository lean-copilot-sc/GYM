import mongoose from 'mongoose';

const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: Number,
  reps: Number,
  weight: Number,
  rest: Number,
  day: { type: String, required: true }
}, { _id: false });

const WorkoutPlanSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'Workout Plan' },
  notes: String,
  exercises: [ExerciseSchema]
}, { timestamps: true });

export default mongoose.models.WorkoutPlan || mongoose.model('WorkoutPlan', WorkoutPlanSchema);
