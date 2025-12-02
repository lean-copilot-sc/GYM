"use client";

import { AppCard } from '@/components/common/AppCard';
import { AppTable } from '@/components/tables/AppTable';
import { Stack, Typography } from '@mui/material';

const trainers = [
  { id: 'tr1', name: 'Rohit Kapadia', specialization: 'Strength Training', members: 18 },
  { id: 'tr2', name: 'Sneha Vyas', specialization: 'Functional Fitness', members: 12 }
];

export default function TrainersPage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={700}>
        Trainers & Staff
      </Typography>
      <AppCard>
        <AppTable
          columns={[
            { field: 'name', headerName: 'Trainer', flex: 1 },
            { field: 'specialization', headerName: 'Specialization', flex: 1 },
            { field: 'members', headerName: 'Assigned Members', width: 180 }
          ]}
          rows={trainers}
        />
      </AppCard>
    </Stack>
  );
}
