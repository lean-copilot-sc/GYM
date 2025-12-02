import Member from '../../models/Member.js';
import User from '../../models/User.js';
import { withAuth } from '../../libs/handler.js';
import { ok } from '../../libs/response.js';

export const handler = withAuth(async (event) => {
  const filter = {};

  if (event.user.role === 'trainer') {
    filter.assignedTrainer = event.user.sub;
  }

  if (event.user.role === 'physio') {
    filter.assignedPhysio = event.user.sub;
  }

  const members = await Member.find(filter)
    .populate({ path: 'userId', select: 'name email role phone', model: User })
    .populate({ path: 'assignedTrainer', select: 'name email', model: User })
    .populate({ path: 'assignedPhysio', select: 'name email', model: User })
    .lean();

  return ok({ members });
}, { roles: ['admin', 'trainer', 'physio'] });
