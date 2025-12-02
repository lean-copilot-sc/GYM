import Member from '../../models/Member.js';
import Appointment from '../../models/Appointment.js';
import Progress from '../../models/Progress.js';
import { withAuth } from '../../libs/handler.js';
import { ok } from '../../libs/response.js';

export const handler = withAuth(async (event) => {
  const trainerId = event.user.sub;

  const [members, appointments, recentProgress] = await Promise.all([
    Member.find({ assignedTrainer: trainerId })
      .populate('userId', 'name email')
      .lean(),
    Appointment.find({
      staffId: trainerId,
      staffRole: 'trainer',
      status: 'scheduled',
      start: { $gte: new Date() }
    })
      .sort({ start: 1 })
      .limit(10)
      .populate('memberId', 'userId')
      .lean(),
    Progress.find({ recordedBy: trainerId, type: 'gym' })
      .sort({ recordedAt: -1 })
      .limit(10)
      .lean()
  ]);

  return ok({
    members,
    upcomingAppointments: appointments,
    recentProgress
  });
}, { roles: ['trainer'] });
