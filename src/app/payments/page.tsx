"use client";

import { AppCard } from '@/components/common/AppCard';
import { AppTable } from '@/components/tables/AppTable';
import { useAppSelector } from '@/hooks/reduxHooks';
import { Button, Stack, Typography } from '@mui/material';

export default function PaymentsPage() {
  const invoices = useAppSelector((state) => state.payments.invoices);

  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
        <Typography variant="h4" fontWeight={700}>
          Payments & Billing
        </Typography>
        <Button variant="contained" href="/payments/add">
          Add Payment
        </Button>
      </Stack>
      <AppCard title="Invoices">
        <AppTable
          columns={[
            { field: 'memberName', headerName: 'Member', flex: 1 },
            { field: 'amount', headerName: 'Amount', width: 140, valueFormatter: ({ value }) => `$${value}` },
            { field: 'status', headerName: 'Status', width: 140 },
            { field: 'dueDate', headerName: 'Due Date', width: 180 }
          ]}
          rows={invoices}
        />
      </AppCard>
    </Stack>
  );
}
