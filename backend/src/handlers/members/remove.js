import Member from '../../models/Member.js';
import { withAuth } from '../../libs/handler.js';
import { badRequest, notFound, ok } from '../../libs/response.js';

export const handler = withAuth(async (event) => {
  const { id } = event.pathParameters || {};

  if (!id) {
    return badRequest('Member id is required');
  }

  const member = await Member.findByIdAndDelete(id);

  if (!member) {
    return notFound('Member not found');
  }

  return ok({ message: 'Member removed' });
}, { roles: ['admin'] });
