"use client";

import { AppCard } from '@/components/common/AppCard';
import { AppTable } from '@/components/tables/AppTable';
import { Stack, Typography } from '@mui/material';

const equipments = [
  { id: 'eq1', name: 'Treadmill', status: 'Operational', nextService: '2025-12-15' },
  { id: 'eq2', name: 'Leg Press', status: 'Maintenance Due', nextService: '2025-12-05' }
];

export default function EquipmentsInventoryPage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={700}>
        Equipment Inventory
      </Typography>
      <AppCard>
        <AppTable
          columns={[
            { field: 'name', headerName: 'Equipment', flex: 1 },
            { field: 'status', headerName: 'Status', width: 180 },
            { field: 'nextService', headerName: 'Next Service', width: 160 }
          ]}
          rows={equipments}
        />
      </AppCard>
    </Stack>
  );
}
