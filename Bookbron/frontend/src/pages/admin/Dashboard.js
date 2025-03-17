import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Refresh,
  Warning,
  CheckCircle,
  Computer,
  Person,
  AttachMoney,
  Timeline,
  Notifications,
  Block
} from '@mui/icons-material';
import { AdminLayout } from '../../components/admin';
import { RevenueChart, ActivityChart } from '../../components/admin/dashboard';
import api from '../../services/api';
import socketClient from '../../services/socketClient';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    todayRevenue: 0,
    activeBookings: 0,
    totalComputers: 0,
    activeComputers: 0,
    blockedComputers: 0,
    totalUsers: 0,
    activeUsers: 0,
    warnings: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    initializeSocket();

    return () => {
      socketClient.disconnect();
    };
  }, []);

  const initializeSocket = () => {
    socketClient.connect();
    socketClient.on('computer_warning', handleWarning);
    socketClient.on('booking_created', handleBookingCreated);
    socketClient.on('payment_received', handlePaymentReceived);
  };

  const loadDashboardData = async () => {
    try {
      const [statsResponse, activitiesResponse, alertsResponse] = await Promise.all([
        api.get('/admin/dashboard/stats'),
        api.get('/admin/dashboard/activities'),
        api.get('/admin/dashboard/alerts')
      ]);

      setStats(statsResponse.data);
      setRecentActivities(activitiesResponse.data);
      setAlerts(alertsResponse.data);
    } catch (error) {
      console.error('Dashboard ma\'lumotlarini yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWarning = (data) => {
    setAlerts(prev => [data, ...prev].slice(0, 5));
    setStats(prev => ({ ...prev, warnings: prev.warnings + 1 }));
  };

  const handleBookingCreated = (data) => {
    setStats(prev => ({
      ...prev,
      activeBookings: prev.activeBookings + 1,
      activeComputers: prev.activeComputers - 1
    }));
    loadDashboardData();
  };

  const handlePaymentReceived = (data) => {
    setStats(prev => ({
      ...prev,
      todayRevenue: prev.todayRevenue + data.amount,
      totalRevenue: prev.totalRevenue + data.amount
    }));
    loadDashboardData();
  };

  const handleAlertDismiss = async (alertId) => {
    try {
      await api.put(`/admin/alerts/${alertId}/dismiss`);
      setAlerts(prev => prev.filter(alert => alert._id !== alertId));
      setStats(prev => ({ ...prev, warnings: prev.warnings - 1 }));
    } catch (error) {
      console.error('Ogohlantirishni o\'chirishda xatolik:', error);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        {React.createElement(icon, { sx: { color, mr: 1 } })}
        <Typography color="textSecondary">{title}</Typography>
      </Box>
      <Typography variant="h4">{value}</Typography>
    </Paper>
  );

  if (loading) {
    return (
      <AdminLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">Boshqaruv paneli</Typography>
          <Button
            startIcon={<Refresh />}
            onClick={loadDashboardData}
          >
            Yangilash
          </Button>
        </Box>

        {/* Statistika */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Bugungi daromad"
              value={`${stats.todayRevenue.toLocaleString()} so'm`}
              icon={AttachMoney}
              color="success.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Faol buyurtmalar"
              value={stats.activeBookings}
              icon={Timeline}
              color="primary.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Band kompyuterlar"
              value={`${stats.activeComputers}/${stats.totalComputers}`}
              icon={Computer}
              color="info.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Ogohlantirishlar"
              value={stats.warnings}
              icon={Warning}
              color="warning.main"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Daromad grafigi */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Daromad dinamikasi
              </Typography>
              <RevenueChart />
            </Paper>
          </Grid>

          {/* Ogohlantirishlar */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Ogohlantirishlar
              </Typography>
              <List>
                {alerts.map((alert) => (
                  <React.Fragment key={alert._id}>
                    <ListItem
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() => handleAlertDismiss(alert._id)}
                        >
                          <CheckCircle />
                        </IconButton>
                      }
                    >
                      <ListItemIcon>
                        <Warning color="warning" />
                      </ListItemIcon>
                      <ListItemText
                        primary={alert.title}
                        secondary={new Date(alert.createdAt).toLocaleString()}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Faollik grafigi */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Faollik
              </Typography>
              <ActivityChart />
            </Paper>
          </Grid>

          {/* So'nggi harakatlar */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                So'nggi harakatlar
              </Typography>
              <List>
                {recentActivities.map((activity) => (
                  <React.Fragment key={activity._id}>
                    <ListItem>
                      <ListItemIcon>
                        {activity.type === 'booking' && <Computer />}
                        {activity.type === 'user' && <Person />}
                        {activity.type === 'payment' && <AttachMoney />}
                        {activity.type === 'warning' && <Warning />}
                        {activity.type === 'block' && <Block />}
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.description}
                        secondary={new Date(activity.createdAt).toLocaleString()}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </AdminLayout>
  );
};

export default Dashboard; 