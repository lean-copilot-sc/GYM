import bcrypt from 'bcryptjs';
import User from '../../models/User.js';
import Member from '../../models/Member.js';
import { parseBody } from '../../libs/event.js';
import { withDatabase } from '../../libs/handler.js';
import { loginSchema } from '../../utils/validators.js';
import { validate } from '../../utils/validate.js';
import { badRequest, ok, unauthorized } from '../../libs/response.js';
import { signToken } from '../../libs/jwt.js';

export const handler = withDatabase(async (event) => {
  const payload = parseBody(event);
  const { value, error } = validate(loginSchema, payload);

  if (error) {
    return badRequest('Validation failed', error);
  }

  const user = await User.findOne({ email: value.email });

  if (!user) {
    return unauthorized('Invalid credentials');
  }

  const isValid = await bcrypt.compare(value.password, user.passwordHash);

  if (!isValid) {
    return unauthorized('Invalid credentials');
  }

  const token = signToken({
    sub: user._id.toString(),
    role: user.role,
    name: user.name
  });

  let memberProfile = null;

  if (user.role === 'member') {
    const member = await Member.findOne({ userId: user._id })
      .select('_id membershipType assignedTrainer assignedPhysio status')
      .populate('assignedTrainer', 'name email')
      .populate('assignedPhysio', 'name email')
      .lean();

    if (member) {
      memberProfile = {
        id: member._id,
        membershipType: member.membershipType,
        status: member.status,
        assignedTrainer: member.assignedTrainer,
        assignedPhysio: member.assignedPhysio
      };
    }
  }

  return ok({
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
