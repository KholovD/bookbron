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
  Card,
  CardContent,
  CardActions,
  CardMedia,
  InputAdornment,
  Tooltip
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Computer,
  AttachMoney,
  Speed,
  Memory,
  Gamepad,
  Wifi,
  AcUnit,
  Restaurant,
  SmokingRooms,
  NoSmoking
} from '@mui/icons-material';
import { AdminLayout } from '../../components/admin';
import api from '../../services/api';

const Zones = () => {
  const [zones, setZones] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pricePerHour: 0,
    computerSpecs: '',
    features: [],
    maxComputers: 0,
    isVIP: false,
    isActive: true,
    image: null,
    smoking: false,
    airConditioned: true,
    hasFood: false,
    networkSpeed: ''
  });

  useEffect(() => {
    loadZones();
  }, []);

  const loadZones = async () => {
    try {
      const response = await api.get('/admin/zones');
      setZones(response.data);
    } catch (error) {
      setError('Zonalarni yuklashda xatolik yuz berdi');
    }
  };

  const handleDialogOpen = (zone = null) => {
    if (zone) {
      setSelectedZone(zone);
      setFormData({ ...zone });
    } else {
      setSelectedZone(null);
      setFormData({
        name: '',
        description: '',
        pricePerHour: 0,
        computerSpecs: '',
        features: [],
        maxComputers: 0,
        isVIP: false,
        isActive: true,
        image: null,
        smoking: false,
        airConditioned: true,
        hasFood: false,
        networkSpeed: ''
      });
    }
    setDialogOpen(true);
  };

  const handleImageUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await api.post('/admin/upload', formData);
      return response.data.url;
    } catch (error) {
      throw new Error('Rasmni yuklashda xatolik');
    }
  };

  const handleSubmit = async () => {
    try {
      let imageUrl = formData.image;
      if (formData.image instanceof File) {
        imageUrl = await handleImageUpload(formData.image);
      }

      const submitData = { ...formData, image: imageUrl };

      if (selectedZone) {
        await api.put(`/admin/zones/${selectedZone._id}`, submitData);
      } else {
        await api.post('/admin/zones', submitData);
      }
      loadZones();
      setDialogOpen(false);
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Xatolik yuz berdi');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Zonani o\'chirmoqchimisiz?')) {
      try {
        await api.delete(`/admin/zones/${id}`);
        loadZones();
      } catch (error) {
        setError('Zonani o\'chirishda xatolik yuz berdi');
      }
    }
  };

  const getFeatureIcon = (feature) => {
    const icons = {
      vip: <Speed />,
      gaming: <Gamepad />,
      highSpeed: <Wifi />,
      airConditioned: <AcUnit />,
      food: <Restaurant />,
      smoking: <SmokingRooms />,
      noSmoking: <NoSmoking />
    };
    return icons[feature] || null;
  };

  return (
    <AdminLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">Zonalar</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleDialogOpen()}
          >
            Yangi zona
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Grid container spacing={3}>
          {zones.map((zone) => (
            <Grid item xs={12} sm={6} md={4} key={zone._id}>
              <Card>
                {zone.image && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={zone.image}
                    alt={zone.name}
                  />
                )}
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6">{zone.name}</Typography>
                    <Chip
                      label={zone.isActive ? 'Faol' : 'Nofaol'}
                      color={zone.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                  <Typography color="textSecondary" gutterBottom>
                    {zone.description}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Tooltip title="Soatlik narx">
                      <Chip
                        icon={<AttachMoney />}
                        label={`${zone.pricePerHour.toLocaleString()} so'm/soat`}
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    </Tooltip>
                    <Tooltip title="Kompyuterlar soni">
                      <Chip
                        icon={<Computer />}
                        label={`${zone.maxComputers} ta`}
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    </Tooltip>
                    {zone.isVIP && (
                      <Chip
                        label="VIP"
                        color="primary"
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    )}
                    {zone.features.map((feature) => (
                      <Tooltip key={feature} title={feature}>
                        <Chip
                          icon={getFeatureIcon(feature)}
                          label={feature}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      </Tooltip>
                    ))}
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<Edit />}
                    onClick={() => handleDialogOpen(zone)}
                  >
                    Tahrirlash
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => handleDelete(zone._id)}
                  >
                    O'chirish
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Zona qo'shish/tahrirlash dialogi */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {selectedZone ? 'Zonani tahrirlash' : 'Yangi zona qo'shish'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Zona nomi"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Soatlik narx"
                  type="number"
                  value={formData.pricePerHour}
                  onChange={(e) => setFormData({ ...formData, pricePerHour: Number(e.target.value) })}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">so'm</InputAdornment>,
                  }}
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
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Kompyuter xarakteristikasi"
                  multiline
                  rows={2}
                  value={formData.computerSpecs}
                  onChange={(e) => setFormData({ ...formData, computerSpecs: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Maksimal kompyuterlar"
                  type="number"
                  value={formData.maxComputers}
                  onChange={(e) => setFormData({ ...formData, maxComputers: Number(e.target.value) })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Internet tezligi"
                  value={formData.networkSpeed}
                  onChange={(e) => setFormData({ ...formData, networkSpeed: e.target.value })}
                  placeholder="100 Mbps"
                />
              </Grid>
              <Grid item xs={12}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                  style={{ marginBottom: 16 }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isVIP}
                      onChange={(e) => setFormData({ ...formData, isVIP: e.target.checked })}
                    />
                  }
                  label="VIP zona"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.smoking}
                      onChange={(e) => setFormData({ ...formData, smoking: e.target.checked })}
                    />
                  }
                  label="Chekish mumkin"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.airConditioned}
                      onChange={(e) => setFormData({ ...formData, airConditioned: e.target.checked })}
                    />
                  }
                  label="Konditsioner"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.hasFood}
                      onChange={(e) => setFormData({ ...formData, hasFood: e.target.checked })}
                    />
                  }
                  label="Ovqatlanish mumkin"
                />
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
              {selectedZone ? 'Saqlash' : 'Qo'shish'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </AdminLayout>
  );
};

export default Zones; 