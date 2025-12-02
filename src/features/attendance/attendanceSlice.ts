import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AttendanceRecord = {
  id: string;
  memberName: string;
  checkIn: string;
  checkOut?: string;
  location: string;
};

export type AttendanceState = {
  records: AttendanceRecord[];
};

const initialState: AttendanceState = {
  records: [
    {
      id: 'a-1',
      memberName: 'Rahul Sharma',
      checkIn: new Date().toISOString(),
      checkOut: undefined,
      location: 'Main Gym'
    }
  ]
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setAttendance(state: AttendanceState, action: PayloadAction<AttendanceRecord[]>) {
      state.records = action.payload;
    }
  }
});

export const { setAttendance } = attendanceSlice.actions;
export const attendanceReducer = attendanceSlice.reducer;
