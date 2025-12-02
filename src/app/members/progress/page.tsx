"use client";

import { Grid, Typography } from '@mui/material';
import { AppCard } from '@/components/common/AppCard';
import { AppChart } from '@/components/charts/AppChart';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const progressData = [
  { month: 'Jul', weight: 82, bodyFat: 26 },
  { month: 'Aug', weight: 80, bodyFat: 24 },
  { month: 'Sep', weight: 78, bodyFat: 23 },
  { month: 'Oct', weight: 76, bodyFat: 21 },
  { month: 'Nov', weight: 74, bodyFat: 19 }
];

export default function MemberProgressPage() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4" fontWeight={700}>
          Progress Tracking
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <AppChart title="Weight Trend">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={progressData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="weight" stroke="#1e88e5" strokeWidth={3} dot />
            </LineChart>
          </ResponsiveContainer>
        </AppChart>
      </Grid>
      <Grid item xs={12} md={6}>
        <AppChart title="Body Fat %">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={progressData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="bodyFat" stroke="#8e24aa" strokeWidth={3} dot />
            </LineChart>
          </ResponsiveContainer>
        </AppChart>
      </Grid>
      <Grid item xs={12}>
        <AppCard title="Session Notes">
          <Typography variant="body2" color="text.secondary">
            Track qualitative progress, feedback from trainers and physiotherapists, and attach progress photos here.
          </Typography>
        </AppCard>
      </Grid>
    </Grid>
  );
}
