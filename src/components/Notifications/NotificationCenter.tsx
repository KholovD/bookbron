import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  Divider,
  Button,
  Theme,
} from '@mui/material';
import {
  Notifications,
  Close,
  Info,
  Warning,
  Error,
  CheckCircle,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';

interface Notification {
  id: string;
  type: 'error' | 'warning' | 'success' | 'info';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// TODO: Create useNotifications hook
const useNotifications = () => {
  return {
    notifications: [] as Notification[],
    markAsRead: (id: string) => {},
    clearAll: () => {},
    unreadCount: 0
  };
};

const NotificationDrawer = styled(Drawer)`
  .MuiDrawer-paper {
    width: 360px;
  }
`;

interface NotificationItemProps {
  read?: boolean;
}

const NotificationItem = styled(ListItem)<NotificationItemProps>`
  opacity: ${({ read }) => (read ? 0.7 : 1)};
  background: ${({ read, theme }) =>
    read ? 'transparent' : theme.palette.action.hover};
  margin: 4px 0;
  border-radius: 8px;
`;

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'error':
      return <Error color="error" />;
    case 'warning':
      return <Warning color="warning" />;
    case 'success':
      return <CheckCircle color="success" />;
    default:
      return <Info color="info" />;
  }
};

export const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const {
    notifications,
    markAsRead,
    clearAll,
    unreadCount,
  } = useNotifications();

  return (
    <>
      <IconButton color="inherit" onClick={() => setIsOpen(true)}>
        <Badge badgeContent={unreadCount} color="error">
          <Notifications />
        </Badge>
      </IconButton>

      <NotificationDrawer
        anchor="right"
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2
          }}>
            <Typography variant="h6">
              Bildirishnomalar
            </Typography>
            <IconButton onClick={() => setIsOpen(false)}>
              <Close />
            </IconButton>
          </Box>

          <AnimatePresence>
            {notifications.length > 0 ? (
              <>
                <List>
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <NotificationItem
                        read={notification.read}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <ListItemIcon>
                          {getNotificationIcon(notification.type)}
                        </ListItemIcon>
                        <ListItemText
                          primary={notification.title}
                          secondary={
                            <>
                              {notification.message}
                              <Typography
                                variant="caption"
                                display="block"
                                color="textSecondary"
                              >
                                {new Date(notification.createdAt).toLocaleString()}
                              </Typography>
                            </>
                          }
                        />
                      </NotificationItem>
                    </motion.div>
                  ))}
                </List>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ textAlign: 'center' }}>
                  <Button
                    variant="text"
                    onClick={clearAll}
                  >
                    Barchasini o'qilgan deb belgilash
                  </Button>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 4,
                  color: 'text.secondary'
                }}
              >
                <Info sx={{ fontSize: 48, mb: 2 }} />
                <Typography>
                  Yangi bildirishnomalar yo'q
                </Typography>
              </Box>
            )}
          </AnimatePresence>
        </Box>
      </NotificationDrawer>
    </>
  );
};