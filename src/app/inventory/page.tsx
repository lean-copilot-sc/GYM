"use client";

import { AppCard } from '@/components/common/AppCard';
import { Grid, Typography } from '@mui/material';

export default function InventoryHubPage() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4" fontWeight={700}>
          Inventory Management
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <AppCard title="Supplements">
          Track stock levels, expiry dates, and purchase records for supplements.
        </AppCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <AppCard title="Equipment">
          Monitor equipment usage, maintenance schedules, and low stock alerts.
        </AppCard>
      </Grid>
    </Grid>
  );
}
