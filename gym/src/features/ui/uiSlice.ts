import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';

export type SnackbarState = {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
};

export type UiState = {
  sidebarOpen: boolean;
  snackbar: SnackbarState;
  themeMode: 'light' | 'dark';
};

const initialState: UiState = {
  sidebarOpen: true,
  snackbar: {
    open: false,
    message: '',
    severity: 'info'
  },
  themeMode: 'dark'
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    showSnackbar(state, action: PayloadAction<Omit<SnackbarState, 'open'>>) {
      state.snackbar = { open: true, ...action.payload };
    },
    hideSnackbar(state) {
      state.snackbar.open = false;
    },
    toggleDarkMode(state) {
      state.themeMode = state.themeMode === 'dark' ? 'light' : 'dark';
    }
  }
});

export const { toggleSidebar, setSidebarOpen, showSnackbar, hideSnackbar, toggleDarkMode } = uiSlice.actions;
export const selectSidebarOpen = (state: RootState) => state.ui.sidebarOpen;
export default uiSlice.reducer;
