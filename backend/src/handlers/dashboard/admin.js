import Member from '../../models/Member.js';
import User from '../../models/User.js';
import Payment from '../../models/Payment.js';
import Attendance from '../../models/Attendance.js';
import { withAuth } from '../../libs/handler.js';
import { ok } from '../../libs/response.js';

export const handler = withAuth(async () => {
  const [memberCount, trainerCount, physioCount, activeMembers, revenueStats, attendanceStats] = await Promise.all([
    Member.countDocuments(),
    User.countDocuments({ role: 'trainer' }),
    User.countDocuments({ role: 'physio' }),
    Member.countDocuments({ status: 'active' }),
    Payment.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]),
    Attendance.aggregate([
      {
        $group: {
          _id: '$action',
          total: { $sum: 1 }
        }
      }
    ])
  ]);

  const upcomingRenewals = await Member.find({
    renewalDate: { $gte: new Date(), $lte: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) }
  }).select('renewalDate userId').populate('userId', 'name email').lean();

  return ok({
    stats: {
      totalMembers: memberCount,
      activeMembers,
      totalTrainers: trainerCount,
      totalPhysios: physioCount
    },
    revenue: revenueStats,
    attendance: attendanceStats,
    upcomingRenewals
  });
}, { roles: ['admin'] });
