"use client";

import { useCallback } from 'react';
import { z } from 'zod';
import {
  Grid,
  Stack,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  Button,
  Typography
} from '@mui/material';
import { AppForm } from '@/components/forms/AppForm';
import { FormSectionCard } from '@/components/forms/FormSectionCard';
import { FormStepper, FormStep } from '@/components/forms/FormStepper';
import { useAppDispatch } from '@/hooks/redux';
import { showSnackbar } from '@/features/ui/uiSlice';
import { Controller } from 'react-hook-form';

const subscriptionSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(8, 'Enter a phone number'),
  companyName: z.string().min(1, 'Company is required'),
  teamSize: z.number().min(1, 'Team size must be at least 1'),
  plan: z.enum(['starter', 'growth', 'enterprise']),
  message: z.string().max(280, 'Keep it under 280 characters').optional(),
  terms: z.boolean().refine((val) => val, 'You must accept the terms')
});

type SubscriptionForm = z.infer<typeof subscriptionSchema>;

const defaultValues: SubscriptionForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  companyName: '',
  teamSize: 10,
  plan: 'growth',
  message: '',
  terms: true
};

export default function FormsPage() {
  const dispatch = useAppDispatch();

  const handleSubmit = useCallback(
    async (values: SubscriptionForm) => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      dispatch(
        showSnackbar({
          message: `Plan ${values.plan.toUpperCase()} successfully configured for ${values.companyName}`,
          severity: 'success'
        })
      );
    },
    [dispatch]
  );

  return (
    <Stack spacing={4}>
      <Typography variant="h4" fontWeight={700}>
        Validation Playground
      </Typography>
      <AppForm schema={subscriptionSchema} defaultValues={defaultValues} onSubmit={handleSubmit}>
        {(form) => {
          const { control } = form;
          const steps: FormStep[] = [
            {
              label: 'Organization',
              description: 'Tell us about your organization and expected seat count.',
              content: (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Company name"
                      fullWidth
                      {...form.register('companyName')}
                      error={!!form.formState.errors.companyName}
                      helperText={form.formState.errors.companyName?.message}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="teamSize"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="Team size"
                          type="number"
                          fullWidth
                          value={field.value}
                          onChange={(event) => field.onChange(Number(event.target.value))}
                          error={!!form.formState.errors.teamSize}
                          helperText={form.formState.errors.teamSize?.message}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              )
            },
            {
              label: 'Contact',
              description: 'Primary contact for activation and billing updates.',
              content: (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="First name"
                      fullWidth
                      {...form.register('firstName')}
                      error={!!form.formState.errors.firstName}
                      helperText={form.formState.errors.firstName?.message}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Last name"
                      fullWidth
                      {...form.register('lastName')}
                      error={!!form.formState.errors.lastName}
                      helperText={form.formState.errors.lastName?.message}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Work email"
                      fullWidth
                      {...form.register('email')}
                      error={!!form.formState.errors.email}
                      helperText={form.formState.errors.email?.message}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Phone"
                      fullWidth
                      {...form.register('phone')}
                      error={!!form.formState.errors.phone}
                      helperText={form.formState.errors.phone?.message}
                    />
                  </Grid>
                </Grid>
              )
            },
            {
              label: 'Plan & Review',
              description: 'Select your plan and confirm the subscription request.',
              content: (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="plan"
                      control={control}
                      render={({ field }) => (
                        <TextField label="Plan" select fullWidth value={field.value} onChange={field.onChange}>
                          <MenuItem value="starter">Starter — Free</MenuItem>
                          <MenuItem value="growth">Growth — $49/mo</MenuItem>
                          <MenuItem value="enterprise">Enterprise — Custom</MenuItem>
                        </TextField>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Notes"
                      multiline
                      minRows={3}
                      fullWidth
                      {...form.register('message')}
                      error={!!form.formState.errors.message}
                      helperText={form.formState.errors.message?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      control={control}
                      name="terms"
                      render={({ field }) => (
                        <FormControlLabel
                          control={<Switch checked={field.value} onChange={(event) => field.onChange(event.target.checked)} />}
                          label="I agree to the Able Pro Inspired subscription terms"
                        />
                      )}
                    />
                    {form.formState.errors.terms && (
                      <Typography variant="caption" color="error.main">
                        {form.formState.errors.terms.message}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              )
            }
          ];

          return (
            <Stack spacing={3}>
              <FormSectionCard
                title="Subscription request"
                subtitle="Quick form showcasing Able Pro validation patterns with React Hook Form + Zod."
                action={
                  <Button
                    variant="contained"
                    onClick={form.handleSubmit(handleSubmit)}
                    disabled={!form.formState.isValid || form.formState.isSubmitting}
                  >
                    Submit
                  </Button>
                }
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="First name"
                      fullWidth
                      {...form.register('firstName')}
                      error={!!form.formState.errors.firstName}
                      helperText={form.formState.errors.firstName?.message}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Last name"
                      fullWidth
                      {...form.register('lastName')}
                      error={!!form.formState.errors.lastName}
                      helperText={form.formState.errors.lastName?.message}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Work email"
                      fullWidth
                      {...form.register('email')}
                      error={!!form.formState.errors.email}
                      helperText={form.formState.errors.email?.message}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Phone"
                      fullWidth
                      {...form.register('phone')}
                      error={!!form.formState.errors.phone}
                      helperText={form.formState.errors.phone?.message}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Company"
                      fullWidth
                      {...form.register('companyName')}
                      error={!!form.formState.errors.companyName}
                      helperText={form.formState.errors.companyName?.message}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="teamSize"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="Team size"
                          type="number"
                          fullWidth
                          value={field.value}
                          onChange={(event) => field.onChange(Number(event.target.value))}
                          error={!!form.formState.errors.teamSize}
                          helperText={form.formState.errors.teamSize?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="plan"
                      control={control}
                      render={({ field }) => (
                        <TextField label="Plan" select fullWidth value={field.value} onChange={field.onChange}>
                          <MenuItem value="starter">Starter — Free</MenuItem>
                          <MenuItem value="growth">Growth — $49/mo</MenuItem>
                          <MenuItem value="enterprise">Enterprise — Custom</MenuItem>
                        </TextField>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Additional notes"
                      multiline
                      minRows={3}
                      fullWidth
                      {...form.register('message')}
                      error={!!form.formState.errors.message}
                      helperText={form.formState.errors.message?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      control={control}
                      name="terms"
                      render={({ field }) => (
                        <FormControlLabel
                          control={<Switch checked={field.value} onChange={(event) => field.onChange(event.target.checked)} />}
                          label="I agree to the Able Pro Inspired subscription terms"
                        />
                      )}
                    />
                    {form.formState.errors.terms && (
                      <Typography variant="caption" color="error.main">
                        {form.formState.errors.terms.message}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </FormSectionCard>

              <FormSectionCard
                title="Stepper experience"
                subtitle="Guide customers through validation in smaller chunks."
              >
                <FormStepper steps={steps} onComplete={form.handleSubmit(handleSubmit)} />
              </FormSectionCard>
            </Stack>
          );
        }}
      </AppForm>
    </Stack>
  );
}
