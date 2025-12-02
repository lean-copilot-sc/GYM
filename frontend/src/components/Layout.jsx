import { useMemo, useState } from 'react';
import { Link as RouterLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventNoteIcon from '@mui/icons-material/EventNote';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PaymentsIcon from '@mui/icons-material/Payments';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import PersonIcon from '@mui/icons-material/Person';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../providers/AuthProvider.jsx';

const drawerWidth = 260;

const iconByRoute = {
  '/': <DashboardIcon fontSize="small" />,
  '/members': <PeopleIcon fontSize="small" />,
  '/attendance': <AssignmentIcon fontSize="small" />,
  '/appointments': <EventNoteIcon fontSize="small" />,
  '/progress': <FactCheckIcon fontSize="small" />,
  '/payments': <PaymentsIcon fontSize="small" />,
  '/profile': <PersonIcon fontSize="small" />
};

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = useMemo(() => {
    const items = [
      { to: '/', label: 'Dashboard' },
      { to: '/attendance', label: 'Attendance', roles: ['member', 'admin', 'trainer', 'physio'] },
      { to: '/appointments', label: 'Appointments' },
      { to: '/progress', label: 'Progress' },
      { to: '/payments', label: 'Payments', roles: ['admin', 'member'] },
      { to: '/profile', label: 'Profile' }
    ];

    if (user?.role === 'admin' || user?.role === 'trainer' || user?.role === 'physio') {
      items.splice(1, 0, { to: '/members', label: 'Members' });
    }

    return items.filter((item) => !item.roles || item.roles.includes(user?.role));
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 3, py: 3 }}>
        <Avatar variant="rounded" sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
          <FitnessCenterIcon fontSize="small" />
        </Avatar>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            FlexCare
          </Typography>
          <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1 }}>
            Gym & Physio
          </Typography>
        </Box>
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1, py: 1 }}>
        {links.map((link) => (
          <ListItem key={link.to} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={link.to}
              selected={location.pathname === link.to}
              onClick={() => setMobileOpen(false)}
              sx={{ borderRadius: 2, mx: 1, my: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>{iconByRoute[link.to] || <DashboardIcon fontSize="small" />}</ListItemIcon>
              <ListItemText primary={link.label} primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ px: 3, py: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {user?.name}
        </Typography>
        <Typography variant="caption" color="text.disabled">
          {user?.role}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Sign out" primaryTypographyProps={{ fontWeight: 600 }} />
          </ListItemButton>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          zIndex: (themeInstance) => themeInstance.zIndex.drawer + 1,
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {!isDesktop && (
            <IconButton color="primary" edge="start" onClick={() => setMobileOpen((prev) => !prev)}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" fontWeight={700} sx={{ display: { xs: 'none', lg: 'block' } }}>
            FlexCare Operations Console
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
            Welcome back, {user?.name}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }} aria-label="navigation">
        <Drawer
          variant={isDesktop ? 'permanent' : 'temporary'}
          open={isDesktop ? true : mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              borderRight: 0,
              backgroundImage: (themeInstance) =>
                isDesktop
                  ? `linear-gradient(180deg, ${themeInstance.palette.grey[100]} 0%, ${themeInstance.palette.background.paper} 100%)`
                  : undefined
            }
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: '100%', lg: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: 7, sm: 8 },
          px: { xs: 2, md: 4 },
          py: { xs: 3, md: 4 }
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
