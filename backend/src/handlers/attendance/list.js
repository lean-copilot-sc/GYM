import Attendance from '../../models/Attendance.js';
import Member from '../../models/Member.js';
import { withAuth } from '../../libs/handler.js';
import { badRequest, notFound, ok } from '../../libs/response.js';

export const handler = withAuth(async (event) => {
  const { memberId } = event.pathParameters || {};
  let targetId = memberId;

  if (!targetId) {
    if (event.user.role === 'member') {
      const member = await Member.findOne({ userId: event.user.sub });
      if (!member) {
        return notFound('Member profile not found');
      }
      targetId = member._id.toString();
    } else {
      return badRequest('Member id is required');
    }
  }

  const member = await Member.findById(targetId);

  if (!member) {
    return notFound('Member not found');
  }

  if (event.user.role === 'member' && member.userId.toString() !== event.user.sub) {
    return badRequest('Members can only view their own attendance');
  }

  const records = await Attendance.find({ memberId: member._id }).sort({ timestamp: -1 }).lean();

  return ok({ records });
});
