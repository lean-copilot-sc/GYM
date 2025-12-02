import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type FormSubmission = {
  id: string;
  name: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
};

export type FormsState = {
  submissions: FormSubmission[];
};

const initialState: FormsState = {
  submissions: [
    { id: 'SUB-001', name: 'Employee Onboarding', status: 'approved', submittedAt: '2025-11-12' },
    { id: 'SUB-002', name: 'Vendor Contract', status: 'pending', submittedAt: '2025-11-25' }
  ]
};

const formsSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    addSubmission(state, action: PayloadAction<FormSubmission>) {
      state.submissions.unshift(action.payload);
    },
    updateSubmissionState(state, action: PayloadAction<Pick<FormSubmission, 'id' | 'status'>>) {
      const submission = state.submissions.find((item) => item.id === action.payload.id);
      if (submission) {
        submission.status = action.payload.status;
      }
    }
  }
});

export const { addSubmission, updateSubmissionState } = formsSlice.actions;
export default formsSlice.reducer;
