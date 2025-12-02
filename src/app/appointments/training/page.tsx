"use client";

import { AppCard } from '@/components/common/AppCard';
import { AppTable } from '@/components/tables/AppTable';
import { Stack, Typography } from '@mui/material';

const trainingAppointments = [
  { id: 't1', member: 'Rahul Sharma', trainer: 'Rohit Kapadia', time: '09:30 AM', status: 'Confirmed' },
  { id: 't2', member: 'Priya Patel', trainer: 'Sneha Vyas', time: '11:00 AM', status: 'Pending' }
];

export default function TrainingAppointmentsPage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={700}>
        Training Appointments
      </Typography>
      <AppCard>
        <AppTable
          columns={[
            { field: 'member', headerName: 'Member', flex: 1 },
            { field: 'trainer', headerName: 'Trainer', flex: 1 },
            { field: 'time', headerName: 'Time', width: 160 },
            { field: 'status', headerName: 'Status', width: 140 }
          ]}
          rows={trainingAppointments}
        />
      </AppCard>
    </Stack>
  );
}
