import Appointment from '../../models/Appointment.js';
import Member from '../../models/Member.js';
import User from '../../models/User.js';
import { parseBody } from '../../libs/event.js';
import { withAuth } from '../../libs/handler.js';
import { appointmentSchema } from '../../utils/validators.js';
import { validate } from '../../utils/validate.js';
import { badRequest, created, notFound } from '../../libs/response.js';

export const handler = withAuth(async (event) => {
  const payload = parseBody(event);
  const { value, error } = validate(appointmentSchema, payload);

  if (error) {
    return badRequest('Validation failed', error);
  }

  const member = await Member.findById(value.memberId);
  if (!member) {
    return notFound('Member not found');
  }

  const staff = await User.findById(value.staffId);
  if (!staff || staff.role !== value.staffRole) {
    return badRequest('Staff member not found for provided role');
  }

  const appointment = await Appointment.create({
    memberId: member._id,
    staffId: staff._id,
    staffRole: value.staffRole,
    start: value.start,
    end: value.end,
    notes: value.notes
  });

  return created({ appointment });
}, { roles: ['admin', 'trainer', 'physio'] });
