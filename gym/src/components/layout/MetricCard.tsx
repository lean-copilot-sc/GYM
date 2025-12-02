"use client";

import { Card, CardContent, Stack, Typography, alpha } from '@mui/material';
import type { SvgIconComponent } from '@mui/icons-material';

export type MetricCardProps = {
  title: string;
  value: string;
  change?: string;
  icon: SvgIconComponent;
  tone?: 'primary' | 'success' | 'warning' | 'error';
};

export function MetricCard({ title, value, change, icon: Icon, tone = 'primary' }: MetricCardProps) {
  return (
    <Card
      sx={{
        p: 2.5,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Stack
          sx={{
            width: 56,
            height: 56,
            borderRadius: 2,
            alignItems: 'center',
            justifyContent: 'center',
            background: (theme) => alpha(theme.palette[tone].main, 0.18),
            color: (theme) => theme.palette[tone].main
          }}
        >
          <Icon fontSize="medium" />
        </Stack>
        <Stack spacing={0.5}>
          <Typography variant="body2" color="text.secondary" fontWeight={600}>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={700}>
            {value}
          </Typography>
          {change && (
            <Typography variant="body2" color={tone === 'error' ? 'error.main' : 'success.main'} fontWeight={600}>
              {change}
            </Typography>
          )}
        </Stack>
      </Stack>
    </Card>
  );
}
