"use client";

import { AppCard } from '@/components/common/AppCard';
import { AppTable } from '@/components/tables/AppTable';
import { Button, Stack, Typography } from '@mui/material';

const notifications = [
  { id: 'n1', channel: 'Email', template: 'Membership Renewal', updated: '2025-11-20' },
  { id: 'n2', channel: 'SMS', template: 'Appointment Reminder', updated: '2025-11-22' }
];

export default function NotificationsPage() {
  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
        <Typography variant="h4" fontWeight={700}>
          Notifications
        </Typography>
        <Button variant="contained">Create Template</Button>
      </Stack>
      <AppCard>
        <AppTable
          columns={[
            { field: 'channel', headerName: 'Channel', width: 140 },
            { field: 'template', headerName: 'Template', flex: 1 },
            { field: 'updated', headerName: 'Last Updated', width: 160 }
          ]}
          rows={notifications}
        />
      </AppCard>
    </Stack>
  );
}
