import { configureStore } from '@reduxjs/toolkit';
import uiReducer from '@/features/ui/uiSlice';
import analyticsReducer from '@/features/analytics/analyticsSlice';
import formsReducer from '@/features/forms/formsSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    analytics: analyticsReducer,
    forms: formsReducer
  }
});

type Store = typeof store;
export type RootState = ReturnType<Store['getState']>;
export type AppDispatch = Store['dispatch'];
