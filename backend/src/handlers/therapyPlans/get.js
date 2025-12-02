import TherapyPlan from '../../models/TherapyPlan.js';
import Member from '../../models/Member.js';
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

  if (event.user.role === 'physio' && member.assignedPhysio?.toString() !== event.user.sub) {
    return badRequest('Physio not assigned to this member');
  }

  const plan = await TherapyPlan.findOne({ memberId: member._id })
    .populate('physioId', 'name email')
    .lean();

  if (!plan) {
    return notFound('Therapy plan not found');
  }

  return ok({ plan });
}, { roles: ['admin', 'physio', 'member'] });
