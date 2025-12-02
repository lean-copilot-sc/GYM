import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PaymentRecord = {
  id: string;
  memberName: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate?: string;
};

export type PaymentsState = {
  invoices: PaymentRecord[];
};

const initialState: PaymentsState = {
  invoices: [
    { id: 'pay-1', memberName: 'Priya Patel', amount: 1200, status: 'paid' },
    { id: 'pay-2', memberName: 'Rahul Sharma', amount: 900, status: 'pending', dueDate: new Date().toISOString() }
  ]
};

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    setPayments(state: PaymentsState, action: PayloadAction<PaymentRecord[]>) {
      state.invoices = action.payload;
    }
  }
});

export const { setPayments } = paymentsSlice.actions;
export const paymentsReducer = paymentsSlice.reducer;
