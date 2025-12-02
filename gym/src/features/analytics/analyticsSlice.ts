import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TrendPoint = {
  label: string;
  value: number;
};

export type AnalyticsState = {
  revenueTrend: TrendPoint[];
  visitTrend: TrendPoint[];
};

const initialState: AnalyticsState = {
  revenueTrend: [
    { label: 'Jan', value: 42000 },
    { label: 'Feb', value: 46800 },
    { label: 'Mar', value: 51200 },
    { label: 'Apr', value: 55800 },
    { label: 'May', value: 60300 }
  ],
  visitTrend: [
    { label: 'Week 1', value: 3200 },
    { label: 'Week 2', value: 3600 },
    { label: 'Week 3', value: 3900 },
    { label: 'Week 4', value: 4200 }
  ]
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setRevenueTrend(state, action: PayloadAction<TrendPoint[]>) {
      state.revenueTrend = action.payload;
    },
    setVisitTrend(state, action: PayloadAction<TrendPoint[]>) {
      state.visitTrend = action.payload;
    }
  }
});

export const { setRevenueTrend, setVisitTrend } = analyticsSlice.actions;
export default analyticsSlice.reducer;
