import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Grid
} from '@mui/material';
import { useSettings } from '@/hooks/useSettings';

export const SystemSettings: React.FC = () => {
  const { settings, updateSettings, isLoading } = useSettings();
  const [formData, setFormData] = React.useState(settings);

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(formData);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Tizim Sozlamalari
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Asosiy Sozlamalar
            </Typography>
            <Box sx={{ ml: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.autoLogout}
                    onChange={(e) => handleChange('autoLogout', e.target.checked)}
                  />
                }
                label="Avtomatik chiqish (1 soat harakatsizlikdan so'ng)"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.notifications}
                    onChange={(e) => handleChange('notifications', e.target.checked)}
                  />
                }
                label="Tizim xabarnomalarini yoqish"
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>
              Narxlar
            </Typography>
            <Box sx={{ ml: 2 }}>
              <TextField
                label="Standart soatlik narx"
                type="number"
                value={formData.defaultHourlyRate}
                onChange={(e) => handleChange('defaultHourlyRate', e.target.value)}
                fullWidth
                margin="normal"
              />
              
              <TextField
                label="Minimal to'lov summasi"
                type="number"
                value={formData.minimumPayment}
                onChange={(e) => handleChange('minimumPayment', e.target.value)}
                fullWidth
                margin="normal"
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>
              Xavfsizlik
            </Typography>
            <Box sx={{ ml: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.twoFactorAuth}
                    onChange={(e) => handleChange('twoFactorAuth', e.target.checked)}
                  />
                }
                label="Ikki bosqichli autentifikatsiya"
              />
              
              <TextField
                label="Parol yangilash muddati (kunlar)"
                type="number"
                value={formData.passwordExpiryDays}
                onChange={(e) => handleChange('passwordExpiryDays', e.target.value)}
                fullWidth
                margin="normal"
              />
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
          >
            Saqlash
          </Button>
        </Box>
      </form>
    </Paper>
  );
}; 