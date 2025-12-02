"use client";

import { z } from 'zod';
import { Controller, UseFormReturn } from 'react-hook-form';
import { AppForm } from '@/components/forms/AppForm';
import { AppCard } from '@/components/common/AppCard';
import { Button, Grid, TextField, Typography } from '@mui/material';

const memberSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(8, 'Enter a valid phone number'),
  membershipType: z.string()
});

type MemberFormValues = z.infer<typeof memberSchema>;

const defaultValues: MemberFormValues = {
  name: '',
  email: '',
  phone: '',
  membershipType: 'Gold'
};

export default function AddMemberPage() {
  const handleSubmit = async (values: MemberFormValues) => {
    console.log('Submit member', values);
  };

  return (
    <AppCard title="Add Member" sx={{ maxWidth: 900 }}>
      <Typography variant="body1" color="text.secondary" mb={2}>
        Capture member details and assign a membership plan.
      </Typography>
      <AppForm<MemberFormValues> schema={memberSchema} defaultValues={defaultValues} onSubmit={handleSubmit}>
        {(form: UseFormReturn<MemberFormValues>) => (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Controller<MemberFormValues>
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Full Name"
                    fullWidth
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller<MemberFormValues>
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Email"
                    type="email"
                    fullWidth
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller<MemberFormValues>
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Phone"
                    fullWidth
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller<MemberFormValues>
                name="membershipType"
                control={form.control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Membership Type"
                    fullWidth
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="flex-end">
              <Button variant="contained" type="submit">
                Save Member
              </Button>
            </Grid>
          </Grid>
        )}
      </AppForm>
    </AppCard>
  );
}
