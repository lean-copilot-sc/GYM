import Progress from '../../models/Progress.js';
import Member from '../../models/Member.js';
import { withAuth } from '../../libs/handler.js';
import { badRequest, notFound, ok } from '../../libs/response.js';

export const handler = withAuth(async (event) => {
  const { memberId } = event.pathParameters || {};
  const query = event.queryStringParameters || {};
  let targetId = memberId;

  if (!targetId && event.user.role === 'member') {
    const member = await Member.findOne({ userId: event.user.sub });
    if (!member) {
      return notFound('Member profile not found');
    }
    targetId = member._id.toString();
  }

  if (!targetId) {
    return badRequest('Member id is required');
  }

  const member = await Member.findById(targetId);
  if (!member) {
    return notFound('Member not found');
  }

  if (event.user.role === 'member' && member.userId.toString() !== event.user.sub) {
    return badRequest('Members can only view their own records');
  }

  if (event.user.role === 'trainer' && member.assignedTrainer?.toString() !== event.user.sub) {
    return badRequest('Trainer not assigned to this member');
  }

  if (event.user.role === 'physio' && member.assignedPhysio?.toString() !== event.user.sub) {
    return badRequest('Physio not assigned to this member');
  }

  const filter = { memberId: member._id };
  if (query.type) {
    filter.type = query.type;
  }

  const records = await Progress.find(filter)
    .sort({ recordedAt: -1 })
    .lean();

  return ok({ records });
}, { roles: ['admin', 'trainer', 'physio', 'member'] });
