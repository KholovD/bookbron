import React from 'react';
import {
  Paper,
  Typography,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Box,
  Alert,
  Divider,
} from '@mui/material';
import { useSettings } from '@/hooks/useSettings';
import { LoadingButton } from '@mui/lab';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';

const SettingsSection = styled(motion.div)`
  margin-bottom: 2rem;
`;

const StyledPaper = styled(Paper)`
  padding: 2rem;
`;

export const GeneralSettings: React.FC = () => {
  const { settings, updateSettings, isLoading, error } = useSettings();
  const [formData, setFormData] = React.useState(settings);

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(formData);
  };

  return (
    <StyledPaper component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" gutterBottom>
        Umumiy sozlamalar
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <SettingsSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Typography variant="h6" gutterBottom>
          Narxlar
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Soatlik narx"
              type="number"
              value={formData.hourlyRate}
              onChange={(e) => handleChange('hourlyRate', e.target.value)}
              InputProps={{
                endAdornment: <Typography>so'm</Typography>,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Minimal to'lov"
              type="number"
              value={formData.minimumPayment}
              onChange={(e) => handleChange('minimumPayment', e.target.value)}
              InputProps={{
                endAdornment: <Typography>so'm</Typography>,
              }}
            />
          </Grid>
        </Grid>
      </SettingsSection>

      <Divider sx={{ my: 3 }} />

      <SettingsSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Typography variant="h6" gutterBottom>
          Xavfsizlik
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.autoLogout}
                  onChange={(e) => handleChange('autoLogout', e.target.checked)}
                />
              }
              label="Avtomatik chiqish"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Avtomatik chiqish vaqti (daqiqa)"
              type="number"
              value={formData.autoLogoutTime}
              onChange={(e) => handleChange('autoLogoutTime', e.target.value)}
              disabled={!formData.autoLogout}
            />
          </Grid>
        </Grid>
      </SettingsSection>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => setFormData(settings)}
          disabled={isLoading}
        >
          Bekor qilish
        </Button>
        <LoadingButton
          variant="contained"
          type="submit"
          loading={isLoading}
        >
          Saqlash
        </LoadingButton>
      </Box>
    </StyledPaper>
  );
}; 