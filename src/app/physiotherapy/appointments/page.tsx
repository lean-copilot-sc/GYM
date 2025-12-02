"use client";

import { AppCard } from '@/components/common/AppCard';
import { Stack, Typography } from '@mui/material';

export default function PhysiotherapyAppointmentsPage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={700}>
        Physiotherapy Appointments
      </Typography>
      <AppCard title="Calendar">
        <Typography variant="body2" color="text.secondary">
          Integrate a calendar view here to manage physiotherapy appointment schedules.
        </Typography>
      </AppCard>
    </Stack>
  );
}
