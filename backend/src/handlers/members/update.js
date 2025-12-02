import Member from '../../models/Member.js';
import User from '../../models/User.js';
import { parseBody } from '../../libs/event.js';
import { withAuth } from '../../libs/handler.js';
import { badRequest, notFound, ok } from '../../libs/response.js';

export const handler = withAuth(async (event) => {
  const { id } = event.pathParameters || {};

  if (!id) {
    return badRequest('Member id is required');
  }

  const payload = parseBody(event);
  const member = await Member.findById(id);

  if (!member) {
    return notFound('Member not found');
  }

  if (payload.membershipType) member.membershipType = payload.membershipType;
  if (payload.assignedTrainer !== undefined) member.assignedTrainer = payload.assignedTrainer || null;
  if (payload.assignedPhysio !== undefined) member.assignedPhysio = payload.assignedPhysio || null;
  if (payload.medicalConditions) member.medicalConditions = payload.medicalConditions;
  if (payload.startDate) member.startDate = payload.startDate;
  if (payload.renewalDate) member.renewalDate = payload.renewalDate;
  if (payload.notes !== undefined) member.notes = payload.notes;
  if (payload.status) member.status = payload.status;

  await member.save();

  if (payload.name || payload.email || payload.phone) {
    const user = await User.findById(member.userId);

    if (!user) {
      return notFound('Linked user not found');
    }

    if (payload.email && payload.email !== user.email) {
      const exists = await User.findOne({ email: payload.email });
      if (exists) {
        return badRequest('Email is already used');
      }
      user.email = payload.email;
    }

    if (payload.name) user.name = payload.name;
    if (payload.phone !== undefined) user.phone = payload.phone;

    await user.save();
  }

  return ok({ member });
}, { roles: ['admin', 'trainer', 'physio'] });
