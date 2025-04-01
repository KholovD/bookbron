import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Chip,
  Box
} from '@mui/material';

const NotificationDialog = ({
  open,
  onClose,
  onSend,
  users,
  selectedUsers,
  setSelectedUsers
}) => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'telegram'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend(formData);
    setFormData({ title: '', message: '', type: 'telegram' });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Yangi xabar yuborish</DialogTitle>
        
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Xabar turi</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                label="Xabar turi"
              >
                <MenuItem value="telegram">Telegram</MenuItem>
                <MenuItem value="email">Email</MenuItem>
              </Select>
            </FormControl>

            <Autocomplete
              multiple
              options={users}
              getOptionLabel={(option) => option.name}
              value={users.filter(user => selectedUsers.includes(user._id))}
              onChange={(event, newValue) => {
                setSelectedUsers(newValue.map(user => user._id));
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option.name}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Qabul qiluvchilar"
                  placeholder="Foydalanuvchilarni tanlang"
                />
              )}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Sarlavha"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Xabar matni"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              multiline
              rows={4}
            />
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose}>Bekor qilish</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!selectedUsers.length || !formData.title || !formData.message}
          >
            Yuborish
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default NotificationDialog; 