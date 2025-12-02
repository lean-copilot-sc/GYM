"use client";

import { Grid, Typography } from '@mui/material';
import { AppChart } from '@/components/charts/AppChart';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const revenueSeries = [
  { month: 'Aug', revenue: 12400 },
  { month: 'Sep', revenue: 13800 },
  { month: 'Oct', revenue: 15700 },
  { month: 'Nov', revenue: 16950 }
];

export default function PaymentReportsPage() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4" fontWeight={700}>
          Payment Reports
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <AppChart title="Revenue Trend">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={revenueSeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#43a047" strokeWidth={3} dot />
            </LineChart>
          </ResponsiveContainer>
        </AppChart>
      </Grid>
    </Grid>
  );
}
