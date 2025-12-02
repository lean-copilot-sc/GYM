import WorkoutPlan from '../../models/WorkoutPlan.js';
import Member from '../../models/Member.js';
import User from '../../models/User.js';
import { parseBody } from '../../libs/event.js';
import { withAuth } from '../../libs/handler.js';
import { workoutPlanSchema } from '../../utils/validators.js';
import { validate } from '../../utils/validate.js';
import { badRequest, created, notFound, ok } from '../../libs/response.js';

export const handler = withAuth(async (event) => {
  const payload = parseBody(event);
  const { value, error } = validate(workoutPlanSchema, payload);

  if (error) {
    return badRequest('Validation failed', error);
  }

  const member = await Member.findById(value.memberId);
  if (!member) {
    return notFound('Member not found');
  }

  const trainer = await User.findById(value.trainerId);
  if (!trainer || trainer.role !== 'trainer') {
    return badRequest('Trainer not found');
  }

  const existing = await WorkoutPlan.findOne({ memberId: member._id });

  if (existing) {
    existing.title = value.title || existing.title;
    existing.notes = value.notes || existing.notes;
    existing.trainerId = trainer._id;
    existing.exercises = value.exercises;
    await existing.save();
    return ok({ plan: existing });
  }

  const plan = await WorkoutPlan.create({
    memberId: member._id,
    trainerId: trainer._id,
    title: value.title,
    notes: value.notes,
    exercises: value.exercises
  });

  return created({ plan });
}, { roles: ['admin', 'trainer'] });
