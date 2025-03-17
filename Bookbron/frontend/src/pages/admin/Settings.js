import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Divider,
  Alert,
  Switch,
  FormControlLabel,
  InputAdornment
} from '@mui/material';
import {
  Save,
  Payment,
  Notifications,
  Timer,
  Security
} from '@mui/icons-material';
import { AdminLayout } from '../../components/admin';
import api from '../../services/api';

const Settings = () => {
  const [settings, setSettings] = useState({
    paymentSettings: {
      clickEnabled: true,
      clickMerchantId: '',
      clickSecretKey: '',
      paymeEnabled: true,
      paymeMerchantId: '',
      paymeSecretKey: '',
    },
    bookingSettings: {
      minBookingTime: 1,
      maxBookingTime: 12,
      pricePerHour: 10000,
      autoConfirmBookings: true,
      allowMultipleBookings: false,
    },
    notificationSettings: {
      telegramEnabled: true,
      telegramBotToken: '',
      emailEnabled: true,
      emailService: 'smtp',
      emailHost: '',
      emailPort: '',
      emailUser: '',
      emailPassword: '',
    },
    securitySettings: {
      maxLoginAttempts: 5,
      lockoutDuration: 30,
      passwordMinLength: 8,
      requireStrongPassword: true,
    }
  });
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState({ show: false, success: false, message: '' });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await api.get('/admin/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Sozlamalarni yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (section, field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = async (section) => {
    try {
      await api.put(`/admin/settings/${section}`, settings[section]);
      setSaveStatus({
        show: true,
        success: true,
        message: 'Sozlamalar muvaffaqiyatli saqlandi'
      });
    } catch (error) {
      setSaveStatus({
        show: true,
        success: false,
        message: 'Xatolik yuz berdi: ' + error.message
      });
    }
    setTimeout(() => setSaveStatus({ show: false, success: false, message: '' }), 3000);
  };

  return (
    <AdminLayout>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>
          Sozlamalar
        </Typography>

        {saveStatus.show && (
          <Alert 
            severity={saveStatus.success ? 'success' : 'error'}
            sx={{ mb: 2 }}
          >
            {saveStatus.message}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* To'lov sozlamalari */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Payment sx={{ mr: 1 }} />
                <Typography variant="h6">To'lov sozlamalari</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.paymentSettings.clickEnabled}
                        onChange={handleChange('paymentSettings', 'clickEnabled')}
                      />
                    }
                    label="Click to'lov tizimi"
                  />
                  <TextField
                    fullWidth
                    label="Click Merchant ID"
                    value={settings.paymentSettings.clickMerchantId}
                    onChange={handleChange('paymentSettings', 'clickMerchantId')}
                    disabled={!settings.paymentSettings.clickEnabled}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Click Secret Key"
                    type="password"
                    value={settings.paymentSettings.clickSecretKey}
                    onChange={handleChange('paymentSettings', 'clickSecretKey')}
                    disabled={!settings.paymentSettings.clickEnabled}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.paymentSettings.paymeEnabled}
                        onChange={handleChange('paymentSettings', 'paymeEnabled')}
                      />
                    }
                    label="Payme to'lov tizimi"
                  />
                  <TextField
                    fullWidth
                    label="Payme Merchant ID"
                    value={settings.paymentSettings.paymeMerchantId}
                    onChange={handleChange('paymentSettings', 'paymeMerchantId')}
                    disabled={!settings.paymentSettings.paymeEnabled}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Payme Secret Key"
                    type="password"
                    value={settings.paymentSettings.paymeSecretKey}
                    onChange={handleChange('paymentSettings', 'paymeSecretKey')}
                    disabled={!settings.paymentSettings.paymeEnabled}
                    margin="normal"
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={() => handleSave('paymentSettings')}
                >
                  Saqlash
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Buyurtma sozlamalari */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Timer sx={{ mr: 1 }} />
                <Typography variant="h6">Buyurtma sozlamalari</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Minimal vaqt (soat)"
                    type="number"
                    value={settings.bookingSettings.minBookingTime}
                    onChange={handleChange('bookingSettings', 'minBookingTime')}
                    InputProps={{ inputProps: { min: 1 } }}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Maksimal vaqt (soat)"
                    type="number"
                    value={settings.bookingSettings.maxBookingTime}
                    onChange={handleChange('bookingSettings', 'maxBookingTime')}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Soatlik narx"
                    type="number"
                    value={settings.bookingSettings.pricePerHour}
                    onChange={handleChange('bookingSettings', 'pricePerHour')}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">so'm</InputAdornment>
                    }}
                    margin="normal"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.bookingSettings.autoConfirmBookings}
                        onChange={handleChange('bookingSettings', 'autoConfirmBookings')}
                      />
                    }
                    label="Avtomatik tasdiqlash"
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={() => handleSave('bookingSettings')}
                >
                  Saqlash
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Xabar sozlamalari */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Notifications sx={{ mr: 1 }} />
                <Typography variant="h6">Xabar sozlamalari</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notificationSettings.telegramEnabled}
                        onChange={handleChange('notificationSettings', 'telegramEnabled')}
                      />
                    }
                    label="Telegram xabarlari"
                  />
                  <TextField
                    fullWidth
                    label="Telegram Bot Token"
                    value={settings.notificationSettings.telegramBotToken}
                    onChange={handleChange('notificationSettings', 'telegramBotToken')}
                    disabled={!settings.notificationSettings.telegramEnabled}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notificationSettings.emailEnabled}
                        onChange={handleChange('notificationSettings', 'emailEnabled')}
                      />
                    }
                    label="Email xabarlari"
                  />
                  <TextField
                    fullWidth
                    label="SMTP Server"
                    value={settings.notificationSettings.emailHost}
                    onChange={handleChange('notificationSettings', 'emailHost')}
                    disabled={!settings.notificationSettings.emailEnabled}
                    margin="normal"
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={() => handleSave('notificationSettings')}
                >
                  Saqlash
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Xavfsizlik sozlamalari */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Security sx={{ mr: 1 }} />
                <Typography variant="h6">Xavfsizlik sozlamalari</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Maksimal login urinishlar"
                    type="number"
                    value={settings.securitySettings.maxLoginAttempts}
                    onChange={handleChange('securitySettings', 'maxLoginAttempts')}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Bloklash vaqti (daqiqa)"
                    type="number"
                    value={settings.securitySettings.lockoutDuration}
                    onChange={handleChange('securitySettings', 'lockoutDuration')}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Parol minimal uzunligi"
                    type="number"
                    value={settings.securitySettings.passwordMinLength}
                    onChange={handleChange('securitySettings', 'passwordMinLength')}
                    margin="normal"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.securitySettings.requireStrongPassword}
                        onChange={handleChange('securitySettings', 'requireStrongPassword')}
                      />
                    }
                    label="Kuchli parol talab qilish"
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={() => handleSave('securitySettings')}
                >
                  Saqlash
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </AdminLayout>
  );
};

export default Settings; 