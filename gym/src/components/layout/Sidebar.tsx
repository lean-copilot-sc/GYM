"use client";

import { useMemo } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TableChartIcon from '@mui/icons-material/TableChart';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SettingsIcon from '@mui/icons-material/Settings';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { selectSidebarOpen, setSidebarOpen } from '@/features/ui/uiSlice';

const DRAWER_WIDTH = 288;

const NAV_ITEMS = [
  { label: 'Dashboard', icon: DashboardIcon, href: '/dashboard' },
  { label: 'Forms', icon: FactCheckIcon, href: '/forms' },
  { label: 'Tables', icon: TableChartIcon, href: '/tables' },
  { label: 'Charts', icon: ShowChartIcon, href: '/charts' },
  { label: 'Docs', icon: InsertDriveFileIcon, href: '/docs' },
  { label: 'Settings', icon: SettingsIcon, href: '/settings' }
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector(selectSidebarOpen);

  const navContent = useMemo(
    () => (
      <List sx={{ px: 1 }}>
        {NAV_ITEMS.map((item) => {
          const IconComponent = item.icon;
          const active = pathname?.startsWith(item.href);
          return (
            <ListItemButton
              key={item.label}
              sx={{
                mb: 1,
                borderRadius: 2,
                bgcolor: active ? 'primary.main' : 'transparent',
                color: active ? 'common.white' : 'text.secondary',
                '&:hover': {
                  bgcolor: active ? 'primary.dark' : 'rgba(255,255,255,0.06)'
                }
              }}
              selected={active}
              onClick={() => {
                router.push(item.href);
                dispatch(setSidebarOpen(false));
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 42 }}>
                <IconComponent />
              </ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItemButton>
          );
        })}
      </List>
    ),
    [pathname, router, dispatch]
  );

  return (
    <Drawer
      variant="persistent"
      open={sidebarOpen}
      onClose={() => dispatch(setSidebarOpen(false))}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          background: 'linear-gradient(195deg, #1a2141 0%, #0f172a 100%)',
          borderRight: '1px solid rgba(255,255,255,0.08)'
        }
      }}
    >
      <Toolbar sx={{ px: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            AblePro Clone
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Inspired Validation UI
          </Typography>
        </Box>
      </Toolbar>
      {navContent}
    </Drawer>
  );
}
