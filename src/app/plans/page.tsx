"use client";

import { AppCard } from '@/components/common/AppCard';
import { AppTable } from '@/components/tables/AppTable';
import { Button, Stack, Typography } from '@mui/material';

const planRows = [
  { id: 'pl1', name: 'Gold Membership', duration: '12 Months', price: '$1200', benefits: 'Unlimited access' },
  { id: 'pl2', name: 'Physio Rehab', duration: '8 Weeks', price: '$480', benefits: '2 sessions/week' }
];

export default function MembershipPlansPage() {
  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
        <Typography variant="h4" fontWeight={700}>
          Membership Plans
        </Typography>
        <Button variant="contained">Create Plan</Button>
      </Stack>
      <AppCard>
        <AppTable
          columns={[
            { field: 'name', headerName: 'Plan', flex: 1 },
            { field: 'duration', headerName: 'Duration', width: 160 },
            { field: 'price', headerName: 'Price', width: 140 },
            { field: 'benefits', headerName: 'Highlights', flex: 1 }
          ]}
          rows={planRows}
        />
      </AppCard>
    </Stack>
  );
}
