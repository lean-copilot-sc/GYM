"use client";

import { ReactNode } from 'react';
import { Resolver, useForm, UseFormReturn } from 'react-hook-form';
import { z, ZodSchema } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Stack } from '@mui/material';

export type AppFormProps<TFormValues extends Record<string, unknown>> = {
  schema: ZodSchema<TFormValues>;
  defaultValues: TFormValues;
  onSubmit: (values: TFormValues) => void | Promise<void>;
  children: ReactNode | ((methods: UseFormReturn<TFormValues>) => ReactNode);
  resolver?: Resolver<TFormValues>;
  gap?: number;
};

export function AppForm<TFormValues extends Record<string, unknown>>({
  schema,
  defaultValues,
  onSubmit,
  children,
  resolver,
  gap = 2
}: AppFormProps<TFormValues>) {
  const form = useForm<TFormValues>({
    resolver: resolver ?? zodResolver(schema as z.ZodType<TFormValues>),
    defaultValues,
    mode: 'onBlur'
  });

  const content = typeof children === 'function' ? children(form) : children;

  return (
    <Box component="form" onSubmit={form.handleSubmit(onSubmit)}>
      <Stack spacing={gap}>{content}</Stack>
    </Box>
  );
}
