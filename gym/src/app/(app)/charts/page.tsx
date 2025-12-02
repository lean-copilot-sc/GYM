"use client";

import { Grid, Stack, Typography } from '@mui/material';
import { TrendAreaChart } from '@/components/charts/TrendAreaChart';
import { useAppSelector } from '@/hooks/redux';

export default function ChartsPage() {
  const analytics = useAppSelector((state) => state.analytics);

  return (
    <Stack spacing={4}>
      <Typography variant="h4" fontWeight={700}>
        Analytics Visualizations
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TrendAreaChart title="Revenue" subtitle="Monthly" data={analytics.revenueTrend} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TrendAreaChart title="Visits" subtitle="Weekly" data={analytics.visitTrend} primaryColor="#6c5dd3" />
        </Grid>
      </Grid>
    </Stack>
  );
}
