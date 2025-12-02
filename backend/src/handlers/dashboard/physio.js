import Member from '../../models/Member.js';
import Appointment from '../../models/Appointment.js';
import Progress from '../../models/Progress.js';
import { withAuth } from '../../libs/handler.js';
import { ok } from '../../libs/response.js';

export const handler = withAuth(async (event) => {
  const physioId = event.user.sub;

  const [members, appointments, recentProgress] = await Promise.all([
    Member.find({ assignedPhysio: physioId })
      .populate('userId', 'name email')
      .lean(),
    Appointment.find({
      staffId: physioId,
      staffRole: 'physio',
      status: 'scheduled',
      start: { $gte: new Date() }
    })
      .sort({ start: 1 })
      .limit(10)
      .populate('memberId', 'userId')
      .lean(),
    Progress.find({ recordedBy: physioId, type: 'physio' })
      .sort({ recordedAt: -1 })
      .limit(10)
      .lean()
  ]);

  return ok({
    members,
    upcomingAppointments: appointments,
    recentProgress
  });
}, { roles: ['physio'] });
