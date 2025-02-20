import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material';
import {
  Computer,
  Person,
  AttachMoney,
  Schedule
} from '@mui/icons-material';
import { AdminLayout } from '../../components/admin';
import { StatCard, BookingChart } from '../../components/admin/dashboard';
import api from '../../services/api';
import socketClient from '../../services/socketClient';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalComputers: 0,
    activeComputers: 0,
    totalUsers: 0,
    dailyRevenue: 0,
    activeBookings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    initializeSocket();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Statistika yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeSocket = () => {
    socketClient.connect();
    socketClient.subscribeToBookings(null, true);
    
    socketClient.on('booking_update', () => {
      loadDashboardData();
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mb: 4 }}>
          Admin Panel
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Kompyuterlar"
              value={stats.totalComputers}
              icon={<Computer />}
              color="#1976d2"
              subtitle={`${stats.activeComputers} ta band`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Foydalanuvchilar"
              value={stats.totalUsers}
              icon={<Person />}
              color="#2e7d32"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Bugungi daromad"
              value={`${stats.dailyRevenue.toLocaleString()} so'm`}
              icon={<AttachMoney />}
              color="#ed6c02"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Faol buyurtmalar"
              value={stats.activeBookings}
              icon={<Schedule />}
              color="#9c27b0"
            />
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Daromad statistikasi
              </Typography>
              <BookingChart />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </AdminLayout>
  );
};

export default AdminDashboard; 