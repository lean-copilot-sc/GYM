"use client";

import { Grid, Stack, Typography } from '@mui/material';
import { AppCard } from '@/components/common/AppCard';
import { AppChart } from '@/components/charts/AppChart';
import { AppTable } from '@/components/tables/AppTable';
import { Line, LineChart, Bar, BarChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';

const stats = [
  { label: 'Active Members', value: 248 },
  { label: 'Sessions Today', value: 32 },
  { label: 'Total Revenue', value: '$84,200' },
  { label: 'Physiotherapy Sessions', value: 14 }
];

const attendanceData = [
  { day: 'Mon', gym: 42, physio: 8 },
  { day: 'Tue', gym: 56, physio: 12 },
  { day: 'Wed', gym: 61, physio: 14 },
  { day: 'Thu', gym: 48, physio: 11 },
  { day: 'Fri', gym: 74, physio: 15 },
  { day: 'Sat', gym: 80, physio: 18 },
  { day: 'Sun', gym: 34, physio: 6 }
];

const revenueData = [
  { month: 'Jan', revenue: 12000 },
  { month: 'Feb', revenue: 13200 },
  { month: 'Mar', revenue: 14100 },
  { month: 'Apr', revenue: 15250 },
  { month: 'May', revenue: 16320 },
  { month: 'Jun', revenue: 17100 }
];

const physioCases = [
  { name: 'Sports Injury', value: 32 },
  { name: 'Post Surgery', value: 24 },
  { name: 'Chronic Pain', value: 18 },
  { name: 'Mobility', value: 12 }
];

const recentMembers = [
  { id: 'rm-1', name: 'Karan Joshi', plan: 'Gold', joined: '2025-11-24' },
  { id: 'rm-2', name: 'Sneha Vyas', plan: 'Silver', joined: '2025-11-23' },
  { id: 'rm-3', name: 'Tanya Patel', plan: 'Basic', joined: '2025-11-21' }
];

const upcomingAppointments = [
  { id: 'ua-1', title: 'Strength Training', staff: 'Rohit Kapadia', time: '10:00 AM' },
  { id: 'ua-2', title: 'Rehab Session', staff: 'Dr. Riya Shah', time: '11:30 AM' },
  { id: 'ua-3', title: 'Flexibility Coaching', staff: 'Sneha Vyas', time: '1:00 PM' }
];

const COLORS = ['#1e88e5', '#ff7043', '#66bb6a', '#ab47bc'];

export default function DashboardPage() {
  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={700}>
        Dashboard
      </Typography>

      <Grid container spacing={2}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.label}>
            <AppCard title={stat.label}>
              <Typography variant="h4" fontWeight={700}>
                {stat.value}
              </Typography>
            </AppCard>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <AppChart title="Attendance Overview">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={attendanceData}>
                <XAxis dataKey="day" stroke="#9e9e9e" />
                <YAxis stroke="#9e9e9e" />
                <Tooltip />
                <Line type="monotone" dataKey="gym" stroke="#1e88e5" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="physio" stroke="#8e24aa" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </AppChart>
        </Grid>
        <Grid item xs={12} md={6}>
          <AppChart title="Revenue Growth">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={revenueData}>
                <XAxis dataKey="month" stroke="#9e9e9e" />
                <YAxis stroke="#9e9e9e" />
                <Tooltip />
                <Bar dataKey="revenue" fill="#43a047" radius={8} />
              </BarChart>
            </ResponsiveContainer>
          </AppChart>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <AppChart title="Physiotherapy Cases">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={physioCases} dataKey="value" outerRadius={90} label>
                  {physioCases.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </AppChart>
        </Grid>
        <Grid item xs={12} md={4}>
          <AppCard title="Recent Members">
            <AppTable
              columns={[
                { field: 'name', headerName: 'Name', flex: 1 },
                { field: 'plan', headerName: 'Plan', width: 120 },
                { field: 'joined', headerName: 'Joined', width: 140 }
              ]}
              rows={recentMembers}
              pageSizeOptions={[3]}
            />
          </AppCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <AppCard title="Upcoming Appointments">
            <AppTable
              columns={[
                { field: 'title', headerName: 'Service', flex: 1 },
                { field: 'staff', headerName: 'Staff', width: 160 },
                { field: 'time', headerName: 'Time', width: 120 }
              ]}
              rows={upcomingAppointments}
              pageSizeOptions={[3]}
            />
          </AppCard>
        </Grid>
      </Grid>
    </Stack>
  );
}
