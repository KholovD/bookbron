import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import {
  BarChart,
  PieChart,
  LineChart,
  HeatMap
} from '../../components/admin/analytics';
import { AdminLayout } from '../../components/admin';
import api from '../../services/api';

const Analytics = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date()
  });
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    averageBookingDuration: 0,
    popularHours: [],
    computerUtilization: [],
    zonePerformance: [],
    userActivity: [],
    dailyStats: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      const response = await api.get('/admin/analytics', {
        params: {
          startDate: dateRange.startDate.toISOString(),
          endDate: dateRange.endDate.toISOString()
        }
      });
      setMetrics(response.data);
    } catch (error) {
      console.error('Analitika yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = async (format) => {
    try {
      const response = await api.get(`/admin/analytics/export/${format}`, {
        params: {
          startDate: dateRange.startDate.toISOString(),
          endDate: dateRange.endDate.toISOString()
        },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `analytics-${format}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Ma\'lumotlarni eksport qilishda xatolik:', error);
    }
  };

  return (
    <AdminLayout>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Analitika
          </Typography>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <DatePicker
                label="Boshlanish sanasi"
                value={dateRange.startDate}
                onChange={(date) => setDateRange(prev => ({ ...prev, startDate: date }))}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <DatePicker
                label="Tugash sanasi"
                value={dateRange.endDate}
                onChange={(date) => setDateRange(prev => ({ ...prev, endDate: date }))}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                onClick={() => exportData('excel')}
                sx={{ mr: 1 }}
              >
                Excel
              </Button>
              <Button
                variant="contained"
                onClick={() => exportData('pdf')}
              >
                PDF
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={3}>
          {/* Daromad grafigi */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Daromad dinamikasi
              </Typography>
              <LineChart data={metrics.dailyStats} />
            </Paper>
          </Grid>

          {/* Kompyuterlar bandligi */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Kompyuterlar bandligi
              </Typography>
              <PieChart data={metrics.computerUtilization} />
            </Paper>
          </Grid>

          {/* Zonalar bo'yicha tahlil */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Zonalar bo'yicha tahlil
              </Typography>
              <BarChart data={metrics.zonePerformance} />
            </Paper>
          </Grid>

          {/* Vaqt bo'yicha band bo'lish */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Vaqt bo'yicha band bo'lish
              </Typography>
              <HeatMap data={metrics.popularHours} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </AdminLayout>
  );
};

export default Analytics; 