"use client";

import { Grid, Typography } from '@mui/material';
import { AppChart } from '@/components/charts/AppChart';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const rehabOutcomes = [
  { month: 'Aug', recovered: 12 },
  { month: 'Sep', recovered: 15 },
  { month: 'Oct', recovered: 19 },
  { month: 'Nov', recovered: 21 }
];

export default function PhysiotherapyReportsPage() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4" fontWeight={700}>
          Physiotherapy Reports
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <AppChart title="Rehab Outcomes">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={rehabOutcomes}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="recovered" fill="#1e88e5" radius={8} />
            </BarChart>
          </ResponsiveContainer>
        </AppChart>
      </Grid>
    </Grid>
  );
}
