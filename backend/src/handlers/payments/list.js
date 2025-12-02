import Payment from '../../models/Payment.js';
import Member from '../../models/Member.js';
import { withAuth } from '../../libs/handler.js';
import { badRequest, ok } from '../../libs/response.js';

export const handler = withAuth(async (event) => {
  const { memberId } = event.pathParameters || {};
  let targetMemberId = memberId;

  if (event.user.role === 'member') {
    const member = await Member.findOne({ userId: event.user.sub });
    if (!member) {
      return badRequest('Member profile not found');
    }
    targetMemberId = member._id.toString();
  }

  if (!targetMemberId) {
    return badRequest('Member id is required');
  }

  const payments = await Payment.find({ memberId: targetMemberId })
    .sort({ createdAt: -1 })
    .lean();

  return ok({ payments });
}, { roles: ['admin', 'trainer', 'physio', 'member'] });
