import React from 'react';
import {
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  TextField,
  Chip,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { ReportGenerator as ReportGen } from '@/utils/reports/ReportGenerator';
import { Download, PictureAsPdf, TableChart } from '@mui/icons-material';
import { toast } from 'react-hot-toast';

export const ReportGenerator: React.FC = () => {
  const [options, setOptions] = React.useState({
    startDate: null,
    endDate: null,
    type: 'daily',
    format: 'pdf',
    filters: {}
  });

  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      const blob = await ReportGen.getInstance().generateReport(options);
      
      // Download file
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report-${new Date().toISOString()}.${options.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Hisobot yaratildi');
    } catch (error) {
      toast.error('Hisobot yaratishda xatolik yuz berdi');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Hisobot yaratish
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <DatePicker
            label="Boshlanish sanasi"
            value={options.startDate}
            onChange={(date) => setOptions({ ...options, startDate: date })}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <DatePicker
            label="Tugash sanasi"
            value={options.endDate}
            onChange={(date) => setOptions({ ...options, endDate: date })}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Hisobot turi</InputLabel>
            <Select
              value={options.type}
              onChange={(e) => setOptions({ ...options, type: e.target.value })}
              label="Hisobot turi"
            >
              <MenuItem value="daily">Kunlik</MenuItem>
              <MenuItem value="weekly">Haftalik</MenuItem>
              <MenuItem value="monthly">Oylik</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Format</InputLabel>
            <Select
              value={options.format}
              onChange={(e) => setOptions({ ...options, format: e.target.value })}
              label="Format"
            >
              <MenuItem value="pdf">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PictureAsPdf />
                  PDF
                </Box>
              </MenuItem>
              <MenuItem value="excel">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TableChart />
                  Excel
                </Box>
              </MenuItem>
              <MenuItem value="csv">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Download />
                  CSV
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={handleGenerate}
          disabled={isGenerating || !options.startDate || !options.endDate}
          startIcon={isGenerating ? <CircularProgress size={20} /> : <Download />}
        >
          {isGenerating ? 'Yaratilmoqda...' : 'Hisobot yaratish'}
        </Button>
      </Box>
    </Paper>
  );
}; 