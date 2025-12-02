"use client";

import {
  AreaChart,
  Area,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import type { TrendPoint } from '@/features/analytics/analyticsSlice';

export type TrendAreaChartProps = {
  title: string;
  subtitle?: string;
  data: TrendPoint[];
  primaryColor?: string;
};

export function TrendAreaChart({ title, subtitle, data, primaryColor = '#7366ff' }: TrendAreaChartProps) {
  return (
    <Card sx={{ height: '100%', backdropFilter: 'blur(12px)' }}>
      <CardHeader
        title={<Typography variant="h6">{title}</Typography>}
        subheader={subtitle}
        sx={{
          '& .MuiCardHeader-subheader': {
            color: 'text.secondary'
          }
        }}
      />
      <CardContent sx={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={primaryColor} stopOpacity={0.6} />
                <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.18)" />
            <XAxis dataKey="label" tick={{ fill: 'rgba(226, 232, 240, 0.7)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(226, 232, 240, 0.7)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                borderRadius: 12,
                backgroundColor: 'rgba(15,23,42,0.9)',
                border: '1px solid rgba(148, 163, 184, 0.2)'
              }}
            />
            <Area type="monotone" dataKey="value" stroke={primaryColor} fill="url(#colorPrimary)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
