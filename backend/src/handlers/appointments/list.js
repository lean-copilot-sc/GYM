import Appointment from '../../models/Appointment.js';
import Member from '../../models/Member.js';
import { withAuth } from '../../libs/handler.js';
import { badRequest, ok } from '../../libs/response.js';

export const handler = withAuth(async (event) => {
  const query = event.queryStringParameters || {};
  const filter = {};

  if (event.user.role === 'trainer' || event.user.role === 'physio') {
    filter.staffId = event.user.sub;
  }

  if (event.user.role === 'member') {
    const member = await Member.findOne({ userId: event.user.sub });
    if (!member) {
      return badRequest('Member profile not found');
    }
    filter.memberId = member._id;
  }

  if (query.memberId && event.user.role !== 'member') {
    filter.memberId = query.memberId;
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.date) {
    const day = new Date(query.date);
    if (!Number.isNaN(day.getTime())) {
      const start = new Date(day);
      start.setHours(0, 0, 0, 0);
      const end = new Date(day);
      end.setHours(23, 59, 59, 999);
      filter.start = { $gte: start, $lte: end };
    }
  }

  const appointments = await Appointment.find(filter)
    .sort({ start: 1 })
    .populate('memberId', 'membershipType userId')
    .populate('staffId', 'name email role')
    .lean();

  return ok({ appointments });
}, { roles: ['admin', 'trainer', 'physio', 'member'] });
