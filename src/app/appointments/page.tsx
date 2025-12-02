"use client";

import { AppCard } from '@/components/common/AppCard';
import { Grid, Typography } from '@mui/material';

export default function AppointmentsHubPage() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4" fontWeight={700}>
          Appointments Center
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <AppCard title="Training Sessions">
          Manage personal training appointments, staff schedules, and rescheduling workflows.
        </AppCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <AppCard title="Physiotherapy Sessions">
          Coordinate physiotherapy appointments, therapist availability, and clinical notes.
        </AppCard>
      </Grid>
      <Grid item xs={12}>
        <AppCard title="Calendar">
          Embed a full calendar view to visualize day/week/month schedules.
        </AppCard>
      </Grid>
    </Grid>
  );
}
