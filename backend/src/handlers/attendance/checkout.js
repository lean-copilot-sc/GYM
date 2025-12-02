import Attendance from '../../models/Attendance.js';
import Member from '../../models/Member.js';
import { parseBody } from '../../libs/event.js';
import { withAuth } from '../../libs/handler.js';
import { attendanceSchema } from '../../utils/validators.js';
import { validate } from '../../utils/validate.js';
import { badRequest, created, notFound } from '../../libs/response.js';

export const handler = withAuth(async (event) => {
  const payload = parseBody(event);
  const { value, error } = validate(attendanceSchema, payload);

  if (error) {
    return badRequest('Validation failed', error);
  }

  const member = await Member.findById(value.memberId);

  if (!member) {
    return notFound('Member not found');
  }

  if (event.user.role === 'member' && member.userId.toString() !== event.user.sub) {
    return badRequest('Members can only check themselves out');
  }

  const attendance = await Attendance.create({
    memberId: member._id,
    action: 'checkout',
    location: value.location
  });

  return created({ attendance });
});
