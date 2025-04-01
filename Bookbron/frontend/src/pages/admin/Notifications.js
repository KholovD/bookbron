import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton
} from '@mui/material';
import {
  Send,
  Delete,
  Refresh,
  Group,
  Person
} from '@mui/icons-material';
import { AdminLayout } from '../../components/admin';
import { NotificationDialog } from '../../components/admin/notifications';
import api from '../../services/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
    loadUsers();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await api.get('/admin/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Xabarlarni yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Foydalanuvchilarni yuklashda xatolik:', error);
    }
  };

  const handleSendNotification = async (notificationData) => {
    try {
      await api.post('/admin/notifications/send', {
        ...notificationData,
        userIds: selectedUsers
      });
      setDialogOpen(false);
      setSelectedUsers([]);
      loadNotifications();
    } catch (error) {
      console.error('Xabar yuborishda xatolik:', error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await api.delete(`/admin/notifications/${id}`);
      loadNotifications();
    } catch (error) {
      console.error('Xabarni o\'chirishda xatolik:', error);
    }
  };

  const handleResend = async (notification) => {
    try {
      await api.post(`/admin/notifications/${notification._id}/resend`);
      loadNotifications();
    } catch (error) {
      console.error('Xabarni qayta yuborishda xatolik:', error);
    }
  };

  return (
    <AdminLayout>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Xabarlar
          </Typography>

          <Grid container spacing={2}>
            <Grid item>
              <Button
                variant="contained"
                startIcon={<Group />}
                onClick={() => setDialogOpen(true)}
              >
                Yangi xabar
              </Button>
            </Grid>
          </Grid>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sarlavha</TableCell>
                <TableCell>Xabar</TableCell>
                <TableCell>Turi</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Yuborilgan sana</TableCell>
                <TableCell>Qabul qiluvchilar</TableCell>
                <TableCell>Amallar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notifications.map((notification) => (
                <TableRow key={notification._id}>
                  <TableCell>{notification.title}</TableCell>
                  <TableCell>{notification.message}</TableCell>
                  <TableCell>
                    <Chip
                      label={notification.type === 'email' ? 'Email' : 'Telegram'}
                      color="primary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusText(notification.status)}
                      color={getStatusColor(notification.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(notification.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {notification.recipients.length} ta foydalanuvchi
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleResend(notification)}
                      disabled={notification.status === 'sending'}
                    >
                      <Refresh />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteNotification(notification._id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <NotificationDialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
            setSelectedUsers([]);
          }}
          onSend={handleSendNotification}
          users={users}
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
        />
      </Container>
    </AdminLayout>
  );
};

const getStatusText = (status) => {
  switch (status) {
    case 'sending': return 'Yuborilmoqda';
    case 'sent': return 'Yuborildi';
    case 'failed': return 'Xatolik';
    default: return status;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'sending': return 'warning';
    case 'sent': return 'success';
    case 'failed': return 'error';
    default: return 'default';
  }
};

export default Notifications; 