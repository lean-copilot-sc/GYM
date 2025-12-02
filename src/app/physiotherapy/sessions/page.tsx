"use client";

import { AppCard } from '@/components/common/AppCard';
import { AppTable } from '@/components/tables/AppTable';
import { Stack, Typography } from '@mui/material';

const sessionHistory = [
  { id: 's1', date: '2025-11-27', therapist: 'Dr. Riya Shah', notes: 'Improved mobility', pain: 3 },
  { id: 's2', date: '2025-11-25', therapist: 'Dr. Manan Patel', notes: 'Focus on stretching', pain: 4 }
];

export default function PhysiotherapySessionsPage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={700}>
        Treatment Sessions
      </Typography>
      <AppCard>
        <AppTable
          columns={[
            { field: 'date', headerName: 'Date', width: 140 },
            { field: 'therapist', headerName: 'Therapist', flex: 1 },
            { field: 'pain', headerName: 'Pain Scale', width: 160 },
            { field: 'notes', headerName: 'Notes', flex: 1 }
          ]}
          rows={sessionHistory}
        />
      </AppCard>
    </Stack>
  );
}
