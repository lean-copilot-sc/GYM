"use client";

import { ChangeEvent } from 'react';
import { z } from 'zod';
import { Controller, UseFormReturn } from 'react-hook-form';
import { AppForm } from '@/components/forms/AppForm';
import { AppCard } from '@/components/common/AppCard';
import { Button, Grid, MenuItem, TextField, Typography } from '@mui/material';

const paymentSchema = z.object({
  memberName: z.string().min(2, 'Member name is required'),
  amount: z.number().positive('Amount must be positive'),
  status: z.enum(['paid', 'pending', 'overdue']),
  dueDate: z.string().optional()
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

const defaultValues: PaymentFormValues = {
  memberName: '',
  amount: 0,
  status: 'pending',
  dueDate: ''
};

export default function AddPaymentPage() {
  const handleSubmit = async (values: PaymentFormValues) => {
    console.log('Payment submit', values);
  };

  return (
    <AppCard title="Record Payment" sx={{ maxWidth: 720 }}>
      <Typography variant="body1" color="text.secondary" mb={2}>
        Log manual payments, physiotherapy invoices, or membership renewals.
      </Typography>
      <AppForm<PaymentFormValues> schema={paymentSchema} defaultValues={defaultValues} onSubmit={handleSubmit}>
        {(form: UseFormReturn<PaymentFormValues>) => (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller<PaymentFormValues, 'memberName'>
                name="memberName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Member"
                    fullWidth
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller<PaymentFormValues, 'amount'>
                name="amount"
                control={form.control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Amount"
                    fullWidth
                    onChange={(event: ChangeEvent<HTMLInputElement>) => field.onChange(Number(event.target.value))}
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller<PaymentFormValues, 'status'>
                name="status"
                control={form.control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    select
                    label="Status"
                    fullWidth
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                  >
                    <MenuItem value="paid">Paid</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="overdue">Overdue</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller<PaymentFormValues, 'dueDate'>
                name="dueDate"
                control={form.control}
                render={({ field }) => (
                  <TextField {...field} type="date" label="Due Date" fullWidth InputLabelProps={{ shrink: true }} />
                )}
              />
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="flex-end">
              <Button variant="contained" type="submit">
                Save Payment
              </Button>
            </Grid>
          </Grid>
        )}
      </AppForm>
    </AppCard>
  );
}
