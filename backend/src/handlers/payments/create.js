import Payment from '../../models/Payment.js';
import Member from '../../models/Member.js';
import { parseBody } from '../../libs/event.js';
import { withAuth } from '../../libs/handler.js';
import { paymentSchema } from '../../utils/validators.js';
import { validate } from '../../utils/validate.js';
import { badRequest, created, notFound } from '../../libs/response.js';

export const handler = withAuth(async (event) => {
  const payload = parseBody(event);
  const { value, error } = validate(paymentSchema, payload);

  if (error) {
    return badRequest('Validation failed', error);
  }

  const member = await Member.findById(value.memberId);
  if (!member) {
    return notFound('Member not found');
  }

  const payment = await Payment.create({
    memberId: member._id,
    amount: value.amount,
    currency: value.currency,
    invoiceUrl: value.invoiceUrl,
    description: value.description,
    dueDate: value.dueDate,
    status: value.status,
    method: value.method
  });

  return created({ payment });
}, { roles: ['admin'] });
