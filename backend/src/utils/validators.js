import Joi from '@hapi/joi';

export const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'trainer', 'physio', 'member').default('member'),
  phone: Joi.string().allow('', null)
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

export const memberSchema = Joi.object({
  userId: Joi.string().optional(),
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).optional(),
  membershipType: Joi.string().required(),
  assignedTrainer: Joi.string().allow(null, ''),
  assignedPhysio: Joi.string().allow(null, ''),
  medicalConditions: Joi.array().items(Joi.string()).default([]),
  startDate: Joi.date().optional(),
  renewalDate: Joi.date().optional(),
  notes: Joi.string().allow('', null)
});

export const attendanceSchema = Joi.object({
  memberId: Joi.string().required(),
  location: Joi.string().allow('', null)
});

export const workoutPlanSchema = Joi.object({
  memberId: Joi.string().required(),
  trainerId: Joi.string().required(),
  title: Joi.string().allow('', null),
  notes: Joi.string().allow('', null),
  exercises: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    sets: Joi.number().integer().min(0).allow(null),
    reps: Joi.number().integer().min(0).allow(null),
    weight: Joi.number().min(0).allow(null),
    rest: Joi.number().min(0).allow(null),
    day: Joi.string().required()
  })).min(1).required()
});

export const therapyPlanSchema = Joi.object({
  memberId: Joi.string().required(),
  physioId: Joi.string().required(),
  title: Joi.string().allow('', null),
  notes: Joi.string().allow('', null),
  exercises: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    painScale: Joi.number().min(0).max(10).allow(null),
    mobilityRange: Joi.string().allow('', null),
    instructions: Joi.string().allow('', null),
    do: Joi.array().items(Joi.string()).default([]),
    dont: Joi.array().items(Joi.string()).default([]),
    day: Joi.string().required()
  })).min(1).required()
});

export const appointmentSchema = Joi.object({
  memberId: Joi.string().required(),
  staffId: Joi.string().required(),
  staffRole: Joi.string().valid('trainer', 'physio').required(),
  start: Joi.date().required(),
  end: Joi.date().optional(),
  notes: Joi.string().allow('', null)
});

export const paymentSchema = Joi.object({
  memberId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  currency: Joi.string().default('USD'),
  invoiceUrl: Joi.string().uri().allow('', null),
  description: Joi.string().allow('', null),
  dueDate: Joi.date().optional(),
  status: Joi.string().valid('paid', 'pending', 'overdue').default('paid'),
  method: Joi.string().valid('card', 'cash', 'bank', 'online').default('card')
});

export const progressSchema = Joi.object({
  memberId: Joi.string().required(),
  type: Joi.string().valid('gym', 'physio').required(),
  metrics: Joi.object({
    weight: Joi.number().allow(null),
    bodyFat: Joi.number().allow(null),
    measurements: Joi.object().unknown(true).allow(null),
    painScale: Joi.number().min(0).max(10).allow(null),
    mobility: Joi.number().min(0).max(10).allow(null),
    strengthScore: Joi.number().allow(null),
    notes: Joi.string().allow('', null)
  }).required()
});
