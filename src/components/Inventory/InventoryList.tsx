import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Button
} from '@mui/material';
import { Edit, Delete, Warning } from '@mui/icons-material';
import { useInventory } from '@/hooks/useInventory';
import { InventoryEditModal } from './InventoryEditModal';

export const InventoryList: React.FC = () => {
  const { 
    inventory, 
    isLoading, 
    deleteItem, 
    updateItem 
  } = useInventory();
  
  const [editItem, setEditItem] = React.useState<InventoryItem | null>(null);

  return (
    <>
      <Paper sx={{ p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nomi</TableCell>
              <TableCell>Kategoriya</TableCell>
              <TableCell align="right">Narxi</TableCell>
              <TableCell align="right">Miqdori</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell>Amallar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell align="right">
                  {formatCurrency(item.price)}
                </TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">
                  {item.quantity <= item.minQuantity ? (
                    <Chip 
                      icon={<Warning />} 
                      label="Kam qoldi" 
                      color="warning"
                    />
                  ) : (
                    <Chip label="Yetarli" color="success" />
                  )}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => setEditItem(item)}>
                    <Edit />
                  </IconButton>
                  <IconButton 
                    onClick={() => deleteItem(item.id)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <InventoryEditModal
        open={!!editItem}
        item={editItem}
        onClose={() => setEditItem(null)}
        onSave={updateItem}
      />
    </>
  );
}; 