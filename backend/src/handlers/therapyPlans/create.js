import TherapyPlan from '../../models/TherapyPlan.js';
import Member from '../../models/Member.js';
import User from '../../models/User.js';
import { parseBody } from '../../libs/event.js';
import { withAuth } from '../../libs/handler.js';
import { therapyPlanSchema } from '../../utils/validators.js';
import { validate } from '../../utils/validate.js';
import { badRequest, created, notFound, ok } from '../../libs/response.js';

export const handler = withAuth(async (event) => {
  const payload = parseBody(event);
  const { value, error } = validate(therapyPlanSchema, payload);

  if (error) {
    return badRequest('Validation failed', error);
  }

  const member = await Member.findById(value.memberId);
  if (!member) {
    return notFound('Member not found');
  }

  const physio = await User.findById(value.physioId);
  if (!physio || physio.role !== 'physio') {
    return badRequest('Physiotherapist not found');
  }

  const existing = await TherapyPlan.findOne({ memberId: member._id });

  if (existing) {
    existing.title = value.title || existing.title;
    existing.notes = value.notes || existing.notes;
    existing.physioId = physio._id;
    existing.exercises = value.exercises;
    await existing.save();
    return ok({ plan: existing });
  }

  const plan = await TherapyPlan.create({
    memberId: member._id,
    physioId: physio._id,
    title: value.title,
    notes: value.notes,
    exercises: value.exercises
  });

  return created({ plan });
}, { roles: ['admin', 'physio'] });
