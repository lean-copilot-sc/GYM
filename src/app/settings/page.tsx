"use client";

import { AppCard } from '@/components/common/AppCard';
import { Grid, TextField, Typography, Button } from '@mui/material';

export default function SettingsPage() {
  return (
    <AppCard title="Business Settings">
      <Typography variant="body2" color="text.secondary" mb={2}>
        Configure branding, contact details, and notification gateways.
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField label="Business Name" fullWidth defaultValue="FlexiCare Wellness" />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField label="Support Email" fullWidth defaultValue="support@flexicare.fit" />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField label="Phone" fullWidth defaultValue="+1 555-0199" />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField label="SMS Gateway" fullWidth placeholder="Twilio SID" />
        </Grid>
        <Grid item xs={12} display="flex" justifyContent="flex-end">
          <Button variant="contained">Save Changes</Button>
        </Grid>
      </Grid>
    </AppCard>
  );
}
