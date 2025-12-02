import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PhysioCase = {
  id: string;
  patientName: string;
  painScale: number;
  sessionsCompleted: number;
};

export type PhysiotherapyState = {
  cases: PhysioCase[];
};

const initialState: PhysiotherapyState = {
  cases: [
    { id: 'p-1', patientName: 'Neha Desai', painScale: 3, sessionsCompleted: 6 },
    { id: 'p-2', patientName: 'Arjun Mehta', painScale: 5, sessionsCompleted: 3 }
  ]
};

const physiotherapySlice = createSlice({
  name: 'physiotherapy',
  initialState,
  reducers: {
    setPhysioCases(state: PhysiotherapyState, action: PayloadAction<PhysioCase[]>) {
      state.cases = action.payload;
    }
  }
});

export const { setPhysioCases } = physiotherapySlice.actions;
export const physiotherapyReducer = physiotherapySlice.reducer;
