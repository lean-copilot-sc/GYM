"use client";

import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { store } from '@/store/store';
import { useMemo } from 'react';
import { createTheme } from '@mui/material/styles';

export default function Providers({ children }: PropsWithChildren) {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'light',
          primary: {
            main: '#1e88e5'
          },
          secondary: {
            main: '#8e24aa'
          }
        },
        shape: {
          borderRadius: 12
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                borderRadius: 10
              }
            }
          }
        }
      }),
    []
  );

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </Provider>
  );
}
