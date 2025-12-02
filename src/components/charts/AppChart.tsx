"use client";

import { Card, CardContent, CardHeader, useTheme } from '@mui/material';
import { ReactNode } from 'react';

export type AppChartProps = {
  title: string;
  action?: ReactNode;
  children: ReactNode;
};

export function AppChart({ title, action, children }: AppChartProps) {
  const theme = useTheme();
  return (
    <Card elevation={3} sx={{ height: '100%' }}>
      <CardHeader title={title} action={action} titleTypographyProps={{ variant: 'h6' }} />
      <CardContent sx={{ height: '100%', '& .recharts-surface': { fontFamily: theme.typography.fontFamily } }}>
        {children}
      </CardContent>
    </Card>
  );
}
