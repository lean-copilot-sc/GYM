import Member from '../../models/Member.js';
import Attendance from '../../models/Attendance.js';
import Progress from '../../models/Progress.js';
import Appointment from '../../models/Appointment.js';
import Payment from '../../models/Payment.js';
import { withAuth } from '../../libs/handler.js';
import { notFound, ok } from '../../libs/response.js';

export const handler = withAuth(async (event) => {
  const member = await Member.findOne({ userId: event.user.sub })
    .populate('assignedTrainer', 'name email')
    .populate('assignedPhysio', 'name email')
    .lean();

  if (!member) {
    return notFound('Member profile not found');
  }

  const [attendance, progress, appointments, payments] = await Promise.all([
    Attendance.find({ memberId: member._id }).sort({ timestamp: -1 }).limit(10).lean(),
    Progress.find({ memberId: member._id }).sort({ recordedAt: -1 }).limit(10).lean(),
    Appointment.find({ memberId: member._id, status: 'scheduled', start: { $gte: new Date() } })
      .sort({ start: 1 })
      .limit(10)
      .populate('staffId', 'name role')
      .lean(),
    Payment.find({ memberId: member._id, status: { $ne: 'paid' } })
      .sort({ dueDate: 1 })
      .lean()
  ]);

  return ok({
    member,
    attendance,
    progress,
    upcomingAppointments: appointments,
    outstandingPayments: payments
  });
}, { roles: ['member'] });
