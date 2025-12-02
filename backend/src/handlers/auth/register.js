import bcrypt from 'bcryptjs';
import User from '../../models/User.js';
import Member from '../../models/Member.js';
import { parseBody } from '../../libs/event.js';
import { withDatabase } from '../../libs/handler.js';
import { registerSchema, memberSchema } from '../../utils/validators.js';
import { validate } from '../../utils/validate.js';
import { badRequest, created } from '../../libs/response.js';
import { signToken } from '../../libs/jwt.js';

export const handler = withDatabase(async (event) => {
  const payload = parseBody(event);
  const { value, error } = validate(registerSchema, payload);

  if (error) {
    return badRequest('Validation failed', error);
  }

  const exists = await User.findOne({ email: value.email });

  if (exists) {
    return badRequest('Email already registered');
  }

  const passwordHash = await bcrypt.hash(value.password, 10);

  const user = await User.create({
    name: value.name,
    email: value.email,
    passwordHash,
    role: value.role,
    phone: value.phone
  });

  let memberProfile = null;

  if (value.role === 'member') {
    const memberPayload = {
      name: value.name,
      email: value.email,
      membershipType: payload.membershipType || 'standard',
      assignedTrainer: payload.assignedTrainer,
      assignedPhysio: payload.assignedPhysio,
      medicalConditions: payload.medicalConditions,
      startDate: payload.startDate,
      renewalDate: payload.renewalDate,
      notes: payload.notes,
      password: value.password,
      userId: user._id
    };

    const { value: memberData, error: memberError } = validate(memberSchema, memberPayload);
    if (memberError) {
      return badRequest('Validation failed', memberError);
    }

    const member = await Member.create({
      ...memberData,
      userId: user._id
    });

    memberProfile = {
      id: member._id,
      membershipType: member.membershipType,
      status: member.status,
      assignedTrainer: member.assignedTrainer,
      assignedPhysio: member.assignedPhysio
    };
  }

  const token = signToken({
    sub: user._id.toString(),
    role: user.role,
    name: user.name
  });

  return created({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone
    },
    member: memberProfile
  });
});
