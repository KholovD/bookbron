import React from 'react';
import {
  Paper,
  Typography,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Alert,
  Box
} from '@mui/material';
import { useSettings } from '@/hooks/useSettings';

export const AdvancedSettings: React.FC = () => {
  const {
    settings,
    updateSettings,
    isLoading,
    error,
    saveSettings
  } = useSettings();

  const [formData, setFormData] = React.useState(settings);

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSettings(formData);
  };

  return (
    <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Kengaytirilgan sozlamalar
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Xavfsizlik */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Xavfsizlik
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.twoFactorAuth}
                    onChange={(e) => handleChange('twoFactorAuth', e.target.checked)}
                  />
                }
                label="Ikki bosqichli autentifikatsiya"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Parol muddati (kunlar)"
                type="number"
                value={formData.passwordExpiryDays}
                onChange={(e) => handleChange('passwordExpiryDays', e.target.value)}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        {/* Tarmoq */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Tarmoq sozlamalari
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Maksimal ulanishlar soni"
                type="number"
                value={formData.maxConnections}
                onChange={(e) => handleChange('maxConnections', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Timeout (soniya)"
                type="number"
                value={formData.timeout}
                onChange={(e) => handleChange('timeout', e.target.value)}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        {/* Arxivlash */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Arxivlash
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.autoBackup}
                    onChange={(e) => handleChange('autoBackup', e.target.checked)}
                  />
                }
                label="Avtomatik arxivlash"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Arxivlash vaqti"
                type="time"
                value={formData.backupTime}
                onChange={(e) => handleChange('backupTime', e.target.value)}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, textAlign: 'right' }}>
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
        >
          Saqlash
        </Button>
      </Box>
    </Paper>
  );
}; 