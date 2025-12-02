import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography
} from '@mui/material';
import { LineChart, lineElementClasses } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { format } from 'date-fns';
import api from '../api/apiClient.js';
import { useAuth } from '../providers/AuthProvider.jsx';

const endpointByRole = {
  admin: '/dashboard/admin',
  trainer: '/dashboard/trainer',
  physio: '/dashboard/physio',
  member: '/dashboard/member'
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const endpoint = endpointByRole[user?.role] || endpointByRole.member;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const { data: response } = await api.get(endpoint);
        setData(response);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  const content = useMemo(() => {
    if (!data) return null;

    switch (user?.role) {
      case 'admin':
        return <AdminDashboard data={data} />;
      case 'trainer':
        return <TrainerDashboard data={data} />;
      case 'physio':
        return <PhysioDashboard data={data} />;
      default:
        return <MemberDashboard data={data} />;
    }
  }, [data, user]);

  return (
    <Stack spacing={3}>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>Dashboard</Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && content}
    </Stack>
  );
}

function AdminDashboard({ data }) {
  const revenueData = (data.revenue || []).map((item) => ({
    month: item._id,
    total: Number(item.total ?? 0)
  }));

  const memberBreakdown = [
    { key: 'Active', value: Number(data.stats?.activeMembers ?? 0) },
    { key: 'Inactive', value: Math.max(Number(data.stats?.totalMembers ?? 0) - Number(data.stats?.activeMembers ?? 0), 0) },
    { key: 'Trainers', value: Number(data.stats?.totalTrainers ?? 0) },
    { key: 'Physios', value: Number(data.stats?.totalPhysios ?? 0) }
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <MetricCard title="Members" value={data.stats?.totalMembers} />
      </Grid>
      <Grid item xs={12} md={3}>
        <MetricCard title="Active Members" value={data.stats?.activeMembers} />
      </Grid>
      <Grid item xs={12} md={3}>
        <MetricCard title="Trainers" value={data.stats?.totalTrainers} />
      </Grid>
      <Grid item xs={12} md={3}>
        <MetricCard title="Physiotherapists" value={data.stats?.totalPhysios} />
      </Grid>
      <Grid item xs={12} md={8}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ height: '100%' }}>
            <Typography variant="h6" gutterBottom fontWeight={700}>
              Revenue Momentum
            </Typography>
            {revenueData.length ? (
              <LineChart
                height={240}
                series={[{ data: revenueData.map((item) => item.total), label: 'Revenue', area: true, color: '#1976d2' }]}
                xAxis={[{ scaleType: 'point', data: revenueData.map((item) => item.month) }]}
                sx={{
                  [`& .${lineElementClasses.root}`]: {
                    strokeWidth: 3
                  }
                }}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                Revenue data will appear once payments are recorded.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight={700}>
              Team Balance
            </Typography>
            <BarChart
              height={240}
              series={[{ data: memberBreakdown.map((item) => item.value), label: 'Count', color: '#4caf50' }]}
              xAxis={[{ data: memberBreakdown.map((item) => item.key), scaleType: 'band' }]}
              margin={{ left: 50, right: 20, top: 10, bottom: 40 }}
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight={700}>
              Upcoming Renewals
            </Typography>
            <List dense>
              {(data.upcomingRenewals || []).map((renewal) => (
                <ListItem key={renewal._id}>
                  <ListItemText
                    primary={renewal.userId?.name}
                    secondary={
                      renewal.renewalDate
                        ? `Renewal: ${format(new Date(renewal.renewalDate), 'PP')}`
                        : 'No renewal date set'
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight={700}>
              Outstanding Payments
            </Typography>
            <List dense>
              {(data.outstandingPayments || []).map((payment) => (
                <ListItem key={payment._id}>
                  <ListItemText
                    primary={`${payment.memberId?.userId?.name || 'Member'} — ${payment.currency || 'USD'} ${
                      payment.amount?.toFixed?.(2) ?? payment.amount
                    }`}
                    secondary={
                      payment.dueDate
                        ? `Due: ${format(new Date(payment.dueDate), 'PP')}`
                        : 'No due date set'
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

function TrainerDashboard({ data }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Assigned Members
            </Typography>
            <List>
              {(data.members || []).map((member) => (
                <ListItem key={member._id}>
                  <ListItemText primary={member.userId?.name} secondary={member.membershipType} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Upcoming Sessions
            </Typography>
            <List>
              {(data.upcomingAppointments || []).map((appointment) => (
                <ListItem key={appointment._id}>
                  <ListItemText
                    primary={format(new Date(appointment.start), 'PPpp')}
                    secondary={`Member: ${appointment.memberId}`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

function PhysioDashboard({ data }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Assigned Patients
            </Typography>
            <List>
              {(data.members || []).map((member) => (
                <ListItem key={member._id}>
                  <ListItemText primary={member.userId?.name} secondary={member.medicalConditions?.join(', ')} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Upcoming Sessions
            </Typography>
            <List>
              {(data.upcomingAppointments || []).map((appointment) => (
                <ListItem key={appointment._id}>
                  <ListItemText
                    primary={format(new Date(appointment.start), 'PPpp')}
                    secondary={`Member: ${appointment.memberId}`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

function MemberDashboard({ data }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Membership Details
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Type" secondary={data.member?.membershipType} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Status" secondary={data.member?.status} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Trainer" secondary={data.member?.assignedTrainer?.name || 'Not assigned'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Physiotherapist" secondary={data.member?.assignedPhysio?.name || 'Not assigned'} />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Upcoming Appointments
            </Typography>
            <List>
              {(data.upcomingAppointments || []).map((appointment) => (
                <ListItem key={appointment._id}>
                  <ListItemText
                    primary={format(new Date(appointment.start), 'PPpp')}
                    secondary={`With: ${appointment.staffId?.name} (${appointment.staffId?.role})`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

function MetricCard({ title, value }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 700 }}>
          {value ?? 0}
        </Typography>
      </CardContent>
    </Card>
  );
}
