"use client";

import { AppCard } from '@/components/common/AppCard';
import { AppTable } from '@/components/tables/AppTable';
import { Stack, Typography } from '@mui/material';

const gymAttendance = [
  { id: 'g1', member: 'Rahul Sharma', checkIn: '06:45', checkOut: '08:00', status: 'Completed' },
  { id: 'g2', member: 'Priya Patel', checkIn: '09:15', checkOut: '10:20', status: 'Completed' }
];

export default function GymAttendancePage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={700}>
        Gym Attendance
      </Typography>
      <AppCard>
        <AppTable
          columns={[
            { field: 'member', headerName: 'Member', flex: 1 },
            { field: 'checkIn', headerName: 'Check-In', width: 140 },
            { field: 'checkOut', headerName: 'Check-Out', width: 140 },
            { field: 'status', headerName: 'Status', width: 140 }
          ]}
          rows={gymAttendance}
        />
      </AppCard>
    </Stack>
  );
}
