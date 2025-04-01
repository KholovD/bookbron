import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from '@mui/material';

const BookingDialog = ({ open, computer, onClose, onBook }) => {
  const [hours, setHours] = useState(1);
  const pricePerHour = computer?.zone?.pricePerHour || 0;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Kompyuter #{computer?.number} ni band qilish
      </DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          Zona: {computer?.zone?.name}
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel>Vaqt (soat)</InputLabel>
          <Select
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          >
            {[1, 2, 3, 4].map((h) => (
              <MenuItem key={h} value={h}>{h} soat</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Umumiy narx: {hours * pricePerHour} so'm
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Bekor qilish</Button>
        <Button 
          onClick={() => onBook(hours)}
          variant="contained" 
          color="primary"
        >
          Band qilish
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingDialog; 