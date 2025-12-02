"use client";

import { Card, CardContent, CardHeader, CardProps, Typography } from '@mui/material';
import { ReactNode } from 'react';

export type AppCardProps = CardProps & {
  title?: string;
  action?: ReactNode;
  subtitle?: string;
};

export function AppCard({ title, subtitle, action, children, ...props }: AppCardProps) {
  return (
    <Card elevation={3} {...props}>
      {(title || action) && (
        <CardHeader
          title={title ? <Typography variant="h6">{title}</Typography> : undefined}
          subheader={subtitle}
          action={action}
        />
      )}
      <CardContent>{children}</CardContent>
    </Card>
  );
}
