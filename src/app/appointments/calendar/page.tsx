"use client";

import { AppCard } from '@/components/common/AppCard';
import { Box, Typography } from '@mui/material';

export default function AppointmentsCalendarPage() {
  return (
    <AppCard title="Appointments Calendar">
      <Typography variant="body2" color="text.secondary" mb={2}>
        Integrate a full calendar (e.g., FullCalendar) to visualize schedules by day, week, or month.
      </Typography>
      <Box
        sx={{
          height: 400,
          borderRadius: 2,
          bgcolor: 'background.default',
          border: '1px dashed',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        Calendar Placeholder
      </Box>
    </AppCard>
  );
}
