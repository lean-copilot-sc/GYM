import WorkoutPlan from '../../models/WorkoutPlan.js';
import Member from '../../models/Member.js';
import User from '../../models/User.js';
import { withAuth } from '../../libs/handler.js';
import { badRequest, notFound, ok } from '../../libs/response.js';

export const handler = withAuth(async (event) => {
  const { memberId } = event.pathParameters || {};

  if (!memberId) {
    return badRequest('Member id is required');
  }

  const member = await Member.findById(memberId);
  if (!member) {
    return notFound('Member not found');
  }

  if (event.user.role === 'member' && member.userId.toString() !== event.user.sub) {
    return badRequest('Members can only view their own plans');
  }

  if (event.user.role === 'trainer' && member.assignedTrainer?.toString() !== event.user.sub) {
    return badRequest('Trainer not assigned to this member');
  }

  const plan = await WorkoutPlan.findOne({ memberId: member._id })
    .populate({ path: 'trainerId', select: 'name email', model: User })
    .lean();

  if (!plan) {
    return notFound('Workout plan not found');
  }

  return ok({ plan });
}, { roles: ['admin', 'trainer', 'member'] });
