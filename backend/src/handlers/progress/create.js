import Progress from '../../models/Progress.js';
import Member from '../../models/Member.js';
import { parseBody } from '../../libs/event.js';
import { withAuth } from '../../libs/handler.js';
import { progressSchema } from '../../utils/validators.js';
import { validate } from '../../utils/validate.js';
import { badRequest, created, notFound } from '../../libs/response.js';

export const handler = withAuth(async (event) => {
  const payload = parseBody(event);
  const { value, error } = validate(progressSchema, payload);

  if (error) {
    return badRequest('Validation failed', error);
  }

  const member = await Member.findById(value.memberId);
  if (!member) {
    return notFound('Member not found');
  }

  if (event.user.role === 'member' && member.userId.toString() !== event.user.sub) {
    return badRequest('Members can only log their own progress');
  }

  if (event.user.role === 'trainer' && value.type === 'physio') {
    return badRequest('Trainers cannot log physiotherapy progress');
  }

  if (event.user.role === 'physio' && value.type === 'gym') {
    return badRequest('Physiotherapists cannot log gym progress');
  }

  const progress = await Progress.create({
    memberId: member._id,
    recordedBy: event.user.sub,
    type: value.type,
    metrics: value.metrics,
    recordedAt: payload.recordedAt || new Date()
  });

  return created({ progress });
}, { roles: ['admin', 'trainer', 'physio', 'member'] });
