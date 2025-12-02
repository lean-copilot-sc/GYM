import { configureStore } from '@reduxjs/toolkit';
import { membersReducer } from '@/features/members/membersSlice';
import { physiotherapyReducer } from '@/features/physiotherapy/physiotherapySlice';
import { attendanceReducer } from '@/features/attendance/attendanceSlice';
import { paymentsReducer } from '@/features/payments/paymentsSlice';

export const store = configureStore({
  reducer: {
    members: membersReducer,
    physiotherapy: physiotherapyReducer,
    attendance: attendanceReducer,
    payments: paymentsReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
