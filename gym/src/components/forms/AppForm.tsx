"use client";

import { ReactNode } from 'react';
import { DefaultValues, Resolver, useForm, UseFormReturn } from 'react-hook-form';
import { z, ZodSchema } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box } from '@mui/material';

export type AppFormProps<TFormValues extends Record<string, unknown>> = {
  schema: ZodSchema<TFormValues>;
  defaultValues: DefaultValues<TFormValues>;
  onSubmit: (values: TFormValues) => void | Promise<void>;
  children: ReactNode | ((form: UseFormReturn<TFormValues>) => ReactNode);
  resolver?: Resolver<TFormValues>;
};

export function AppForm<TFormValues extends Record<string, unknown>>({
  schema,
  defaultValues,
  onSubmit,
  children,
  resolver
}: AppFormProps<TFormValues>) {
  const methods = useForm<TFormValues>({
    defaultValues,
    resolver: resolver ?? zodResolver(schema as z.ZodType<TFormValues>),
    mode: 'onChange'
  });

  const content = typeof children === 'function' ? children(methods) : children;

  return (
    <Box component="form" onSubmit={methods.handleSubmit(onSubmit)} sx={{ display: 'contents' }}>
      {content}
    </Box>
  );
}
