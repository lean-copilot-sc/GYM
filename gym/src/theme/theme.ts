"use client";

import { createTheme } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';

const baseComponents = {
  MuiButton: {
    defaultProps: {
      disableElevation: true
    },
    styleOverrides: {
      root: {
        borderRadius: 12,
        textTransform: 'none',
        fontWeight: 600
      }
    }
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 20,
        backgroundImage: 'linear-gradient(145deg, rgba(115,102,255,0.12), rgba(15,23,42,0.85))',
        border: '1px solid rgba(120, 123, 185, 0.25)',
        boxShadow: '0 20px 40px rgba(15, 23, 42, 0.4)'
      }
    }
  }
} as const;

export const createAppTheme = (mode: 'light' | 'dark' = 'dark') => {
  const paletteOverrides =
    mode === 'dark'
      ? {
          mode: 'dark' as const,
          background: {
            default: '#0f172a',
            paper: '#111c3c'
          }
        }
      : {
          mode: 'light' as const,
          background: {
            default: '#f8fafc',
            paper: '#ffffff'
          }
        };

  const theme = createTheme({
    palette: {
      ...paletteOverrides,
      primary: {
        main: '#7366ff'
      },
      secondary: {
        main: '#6c5dd3'
      },
      success: {
        main: '#51d18f'
      },
      error: {
        main: '#ff6b6b'
      },
      warning: {
        main: '#fdb64d'
      }
    },
    typography: {
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 }
    },
    shape: {
      borderRadius: 16
    },
    components: baseComponents
  });

  return deepmerge(theme, {});
};
