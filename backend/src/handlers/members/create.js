import bcrypt from 'bcryptjs';
import Member from '../../models/Member.js';
import User from '../../models/User.js';
import { parseBody } from '../../libs/event.js';
import { withAuth } from '../../libs/handler.js';
import { memberSchema } from '../../utils/validators.js';
import { validate } from '../../utils/validate.js';
import { badRequest, created, notFound } from '../../libs/response.js';

export const handler = withAuth(async (event) => {
  const payload = parseBody(event);
  const { value, error } = validate(memberSchema, payload);

  if (error) {
    return badRequest('Validation failed', error);
  }

  let user;

  if (value.userId) {
    user = await User.findById(value.userId);

    if (!user) {
      return notFound('Linked user not found');
    }
  } else {
    const existingUser = await User.findOne({ email: value.email });

    if (existingUser) {
      return badRequest('A user with this email already exists');
    }

    if (!payload.password) {
      return badRequest('Password is required for new member accounts');
    }

    const passwordHash = await bcrypt.hash(payload.password, 10);

    user = await User.create({
      name: value.name,
      email: value.email,
      passwordHash,
      role: 'member'
    });
  }

  const member = await Member.create({
    userId: user._id,
    membershipType: value.membershipType,
    assignedTrainer: value.assignedTrainer || null,
    assignedPhysio: value.assignedPhysio || null,
    medicalConditions: value.medicalConditions,
    startDate: value.startDate,
    renewalDate: value.renewalDate,
    notes: value.notes,
    status: payload.status || 'active'
  });

  return created({ member });
}, { roles: ['admin', 'trainer', 'physio'] });
