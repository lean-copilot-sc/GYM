"use client";

import { Grid, Typography } from '@mui/material';
import { AppChart } from '@/components/charts/AppChart';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const attendanceReport = [
  { month: 'Aug', gym: 820, physio: 180 },
  { month: 'Sep', gym: 790, physio: 210 },
  { month: 'Oct', gym: 840, physio: 240 },
  { month: 'Nov', gym: 910, physio: 260 }
];

export default function AttendanceReportsPage() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4" fontWeight={700}>
          Attendance Reports
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <AppChart title="Monthly Attendance">
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={attendanceReport}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="gym" stackId="1" stroke="#1e88e5" fill="#1e88e5" fillOpacity={0.3} />
              <Area type="monotone" dataKey="physio" stackId="1" stroke="#8e24aa" fill="#8e24aa" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </AppChart>
      </Grid>
    </Grid>
  );
}
