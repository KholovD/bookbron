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
  Switch,
  FormControlLabel,
  Chip,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Timer,
  AttachMoney,
  Computer,
  Group
} from '@mui/icons-material';
import { AdminLayout } from '../../components/admin';
import api from '../../services/api';

const Tariffs = () => {
  const [tariffs, setTariffs] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTariff, setSelectedTariff] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    hourlyRate: 0,
    minimumHours: 1,
    maximumHours: 12,
    discount: 0,
    isActive: true,
    features: '',
    restrictions: '',
    applyToZones: []
  });

  useEffect(() => {
    loadTariffs();
  }, []);

  const loadTariffs = async () => {
    try {
      const response = await api.get('/admin/tariffs');
      setTariffs(response.data);
    } catch (error) {
      setError('Tariflarni yuklashda xatolik yuz berdi');
    }
  };

  const handleDialogOpen = (tariff = null) => {
    if (tariff) {
      setSelectedTariff(tariff);
      setFormData({ ...tariff });
    } else {
      setSelectedTariff(null);
      setFormData({
        name: '',
        description: '',
        hourlyRate: 0,
        minimumHours: 1,
        maximumHours: 12,
        discount: 0,
        isActive: true,
        features: '',
        restrictions: '',
        applyToZones: []
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (selectedTariff) {
        await api.put(`/admin/tariffs/${selectedTariff._id}`, formData);
      } else {
        await api.post('/admin/tariffs', formData);
      }
      loadTariffs();
      setDialogOpen(false);
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Xatolik yuz berdi');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tarifni o\'chirmoqchimisiz?')) {
      try {
        await api.delete(`/admin/tariffs/${id}`);
        loadTariffs();
      } catch (error) {
        setError('Tarifni o\'chirishda xatolik yuz berdi');
      }
    }
  };

  const calculatePrice = (hours, rate, discount) => {
    const basePrice = hours * rate;
    return basePrice - (basePrice * discount / 100);
  };

  return (
    <AdminLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">Tarif rejalari</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleDialogOpen()}
          >
            Yangi tarif
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Grid container spacing={3}>
          {/* Tarif jadvali */}
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nomi</TableCell>
                    <TableCell>Soatlik narx</TableCell>
                    <TableCell>Chegirma</TableCell>
                    <TableCell>Vaqt chegarasi</TableCell>
                    <TableCell>Holat</TableCell>
                    <TableCell>Amallar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tariffs.map((tariff) => (
                    <TableRow key={tariff._id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle1">{tariff.name}</Typography>
                          <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                            {tariff.description}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {tariff.hourlyRate.toLocaleString()} so'm/soat
                      </TableCell>
                      <TableCell>
                        {tariff.discount > 0 && (
                          <Chip
                            label={`${tariff.discount}% chegirma`}
                            color="success"
                            size="small"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {tariff.minimumHours}-{tariff.maximumHours} soat
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={tariff.isActive ? 'Faol' : 'Nofaol'}
                          color={tariff.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleDialogOpen(tariff)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(tariff._id)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>

        {/* Tarif qo'shish/tahrirlash dialogi */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {selectedTariff ? 'Tarifni tahrirlash' : 'Yangi tarif qo'shish'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tarif nomi"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Soatlik narx"
                  type="number"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tavsif"
                  multiline
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Minimal soat"
                  type="number"
                  value={formData.minimumHours}
                  onChange={(e) => setFormData({ ...formData, minimumHours: Number(e.target.value) })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Maksimal soat"
                  type="number"
                  value={formData.maximumHours}
                  onChange={(e) => setFormData({ ...formData, maximumHours: Number(e.target.value) })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Chegirma (%)"
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Qo'shimcha imkoniyatlar"
                  multiline
                  rows={2}
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  helperText="Har bir imkoniyatni yangi qatordan yozing"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Cheklovlar"
                  multiline
                  rows={2}
                  value={formData.restrictions}
                  onChange={(e) => setFormData({ ...formData, restrictions: e.target.value })}
                  helperText="Har bir cheklovni yangi qatordan yozing"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                  }
                  label="Faol"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Bekor qilish</Button>
            <Button onClick={handleSubmit} variant="contained">
              {selectedTariff ? 'Saqlash' : 'Qo'shish'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </AdminLayout>
  );
};

export default Tariffs; 