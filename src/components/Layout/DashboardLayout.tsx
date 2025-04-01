import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Computer,
  People,
  Payment,
  Assessment,
  Settings,
  Notifications,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import { useNavigate, useLocation } from 'react-router-dom';
import { NotificationCenter } from '../Notifications/NotificationCenter';

const drawerWidth = 240;

const StyledDrawer = styled(Drawer)`
  .MuiDrawer-paper {
    width: ${drawerWidth}px;
    box-sizing: border-box;
    background: ${({ theme }) => theme.palette.background.default};
    border-right: 1px solid ${({ theme }) => theme.palette.divider};
  }
`;

const StyledAppBar = styled(AppBar)`
  background: ${({ theme }) => theme.palette.background.paper};
  color: ${({ theme }) => theme.palette.text.primary};
  box-shadow: none;
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
`;

const MenuItem = styled(ListItem)<{ active?: boolean }>`
  background: ${({ active, theme }) => 
    active ? theme.palette.action.selected : 'transparent'};
  border-radius: 8px;
  margin: 4px 8px;
  width: calc(100% - 16px);

  &:hover {
    background: ${({ theme }) => theme.palette.action.hover};
  }
`;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Kompyuterlar', icon: <Computer />, path: '/computers' },
  { text: 'Foydalanuvchilar', icon: <People />, path: '/users' },
  { text: 'To\'lovlar', icon: <Payment />, path: '/payments' },
  { text: 'Hisobotlar', icon: <Assessment />, path: '/reports' },
  { text: 'Sozlamalar', icon: <Settings />, path: '/settings' },
];

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap>
          Internet Cafe
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <MenuItem
            key={item.text}
            button
            active={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </MenuItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <StyledAppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
          </Typography>
          <NotificationCenter />
        </Toolbar>
      </StyledAppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {isMobile ? (
          <StyledDrawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
          >
            {drawer}
          </StyledDrawer>
        ) : (
          <StyledDrawer
            variant="permanent"
            sx={{ display: { xs: 'none', sm: 'block' } }}
            open
          >
            {drawer}
          </StyledDrawer>
        )}
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
}; 