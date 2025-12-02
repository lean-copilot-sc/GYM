"use client";

import { ReactNode, useMemo } from 'react';
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  Avatar,
  Stack,
  ThemeProvider,
  CssBaseline,
  Snackbar,
  Alert
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SearchIcon from '@mui/icons-material/Search';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { selectSidebarOpen, setSidebarOpen, toggleDarkMode, hideSnackbar } from '@/features/ui/uiSlice';
import { selectCurrentTheme, selectSnackbar } from '@/features/ui/selectors';
import { usePathname } from 'next/navigation';
import { createAppTheme } from '@/theme/theme';

const DRAWER_WIDTH = 288;

type AppShellProps = {
  children: ReactNode;
  title?: string;
};

export function AppShell({ children, title }: AppShellProps) {
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector(selectSidebarOpen);
  const currentTheme = useAppSelector(selectCurrentTheme);
  const snackbar = useAppSelector(selectSnackbar);
  const pathname = usePathname();

  const resolvedTitle = useMemo(() => {
    if (title) return title;
    if (!pathname) return 'Able Pro Inspired Dashboard';
    const mapping: Record<string, string> = {
      '/dashboard': 'Dashboard Overview',
      '/forms': 'Validation Playground',
      '/tables': 'Submission Tables',
      '/charts': 'Analytics Visualizations',
      '/docs': 'Documentation',
      '/settings': 'Workspace Settings'
    };
    return mapping[pathname] ?? 'Able Pro Inspired Dashboard';
  }, [pathname, title]);

  const theme = useMemo(() => createAppTheme(currentTheme), [currentTheme]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <Sidebar />

        <AppBar
          position="fixed"
          color="transparent"
          elevation={0}
          sx={{
            ml: sidebarOpen ? `${DRAWER_WIDTH}px` : 0,
            width: sidebarOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%',
            borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
            backdropFilter: 'blur(6px)',
            backgroundColor: 'rgba(15, 23, 42, 0.72)'
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <IconButton
                color="inherit"
                onClick={() => dispatch(setSidebarOpen(!sidebarOpen))}
                edge="start"
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" fontWeight={700} sx={{ display: { xs: 'none', sm: 'block' } }}>
                {resolvedTitle}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton color="inherit">
                <SearchIcon />
              </IconButton>
              <IconButton color="inherit">
                <NotificationsNoneIcon />
              </IconButton>
              <IconButton color="inherit" onClick={() => dispatch(toggleDarkMode())}>
                {currentTheme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
              <Avatar sx={{ width: 36, height: 36, bgcolor: theme.palette.primary.main }}>AP</Avatar>
            </Stack>
          </Toolbar>
        </AppBar>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            px: { xs: 2, md: 4 },
            py: { xs: 12, md: 14 },
            ml: sidebarOpen ? `${DRAWER_WIDTH}px` : 0,
            transition: (t) => t.transitions.create(['margin', 'width'], { duration: t.transitions.duration.shorter })
          }}
        >
          <Toolbar />
          {children}
        </Box>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => dispatch(hideSnackbar())}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => dispatch(hideSnackbar())}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
