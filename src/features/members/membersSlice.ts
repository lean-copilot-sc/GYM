import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type MemberSummary = {
  id: string;
  name: string;
  membershipType: string;
  status: 'active' | 'inactive';
};

export type MembersState = {
  list: MemberSummary[];
};

const initialState: MembersState = {
  list: [
    { id: 'm-1', name: 'Rahul Sharma', membershipType: 'Gold', status: 'active' },
    { id: 'm-2', name: 'Priya Patel', membershipType: 'Silver', status: 'active' }
  ]
};

const membersSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {
    setMembers(state: MembersState, action: PayloadAction<MemberSummary[]>) {
      state.list = action.payload;
    }
  }
});

export const { setMembers } = membersSlice.actions;
export const membersReducer = membersSlice.reducer;
