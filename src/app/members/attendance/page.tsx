"use client";

import { AppTable } from '@/components/tables/AppTable';
import { AppCard } from '@/components/common/AppCard';
import { Stack, Typography } from '@mui/material';

const attendanceRows = [
  { id: '1', date: '2025-11-25', checkIn: '07:05', checkOut: '08:30', location: 'Main Gym' },
  { id: '2', date: '2025-11-26', checkIn: '18:45', checkOut: '20:00', location: 'Cardio Zone' }
];

export default function MemberAttendancePage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={700}>
        Member Attendance Overview
      </Typography>
      <AppCard>
        <AppTable
          columns={[
            { field: 'date', headerName: 'Date', width: 140 },
            { field: 'checkIn', headerName: 'Check-In', width: 120 },
            { field: 'checkOut', headerName: 'Check-Out', width: 120 },
            { field: 'location', headerName: 'Location', flex: 1 }
          ]}
          rows={attendanceRows}
        />
      </AppCard>
    </Stack>
  );
}
