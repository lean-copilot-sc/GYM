"use client";

import {
  Drawer,
  DrawerProps,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  Collapse
} from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useState } from 'react';

export type NavItem = {
  label: string;
  href?: string;
  children?: NavItem[];
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard' },
  {
    label: 'Members',
    children: [
      { label: 'Member List', href: '/members' },
      { label: 'Add Member', href: '/members/add' },
      { label: 'Progress Tracking', href: '/members/progress' },
      { label: 'Attendance', href: '/members/attendance' }
    ]
  },
  { label: 'Membership Plans', href: '/plans' },
  {
    label: 'Attendance',
    children: [
      { label: 'Gym Attendance', href: '/attendance/gym' },
      { label: 'Physio Attendance', href: '/attendance/physio' },
      { label: 'Reports', href: '/attendance/reports' }
    ]
  },
  {
    label: 'Physiotherapy',
    children: [
      { label: 'Patients', href: '/physiotherapy' },
      { label: 'Appointments', href: '/physiotherapy/appointments' },
      { label: 'Sessions', href: '/physiotherapy/sessions' },
      { label: 'Reports', href: '/physiotherapy/reports' }
    ]
  },
  {
    label: 'Appointments',
    children: [
      { label: 'Training', href: '/appointments/training' },
      { label: 'Physiotherapy', href: '/appointments/physio' },
      { label: 'Calendar', href: '/appointments/calendar' }
    ]
  },
  { label: 'Trainers / Staff', href: '/trainers' },
  {
    label: 'Payments',
    children: [
      { label: 'Invoices', href: '/payments' },
      { label: 'Add Payment', href: '/payments/add' },
      { label: 'Expenses', href: '/payments/expenses' },
      { label: 'Reports', href: '/payments/reports' }
    ]
  },
  {
    label: 'Inventory',
    children: [
      { label: 'Supplements', href: '/inventory/supplements' },
      { label: 'Equipments', href: '/inventory/equipments' }
    ]
  },
  { label: 'Reports', href: '/reports' },
  { label: 'Notifications', href: '/notifications' },
  { label: 'Settings', href: '/settings' }
];

export type AppDrawerProps = DrawerProps & {
  onNavigate?: () => void;
};

export function AppDrawer({ onNavigate, anchor = 'left', ...props }: AppDrawerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const handleToggle = (label: string) => {
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleNavigate = (href?: string) => {
    if (!href) return;
    router.push(href);
    onNavigate?.();
  };

  return (
    <Drawer anchor={anchor} {...props}>
      <Toolbar sx={{ gap: 1 }}>
        <FitnessCenterIcon color="primary" />
        <Box>
          <Typography variant="h6" fontWeight={700} lineHeight={1}>
            FlexiCare
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Gym & Physio Suite
          </Typography>
        </Box>
      </Toolbar>
      <List sx={{ px: 1 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = item.href ? pathname?.startsWith(item.href) : item.children?.some((child) => pathname?.startsWith(child.href ?? ''));

          if (item.children?.length) {
            const open = expanded[item.label] ?? Boolean(isActive);
            return (
              <Box key={item.label}>
                <ListItemButton selected={Boolean(isActive)} onClick={() => handleToggle(item.label)}>
                  <ListItemText primary={item.label} />
                  {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((child) => (
                      <ListItemButton
                        key={child.label}
                        sx={{ pl: 4 }}
                        selected={pathname === child.href}
                        onClick={() => handleNavigate(child.href)}
                      >
                        <ListItemText primary={child.label} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </Box>
            );
          }

          return (
            <ListItemButton key={item.label} selected={pathname === item.href} onClick={() => handleNavigate(item.href)}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
}
