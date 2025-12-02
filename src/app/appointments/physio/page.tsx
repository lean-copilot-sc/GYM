"use client";

import { AppCard } from '@/components/common/AppCard';
import { AppTable } from '@/components/tables/AppTable';
import { Stack, Typography } from '@mui/material';

const physioAppointments = [
  { id: 'ph1', patient: 'Neha Desai', therapist: 'Dr. Riya Shah', time: '02:30 PM', status: 'Confirmed' },
  { id: 'ph2', patient: 'Arjun Mehta', therapist: 'Dr. Manan Patel', time: '04:00 PM', status: 'Pending' }
];

export default function PhysiotherapyAppointmentsPage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={700}>
        Physiotherapy Appointments
      </Typography>
      <AppCard>
        <AppTable
          columns={[
            { field: 'patient', headerName: 'Patient', flex: 1 },
            { field: 'therapist', headerName: 'Therapist', flex: 1 },
            { field: 'time', headerName: 'Time', width: 160 },
            { field: 'status', headerName: 'Status', width: 140 }
          ]}
          rows={physioAppointments}
        />
      </AppCard>
    </Stack>
  );
}
