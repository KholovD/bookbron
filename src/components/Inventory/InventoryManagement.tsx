import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Typography,
  Box,
  Chip,
  Dialog,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Inventory2,
  Warning,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import { useInventory } from '@/hooks/useInventory';

const StyledTableRow = styled(TableRow)`
  &:nth-of-type(odd) {
    background-color: ${({ theme }) => theme.palette.action.hover};
  }
`;

const LowStockWarning = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.palette.warning.main};
`;

export const InventoryManagement: React.FC = () => {
  const {
    items,
    addItem,
    updateItem,
    deleteItem,
    isLoading,
    error
  } = useInventory();

  const [selectedItem, setSelectedItem] = React.useState(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    category: '',
    quantity: 0,
    minQuantity: 0,
    price: 0,
    status: 'available'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem) {
      await updateItem(selectedItem.id, formData);
    } else {
      await addItem(formData);
    }
    handleCloseDialog();
  };

  const handleOpenDialog = (item = null) => {
    if (item) {
      setFormData(item);
      setSelectedItem(item);
    } else {
      setFormData({
        name: '',
        category: '',
        quantity: 0,
        minQuantity: 0,
        price: 0,
        status: 'available'
      });
      setSelectedItem(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedItem(null);
  };

  const isLowStock = (item) => item.quantity <= item.minQuantity;

  return (
    <>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5">Inventar</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Yangi mahsulot
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nomi</TableCell>
                <TableCell>Kategoriya</TableCell>
                <TableCell>Miqdori</TableCell>
                <TableCell>Narxi</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Amallar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <AnimatePresence>
                {items.map((item) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    component={StyledTableRow}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Inventory2 />
                        {item.name}
                      </Box>
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      {isLowStock(item) ? (
                        <LowStockWarning>
                          <Warning />
                          {item.quantity}
                        </LowStockWarning>
                      ) : (
                        item.quantity
                      )}
                    </TableCell>
                    <TableCell>{item.price.toLocaleString()} so'm</TableCell>
                    <TableCell>
                      <Chip
                        label={item.status}
                        color={item.status === 'available' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleOpenDialog(item)}
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => deleteItem(item.id)}
                        size="small"
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {selectedItem ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot'}
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'grid', gap: 2, mb: 3 }}>
              <TextField
                label="Nomi"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <TextField
                label="Kategoriya"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
              <TextField
                label="Miqdori"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                required
              />
              <TextField
                label="Minimal miqdor"
                type="number"
                value={formData.minQuantity}
                onChange={(e) => setFormData({ ...formData, minQuantity: Number(e.target.value) })}
                required
              />
              <TextField
                label="Narxi"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
              />
              <FormControl>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  label="Status"
                >
                  <MenuItem value="available">Mavjud</MenuItem>
                  <MenuItem value="unavailable">Mavjud emas</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button onClick={handleCloseDialog}>
                Bekor qilish
              </Button>
              <LoadingButton
                variant="contained"
                type="submit"
                loading={isLoading}
              >
                {selectedItem ? 'Saqlash' : 'Qo\'shish'}
              </LoadingButton>
            </Box>
          </form>
        </Box>
      </Dialog>
    </>
  );
}; 