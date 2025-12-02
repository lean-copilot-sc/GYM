"use client";

import { PropsWithChildren, useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { AppDrawer } from '@/components/layout/AppDrawer';

const DRAWER_WIDTH = 280;

export default function MainLayout({ children }: PropsWithChildren) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerVariantProps = isMobile
    ? {
        variant: 'temporary' as const,
        open: mobileOpen,
        onClose: () => setMobileOpen(false),
        ModalProps: { keepMounted: true }
      }
    : {
        variant: 'permanent' as const,
        open: true
      };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ ml: { lg: `${DRAWER_WIDTH}px` }, width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` } }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isMobile && (
              <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(true)}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" component="div">
              Control Center
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit">
              <NotificationsIcon />
            </IconButton>
            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.3)' }} />
            <IconButton color="inherit">
              <AccountCircleIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <AppDrawer
        {...drawerVariantProps}
        PaperProps={{ sx: { border: 0, bgcolor: 'background.paper' } }}
        sx={{
          display: { xs: 'block', lg: 'block' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            position: isMobile ? undefined : 'relative'
          }
        }}
        onNavigate={() => setMobileOpen(false)}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: { xs: 2, md: 3 },
          mt: { xs: '64px', lg: 0 },
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          minHeight: '100vh'
        }}
      >
        <Toolbar sx={{ display: { xs: 'none', lg: 'block' } }} />
        {children}
      </Box>
    </Box>
  );
}
