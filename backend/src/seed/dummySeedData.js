import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from '../libs/db.js';
import User from '../models/User.js';
import Member from '../models/Member.js';
import Attendance from '../models/Attendance.js';
import WorkoutPlan from '../models/WorkoutPlan.js';
import TherapyPlan from '../models/TherapyPlan.js';
import Appointment from '../models/Appointment.js';
import Payment from '../models/Payment.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const TrainerProfile =
  mongoose.models.TrainerProfile ||
  mongoose.model(
    'TrainerProfile',
    new mongoose.Schema(
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        speciality: { type: String, required: true }
      },
      { timestamps: true }
    )
  );

const PhysiotherapistProfile =
  mongoose.models.PhysiotherapistProfile ||
  mongoose.model(
    'PhysiotherapistProfile',
    new mongoose.Schema(
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        expertise: { type: String, required: true }
      },
      { timestamps: true }
    )
  );

const memberSeed = [
  { name: 'Rahul Sharma', email: 'rahul@example.com', membershipType: 'Gold', conditions: ['Back Pain'] },
  { name: 'Priya Patel', email: 'priya@example.com', membershipType: 'Silver', conditions: ['Knee Pain'] },
  { name: 'Arjun Mehta', email: 'arjun@example.com', membershipType: 'Basic', conditions: ['Back Pain'] },
  { name: 'Neha Desai', email: 'neha@example.com', membershipType: 'Gold', conditions: ['Knee Pain'] },
  { name: 'Karan Joshi', email: 'karan@example.com', membershipType: 'Silver', conditions: ['Back Pain'] }
];

const trainerSeed = [
  { name: 'Rohit Kapadia', email: 'rohit.kapadia@example.com', phone: '+91-900000001', speciality: 'Strength Training' },
  { name: 'Amit Solanki', email: 'amit.solanki@example.com', phone: '+91-900000002', speciality: 'Weight Management' },
  { name: 'Sneha Vyas', email: 'sneha.vyas@example.com', phone: '+91-900000003', speciality: 'Functional Fitness' }
];

const physioSeed = [
  { name: 'Dr. Riya Shah', email: 'riya.shah@example.com', phone: '+91-910000001', expertise: 'Sports Injury' },
  { name: 'Dr. Manan Patel', email: 'manan.patel@example.com', phone: '+91-910000002', expertise: 'Post-Surgery Rehab' },
  { name: 'Dr. Khushi Mehta', email: 'khushi.mehta@example.com', phone: '+91-910000003', expertise: 'Spine Therapy' }
];

const workoutExercises = [
  { name: 'Bench Press', sets: 3, reps: 12, weight: 40, rest: 90, day: 'Monday' },
  { name: 'Squats', sets: 3, reps: 15, weight: 0, rest: 90, day: 'Wednesday' },
  { name: 'Lat Pulldown', sets: 3, reps: 12, weight: 25, rest: 75, day: 'Friday' }
];

const therapyExercises = [
  { name: 'Hamstring Stretch', painScale: 3, mobilityRange: 'Medium', instructions: 'Complete three slow reps', do: ['Hold 30 seconds'], dont: ['Overstretch'], day: 'Tuesday' },
  { name: 'Ankle Mobility', painScale: 2, mobilityRange: 'Low', instructions: 'Daily mobility routine', do: ['10 reps each side'], dont: ['Rush reps'], day: 'Thursday' },
  { name: 'Shoulder Circles', painScale: 2, mobilityRange: 'High', instructions: 'Gentle shoulder warm-up', do: ['Perform clockwise/anticlockwise'], dont: ['Use weights'], day: 'Saturday' }
];

const paymentAmounts = [500, 800, 1200];

const randomItem = (array) => array[Math.floor(Math.random() * array.length)];

export async function seedDummyData() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined. Please set it in backend/.env');
    }

    await connectDB(mongoUri);
    console.log('Connected to MongoDB');

    try {
      await Attendance.collection.dropIndexes();
    } catch (dropError) {
      if (dropError.codeName && dropError.codeName !== 'NamespaceNotFound') {
        console.warn('Could not drop attendance indexes:', dropError.message);
      }
    }

    await Promise.all([
      Attendance.deleteMany({}),
      WorkoutPlan.deleteMany({}),
      TherapyPlan.deleteMany({}),
      Appointment.deleteMany({}),
      Payment.deleteMany({}),
      Member.deleteMany({}),
      TrainerProfile.deleteMany({}),
      PhysiotherapistProfile.deleteMany({}),
      User.deleteMany({ role: { $in: ['member', 'trainer', 'physio'] } })
    ]);

    const hashedPassword = await bcrypt.hash('password123', 10);

    const trainerUsers = await User.insertMany(
      trainerSeed.map((trainer) => ({
        name: trainer.name,
        email: trainer.email,
        passwordHash: hashedPassword,
        role: 'trainer',
        phone: trainer.phone
      }))
    );

    await TrainerProfile.insertMany(
      trainerUsers.map((trainerDoc, idx) => ({
        userId: trainerDoc._id,
        speciality: trainerSeed[idx].speciality
      }))
    );
    console.log(`Inserted ${trainerUsers.length} trainers.`);

    const physioUsers = await User.insertMany(
      physioSeed.map((physio) => ({
        name: physio.name,
        email: physio.email,
        passwordHash: hashedPassword,
        role: 'physio',
        phone: physio.phone
      }))
    );

    await PhysiotherapistProfile.insertMany(
      physioUsers.map((physioDoc, idx) => ({
        userId: physioDoc._id,
        expertise: physioSeed[idx].expertise
      }))
    );
    console.log(`Inserted ${physioUsers.length} physiotherapists.`);

    const memberUserDocs = await User.insertMany(
      memberSeed.map((member) => ({
        name: member.name,
        email: member.email,
        passwordHash: hashedPassword,
        role: 'member'
      }))
    );
    console.log(`Inserted ${memberUserDocs.length} member users.`);

    const members = await Member.insertMany(
      memberUserDocs.map((userDoc, idx) => ({
        userId: userDoc._id,
        membershipType: memberSeed[idx].membershipType,
        assignedTrainer: randomItem(trainerUsers)._id,
        assignedPhysio: randomItem(physioUsers)._id,
        medicalConditions: memberSeed[idx].conditions,
        notes: 'Seeded dummy member profile'
      }))
    );
    console.log(`Inserted ${members.length} members.`);

    const now = new Date();
    const attendanceDocs = members.flatMap((memberDoc) => {
      const checkIn = new Date(now.getTime() - 60 * 60 * 1000);
      const checkOut = new Date(now.getTime() - 30 * 60 * 1000);
      return [
        { memberId: memberDoc._id, action: 'checkin', timestamp: checkIn, location: 'Main Facility' },
        { memberId: memberDoc._id, action: 'checkout', timestamp: checkOut, location: 'Main Facility' }
      ];
    });
    await Attendance.insertMany(attendanceDocs);
    console.log(`Inserted ${attendanceDocs.length} attendance records.`);

    const workoutPlans = await WorkoutPlan.insertMany(
      members.map((memberDoc) => ({
        memberId: memberDoc._id,
        trainerId: randomItem(trainerUsers)._id,
        title: 'Starter Workout Plan',
        notes: 'Initial plan generated by seeder',
        exercises: workoutExercises
      }))
    );
    console.log(`Inserted ${workoutPlans.length} workout plans.`);

    const therapyPlans = await TherapyPlan.insertMany(
      members.map((memberDoc) => ({
        memberId: memberDoc._id,
        physioId: randomItem(physioUsers)._id,
        title: 'Rehab Therapy Plan',
        notes: 'Daily therapy routine created by seeder',
        exercises: therapyExercises
      }))
    );
    console.log(`Inserted ${therapyPlans.length} therapy plans.`);

    const appointments = await Appointment.insertMany(
      members.map((memberDoc, idx) => {
        const isTrainerAppointment = idx % 2 === 0;
        const staff = isTrainerAppointment ? randomItem(trainerUsers) : randomItem(physioUsers);
        const staffRole = isTrainerAppointment ? 'trainer' : 'physio';
        const start = new Date(now.getTime() + (idx + 1) * 60 * 60 * 1000);
        const end = new Date(start.getTime() + 45 * 60 * 1000);
        return {
          memberId: memberDoc._id,
          staffId: staff._id,
          staffRole,
          start,
          end,
          notes: 'General evaluation'
        };
      })
    );
    console.log(`Inserted ${appointments.length} appointments.`);

    const payments = await Payment.insertMany(
      members.map((memberDoc) => ({
        memberId: memberDoc._id,
        amount: randomItem(paymentAmounts),
        currency: 'INR',
        invoiceUrl: 'https://example.com/invoice.pdf',
        description: 'Membership payment',
        dueDate: now,
        status: 'paid',
        method: 'online'
      }))
    );
    console.log(`Inserted ${payments.length} payments.`);

    console.log('Dummy data seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed dummy data:', error);
    process.exit(1);
  }
}

const executedFilePath = process.argv[1] ? path.resolve(process.argv[1]) : null;
const currentFilePath = fileURLToPath(import.meta.url);

if (executedFilePath && path.resolve(executedFilePath) === path.resolve(currentFilePath)) {
  seedDummyData();
}
