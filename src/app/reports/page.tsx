"use client";

import { Grid, Typography } from '@mui/material';
import { AppChart } from '@/components/charts/AppChart';
import { ResponsiveContainer, ComposedChart, Area, Bar, Line, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

const reportData = [
  { month: 'Aug', members: 210, revenue: 12400, attendance: 820 },
  { month: 'Sep', members: 225, revenue: 13800, attendance: 790 },
  { month: 'Oct', members: 242, revenue: 15700, attendance: 840 },
  { month: 'Nov', members: 251, revenue: 16950, attendance: 910 }
];

export default function ReportsPage() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4" fontWeight={700}>
          Insights & Reports
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <AppChart title="Performance Overview">
          <ResponsiveContainer width="100%" height={340}>
            <ComposedChart data={reportData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="attendance" fill="#1e88e5" stroke="#1e88e5" fillOpacity={0.2} />
              <Bar dataKey="revenue" barSize={24} fill="#8e24aa" />
              <Line type="monotone" dataKey="members" stroke="#43a047" strokeWidth={3} />
            </ComposedChart>
          </ResponsiveContainer>
        </AppChart>
      </Grid>
    </Grid>
  );
}
