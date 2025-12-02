"use client";

import { AppCard } from '@/components/common/AppCard';
import { AppTable } from '@/components/tables/AppTable';
import { Stack, Typography } from '@mui/material';

const physioAttendance = [
  { id: 'p1', patient: 'Neha Desai', therapist: 'Dr. Riya Shah', status: 'Completed', time: '11:00' },
  { id: 'p2', patient: 'Arjun Mehta', therapist: 'Dr. Manan Patel', status: 'Scheduled', time: '13:00' }
];

export default function PhysioAttendancePage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={700}>
        Physiotherapy Attendance
      </Typography>
      <AppCard>
        <AppTable
          columns={[
            { field: 'patient', headerName: 'Patient', flex: 1 },
            { field: 'therapist', headerName: 'Therapist', flex: 1 },
            { field: 'time', headerName: 'Time', width: 140 },
            { field: 'status', headerName: 'Status', width: 140 }
          ]}
          rows={physioAttendance}
        />
      </AppCard>
    </Stack>
  );
}
