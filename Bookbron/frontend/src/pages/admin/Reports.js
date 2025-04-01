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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Download, Assessment } from '@mui/icons-material';
import { AdminLayout } from '../../components/admin';
import { RevenueChart, BookingChart } from '../../components/admin/reports';
import api from '../../services/api';

const Reports = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date()
  });
  const [reportType, setReportType] = useState('revenue');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReportData();
  }, [dateRange, reportType]);

  const loadReportData = async () => {
    try {
      const response = await api.get('/admin/reports', {
        params: {
          startDate: dateRange.startDate.toISOString(),
          endDate: dateRange.endDate.toISOString(),
          type: reportType
        }
      });
      setReportData(response.data);
    } catch (error) {
      console.error('Hisobot yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      const response = await api.get('/admin/reports/export', {
        params: {
          startDate: dateRange.startDate.toISOString(),
          endDate: dateRange.endDate.toISOString(),
          type: reportType,
          format
        },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${reportType}-${format}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Eksport qilishda xatolik:', error);
    }
  };

  return (
    <AdminLayout>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Hisobotlar
          </Typography>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Hisobot turi</InputLabel>
                <Select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  label="Hisobot turi"
                >
                  <MenuItem value="revenue">Daromad</MenuItem>
                  <MenuItem value="bookings">Buyurtmalar</MenuItem>
                  <MenuItem value="computers">Kompyuterlar</MenuItem>
                  <MenuItem value="users">Foydalanuvchilar</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <DatePicker
                label="Boshlanish sanasi"
                value={dateRange.startDate}
                onChange={(date) => setDateRange({ ...dateRange, startDate: date })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <DatePicker
                label="Tugash sanasi"
                value={dateRange.endDate}
                onChange={(date) => setDateRange({ ...dateRange, endDate: date })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={() => handleExport('excel')}
                fullWidth
              >
                Excel
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              {reportType === 'revenue' && (
                <RevenueChart data={reportData?.revenueData} />
              )}
              {reportType === 'bookings' && (
                <BookingChart data={reportData?.bookingData} />
              )}
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Sana</TableCell>
                    {reportType === 'revenue' && (
                      <>
                        <TableCell align="right">Daromad</TableCell>
                        <TableCell align="right">Buyurtmalar soni</TableCell>
                      </>
                    )}
                    {reportType === 'bookings' && (
                      <>
                        <TableCell align="right">Jami buyurtmalar</TableCell>
                        <TableCell align="right">Faol</TableCell>
                        <TableCell align="right">Bekor qilingan</TableCell>
                      </>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData?.dailyStats.map((stat) => (
                    <TableRow key={stat.date}>
                      <TableCell>{new Date(stat.date).toLocaleDateString()}</TableCell>
                      {reportType === 'revenue' && (
                        <>
                          <TableCell align="right">
                            {stat.revenue.toLocaleString()} so'm
                          </TableCell>
                          <TableCell align="right">
                            {stat.bookingsCount}
                          </TableCell>
                        </>
                      )}
                      {reportType === 'bookings' && (
                        <>
                          <TableCell align="right">{stat.total}</TableCell>
                          <TableCell align="right">{stat.active}</TableCell>
                          <TableCell align="right">{stat.cancelled}</TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Container>
    </AdminLayout>
  );
};

export default Reports; 