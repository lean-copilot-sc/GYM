"use client";

import { Grid, Typography } from '@mui/material';
import { AppCard } from '@/components/common/AppCard';

export default function AttendanceHubPage() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4" fontWeight={700}>
          Attendance Center
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <AppCard title="Gym Attendance">
          Track daily gym check-ins, manual adjustments, and QR-based entries.
        </AppCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <AppCard title="Physiotherapy Attendance">
          Monitor therapy sessions, cancellations, and follow-up reminders.
        </AppCard>
      </Grid>
    </Grid>
  );
}
