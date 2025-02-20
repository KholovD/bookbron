import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Tabs,
  Tab,
  Dialog,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import socketClient from '../services/socketClient';
import api from '../services/api';

const BookingPage = () => {
  const { user } = useAuth();
  const [selectedZone, setSelectedZone] = useState('main');
  const [computers, setComputers] = useState([]);
  const [selectedComputer, setSelectedComputer] = useState(null);
  const [bookingDialog, setBookingDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    socketClient.connect(user.id);
    
    socketClient.on('computers_status', (updatedComputers) => {
      setComputers(updatedComputers);
    });

    return () => {
      socketClient.disconnect();
    };
  }, [user.id]);

  useEffect(() => {
    socketClient.subscribeToComputers(selectedZone);
  }, [selectedZone]);

  const handleComputerSelect = (computer) => {
    if (computer.status === 'available') {
      setSelectedComputer(computer);
      setBookingDialog(true);
    }
  };

  const handleBooking = async (hours) => {
    try {
      const response = await api.post('/bookings', {
        computerId: selectedComputer.id,
        hours
      });

      if (response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      }
    } catch (error) {
      console.error('Buyurtma xatosi:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Kompyuter tanlash
        </Typography>
        <Tabs value={selectedZone} onChange={(e, v) => setSelectedZone(v)}>
          <Tab value="main" label="Main Zone" />
          <Tab value="pro" label="Pro Zone" />
          <Tab value="vip" label="VIP Zone" />
          <Tab value="supervip" label="Super VIP" />
        </Tabs>
      </Box>

      <Grid container spacing={2}>
        {computers.map((computer) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={computer.id}>
            <Paper
              sx={{
                p: 2,
                textAlign: 'center',
                cursor: computer.status === 'available' ? 'pointer' : 'default',
                bgcolor: getComputerColor(computer.status)
              }}
              onClick={() => handleComputerSelect(computer)}
            >
              <Typography variant="h6">
                PC #{computer.number}
              </Typography>
              <Typography>
                {getStatusText(computer.status)}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <BookingDialog
        open={bookingDialog}
        computer={selectedComputer}
        onClose={() => setBookingDialog(false)}
        onBook={handleBooking}
      />
    </Container>
  );
};

export default BookingPage; 