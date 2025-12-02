"use client";

import { AppCard } from '@/components/common/AppCard';
import { AppTable } from '@/components/tables/AppTable';
import { Stack, Typography } from '@mui/material';

const supplements = [
  { id: 'sup1', name: 'Whey Protein', stock: 32, expiry: '2026-03-01' },
  { id: 'sup2', name: 'BCAA', stock: 18, expiry: '2025-09-15' }
];

export default function SupplementsInventoryPage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={700}>
        Supplements Inventory
      </Typography>
      <AppCard>
        <AppTable
          columns={[
            { field: 'name', headerName: 'Item', flex: 1 },
            { field: 'stock', headerName: 'Stock', width: 120 },
            { field: 'expiry', headerName: 'Expiry', width: 160 }
          ]}
          rows={supplements}
        />
      </AppCard>
    </Stack>
  );
}
