"use client";

import { Grid, Stack, Typography, Card, CardContent, Divider, Button } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupsIcon from '@mui/icons-material/Groups';
import TimelineIcon from '@mui/icons-material/Timeline';
import InventoryIcon from '@mui/icons-material/Inventory';
import DownloadIcon from '@mui/icons-material/Download';
import { MetricCard } from '@/components/layout/MetricCard';
import { TrendAreaChart } from '@/components/charts/TrendAreaChart';
import { useAppSelector } from '@/hooks/redux';
import { formatCurrency } from '@/utils/formatters';

export default function DashboardPage() {
  const analytics = useAppSelector((state) => state.analytics);

  const revenue = analytics.revenueTrend.at(-1)?.value ?? 0;
  const visits = analytics.visitTrend.at(-1)?.value ?? 0;

  return (
    <Stack spacing={4}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <div>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Welcome back, Olivia 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here is what is happening with your analytics today.
          </Typography>
        </div>
        <Button variant="contained" startIcon={<DownloadIcon />} size="large">
          Download Report
        </Button>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <MetricCard title="Revenue" value={formatCurrency(revenue)} change="▲ 12% vs last month" icon={TrendingUpIcon} />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard title="Active Members" value="8,245" change="▲ 4.5%" icon={GroupsIcon} tone="success" />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard title="Conversion" value="3.8%" change="▲ 0.9%" icon={TimelineIcon} />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard title="Pending Tasks" value="24" change="▼ 5" icon={InventoryIcon} tone="warning" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <TrendAreaChart title="Revenue Trend" subtitle="Last 6 months" data={analytics.revenueTrend} />
        </Grid>
        <Grid item xs={12} md={5}>
          <TrendAreaChart title="Visits" subtitle="Weekly" data={analytics.visitTrend} primaryColor="#51d18f" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ backdropFilter: 'blur(10px)' }}>
            <CardContent>
              <Stack direction={{ xs: 'column', md: 'row' }} gap={3} alignItems={{ xs: 'flex-start', md: 'center' }}>
                <Stack spacing={0.5} flex={1}>
                  <Typography variant="h6">Team Activity</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Track collaboration across product, marketing, and operations within the last 24 hours.
                  </Typography>
                </Stack>
                <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' }, borderColor: 'rgba(148,163,184,0.12)' }} />
                <Stack spacing={1} flex={1}>
                  <Typography variant="body2" color="text.secondary">
                    • Product team resolved <strong>12</strong> validation issues
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Marketing scheduled <strong>4</strong> campaigns for next week
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Operations cleared <strong>18</strong> support tickets
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
