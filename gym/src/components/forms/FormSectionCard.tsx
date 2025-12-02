"use client";

import { Card, CardContent, CardHeader, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';

export type FormSectionCardProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
};

export function FormSectionCard({ title, subtitle, action, children }: FormSectionCardProps) {
  return (
    <Card>
      <CardHeader
        title={<Typography variant="h5">{title}</Typography>}
        subheader={subtitle}
        action={action}
      />
      <CardContent>
        <Stack spacing={3}>{children}</Stack>
      </CardContent>
    </Card>
  );
}
