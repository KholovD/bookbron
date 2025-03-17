import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Box,
  Chip,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Edit,
  Block,
  CheckCircle,
  Search,
  Send
} from '@mui/icons-material';
import { AdminLayout } from '../../components/admin';
import { UserDialog } from '../../components/admin/users';
import api from '../../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Foydalanuvchilarni yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await api.put(`/admin/users/${userId}/status`, { status: newStatus });
      loadUsers();
    } catch (error) {
      console.error('Status o\'zgartirishda xatolik:', error);
    }
  };

  const handleSave = async (userData) => {
    try {
      if (selectedUser) {
        await api.put(`/admin/users/${selectedUser._id}`, userData);
      }
      setDialogOpen(false);
      setSelectedUser(null);
      loadUsers();
    } catch (error) {
      console.error('Foydalanuvchini saqlashda xatolik:', error);
    }
  };

  const handleSendNotification = async (userId) => {
    try {
      await api.post(`/admin/notifications/send`, {
        userId,
        title: 'Admin xabari',
        message: 'Sizga yangi xabar keldi'
      });
    } catch (error) {
      console.error('Xabar yuborishda xatolik:', error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.phone.includes(search)
  );

  return (
    <AdminLayout>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Foydalanuvchilar
          </Typography>
          
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
          />
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ism</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Telefon</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Ro'yxatdan o'tgan sana</TableCell>
                <TableCell>Amallar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.status === 'active' ? 'Faol' : 'Bloklangan'}
                      color={user.status === 'active' ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(user)}>
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleStatusChange(
                        user._id,
                        user.status === 'active' ? 'blocked' : 'active'
                      )}
                    >
                      {user.status === 'active' ? <Block /> : <CheckCircle />}
                    </IconButton>
                    <IconButton onClick={() => handleSendNotification(user._id)}>
                      <Send />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <UserDialog
          open={dialogOpen}
          user={selectedUser}
          onClose={() => {
            setDialogOpen(false);
            setSelectedUser(null);
          }}
          onSave={handleSave}
        />
      </Container>
    </AdminLayout>
  );
};

export default Users; 