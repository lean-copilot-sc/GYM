"use client";

import { AppCard } from '@/components/common/AppCard';
import { AppTable } from '@/components/tables/AppTable';
import { Stack, Typography } from '@mui/material';

const expenseRows = [
  { id: 'ex1', category: 'Equipment Maintenance', amount: 320, date: '2025-11-20' },
  { id: 'ex2', category: 'Supplements Purchase', amount: 540, date: '2025-11-22' }
];

export default function PaymentExpensesPage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={700}>
        Expenses
      </Typography>
      <AppCard>
        <AppTable
          columns={[
            { field: 'category', headerName: 'Category', flex: 1 },
            { field: 'amount', headerName: 'Amount', width: 140 },
            { field: 'date', headerName: 'Date', width: 160 }
          ]}
          rows={expenseRows}
        />
      </AppCard>
    </Stack>
  );
}
