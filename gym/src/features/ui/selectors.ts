import type { RootState } from '@/store/store';

export const selectCurrentTheme = (state: RootState) => state.ui.themeMode;
export const selectSnackbar = (state: RootState) => state.ui.snackbar;
