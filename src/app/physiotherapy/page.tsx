"use client";

import { Stack, Typography } from '@mui/material';
import { AppTable } from '@/components/tables/AppTable';
import { useAppSelector } from '@/hooks/reduxHooks';

export default function PhysiotherapyPatientsPage() {
  const cases = useAppSelector((state) => state.physiotherapy.cases);

  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={700}>
        Physiotherapy Patients
      </Typography>
      <AppTable
        columns={[
          { field: 'patientName', headerName: 'Patient', flex: 1 },
          { field: 'painScale', headerName: 'Pain Scale', width: 140 },
          { field: 'sessionsCompleted', headerName: 'Sessions', width: 140 }
        ]}
        rows={cases}
      />
    </Stack>
  );
}
