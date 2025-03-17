import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Chip,
  Alert
} from '@mui/material';
import {
  Security,
  Logout,
  Edit,
  Delete,
  Computer,
  AccessTime,
  LocationOn,
  DevicesOther
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [statistics, setStatistics] = useState({
    totalBookings: 0,
    totalHours: 0,
    favoriteZone: '',
    totalSpent: 0
  });
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [profileDialog, setProfileDialog] = useState(false);
  const [avatarDialog, setAvatarDialog] = useState(false);
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSessions();
    loadStatistics();
  }, []);

  const loadSessions = async () => {
    try {
      const response = await api.get('/user/sessions');
      setSessions(response.data);
    } catch (error) {
      console.error('Sessiyalarni yuklashda xatolik:', error);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await api.get('/user/statistics');
      setStatistics(response.data);
    } catch (error) {
      console.error('Statistikani yuklashda xatolik:', error);
    }
  };

  const handlePasswordChange = async () => {
    try {
      if (password.new !== password.confirm) {
        setError('Yangi parollar mos kelmadi');
        return;
      }

      await api.put('/user/password', {
        currentPassword: password.current,
        newPassword: password.new
      });

      setPasswordDialog(false);
      setPassword({ current: '', new: '', confirm: '' });
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Xatolik yuz berdi');
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const response = await api.put('/user/profile', profileData);
      updateUser(response.data);
      setProfileDialog(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Xatolik yuz berdi');
    }
  };

  const handleAvatarUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('avatar', avatar);

      const response = await api.put('/user/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      updateUser(response.data);
      setAvatarDialog(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Xatolik yuz berdi');
    }
  };

  const handleSessionTerminate = async (sessionId) => {
    try {
      await api.delete(`/user/sessions/${sessionId}`);
      loadSessions();
    } catch (error) {
      console.error('Sessiyani o\'chirishda xatolik:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Profil ma'lumotlari */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              src={user?.avatar}
              sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
            />
            <Typography variant="h5" gutterBottom>
              {user?.name}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              {user?.email}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setProfileDialog(true)}
                sx={{ mr: 1 }}
              >
                Tahrirlash
              </Button>
              <Button
                variant="outlined"
                startIcon={<Security />}
                onClick={() => setPasswordDialog(true)}
              >
                Parol
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Statistika */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Statistika
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4">{statistics.totalBookings}</Typography>
                  <Typography color="textSecondary">Buyurtmalar</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4">{statistics.totalHours}</Typography>
                  <Typography color="textSecondary">Soatlar</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4">
                    {statistics.totalSpent.toLocaleString()} so'm
                  </Typography>
                  <Typography color="textSecondary">Sarflangan</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4">{statistics.favoriteZone}</Typography>
                  <Typography color="textSecondary">Sevimli zona</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Faol sessiyalar */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Faol sessiyalar
            </Typography>
            <List>
              {sessions.map((session) => (
                <React.Fragment key={session._id}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <DevicesOther sx={{ mr: 1 }} />
                          {session.deviceInfo}
                          {session.current && (
                            <Chip
                              label="Joriy sessiya"
                              color="primary"
                              size="small"
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <AccessTime sx={{ fontSize: 16, mr: 0.5 }} />
                            {new Date(session.loginTime).toLocaleString()}
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <LocationOn sx={{ fontSize: 16, mr: 0.5 }} />
                            {session.location} ({session.ip})
                          </Box>
                        </Box>
                      }
                    />
                    {!session.current && (
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleSessionTerminate(session._id)}
                        >
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    )}
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Parol o'zgartirish dialogi */}
      <Dialog open={passwordDialog} onClose={() => setPasswordDialog(false)}>
        <DialogTitle>Parolni o'zgartirish</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            fullWidth
            label="Joriy parol"
            type="password"
            value={password.current}
            onChange={(e) => setPassword({ ...password, current: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Yangi parol"
            type="password"
            value={password.new}
            onChange={(e) => setPassword({ ...password, new: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Yangi parolni tasdiqlang"
            type="password"
            value={password.confirm}
            onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialog(false)}>Bekor qilish</Button>
          <Button onClick={handlePasswordChange} variant="contained">
            O'zgartirish
          </Button>
        </DialogActions>
      </Dialog>

      {/* Profil tahrirlash dialogi */}
      <Dialog open={profileDialog} onClose={() => setProfileDialog(false)}>
        <DialogTitle>Profilni tahrirlash</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            fullWidth
            label="Ism"
            value={profileData.name}
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            value={profileData.email}
            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Telefon"
            value={profileData.phone}
            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProfileDialog(false)}>Bekor qilish</Button>
          <Button onClick={handleProfileUpdate} variant="contained">
            Saqlash
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rasm yuklash dialogi */}
      <Dialog open={avatarDialog} onClose={() => setAvatarDialog(false)}>
        <DialogTitle>Profil rasmini o'zgartirish</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files[0])}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAvatarDialog(false)}>Bekor qilish</Button>
          <Button onClick={handleAvatarUpdate} variant="contained">
            Yuklash
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile; 