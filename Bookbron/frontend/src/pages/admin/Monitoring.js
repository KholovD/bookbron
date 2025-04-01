import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip
} from '@mui/material';
import {
  Computer,
  Warning,
  CheckCircle,
  Block,
  Timer,
  Refresh,
  Settings,
  History
} from '@mui/icons-material';
import { AdminLayout } from '../../components/admin';
import { ComputerStatus, TimelineView } from '../../components/admin/monitoring';
import socketClient from '../../services/socketClient';
import api from '../../services/api';

const Monitoring = () => {
  const [computers, setComputers] = useState([]);
  const [selectedComputer, setSelectedComputer] = useState(null);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeSocket();
    loadComputers();
  }, []);

  const initializeSocket = () => {
    socketClient.connect();
    socketClient.on('computer_status', handleComputerUpdate);
    socketClient.on('computer_warning', handleComputerWarning);
  };

  const loadComputers = async () => {
    try {
      const response = await api.get('/admin/computers/status');
      setComputers(response.data);
    } catch (error) {
      console.error('Kompyuterlarni yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComputerUpdate = (data) => {
    setComputers(prev => prev.map(comp => 
      comp._id === data.computerId ? { ...comp, ...data } : comp
    ));
  };

  const handleComputerWarning = (data) => {
    // Notification sistemasi orqali ogohlantirish
    console.warn('Computer warning:', data);
  };

  const handleAction = async (computerId, action) => {
    try {
      await api.post(`/admin/computers/${computerId}/action`, { action });
      loadComputers();
    } catch (error) {
      console.error('Amalni bajarishda xatolik:', error);
    }
  };

  const handleSettingsSave = async (settings) => {
    try {
      await api.put(`/admin/computers/${selectedComputer._id}/settings`, settings);
      setSettingsOpen(false);
      loadComputers();
    } catch (error) {
      console.error('Sozlamalarni saqlashda xatolik:', error);
    }
  };

  return (
    <AdminLayout>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Kompyuterlar monitoringi
          </Typography>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={loadComputers}
            sx={{ mr: 2 }}
          >
            Yangilash
          </Button>
        </Box>

        <Grid container spacing={3}>
          {computers.map((computer) => (
            <Grid item xs={12} sm={6} md={4} key={computer._id}>
              <Paper 
                sx={{ 
                  p: 2,
                  border: computer.status === 'warning' ? '2px solid #ff9800' : 'none'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">
                    PC #{computer.number}
                  </Typography>
                  <ComputerStatus status={computer.status} />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {computer.zone.name} | {computer.specs}
                  </Typography>
                  {computer.currentUser && (
                    <Typography variant="body2">
                      Foydalanuvchi: {computer.currentUser.name}
                    </Typography>
                  )}
                  {computer.timeRemaining && (
                    <Typography variant="body2">
                      Qolgan vaqt: {computer.timeRemaining} daqiqa
                    </Typography>
                  )}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Tooltip title="Bloklash/Faollashtirish">
                      <IconButton
                        onClick={() => handleAction(computer._id, 'toggle')}
                        color={computer.status === 'blocked' ? 'error' : 'success'}
                      >
                        {computer.status === 'blocked' ? <Block /> : <CheckCircle />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Vaqt tarixi">
                      <IconButton
                        onClick={() => {
                          setSelectedComputer(computer);
                          setTimelineOpen(true);
                        }}
                      >
                        <History />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box>
                    <Tooltip title="Sozlamalar">
                      <IconButton
                        onClick={() => {
                          setSelectedComputer(computer);
                          setSettingsOpen(true);
                        }}
                      >
                        <Settings />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <TimelineView
          open={timelineOpen}
          computer={selectedComputer}
          onClose={() => setTimelineOpen(false)}
        />

        <ComputerSettingsDialog
          open={settingsOpen}
          computer={selectedComputer}
          onClose={() => setSettingsOpen(false)}
          onSave={handleSettingsSave}
        />
      </Container>
    </AdminLayout>
  );
};

export default Monitoring; 