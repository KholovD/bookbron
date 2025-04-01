import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { AdminLayout } from '../../components/admin';
import { ComputerDialog } from '../../components/admin/computers';
import api from '../../services/api';

const Computers = () => {
  const [computers, setComputers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedComputer, setSelectedComputer] = useState(null);

  useEffect(() => {
    loadComputers();
  }, []);

  const loadComputers = async () => {
    try {
      const response = await api.get('/admin/computers');
      setComputers(response.data);
    } catch (error) {
      console.error('Kompyuterlarni yuklashda xatolik:', error);
    }
  };

  const handleEdit = (computer) => {
    setSelectedComputer(computer);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Kompyuterni o\'chirishni istaysizmi?')) {
      try {
        await api.delete(`/admin/computers/${id}`);
        loadComputers();
      } catch (error) {
        console.error('Kompyuterni o\'chirishda xatolik:', error);
      }
    }
  };

  const handleSave = async (computerData) => {
    try {
      if (selectedComputer) {
        await api.put(`/admin/computers/${selectedComputer._id}`, computerData);
      } else {
        await api.post('/admin/computers', computerData);
      }
      setDialogOpen(false);
      setSelectedComputer(null);
      loadComputers();
    } catch (error) {
      console.error('Kompyuterni saqlashda xatolik:', error);
    }
  };

  return (
    <AdminLayout>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">Kompyuterlar</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setSelectedComputer(null);
              setDialogOpen(true);
            }}
          >
            Yangi qo'shish
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Raqam</TableCell>
                <TableCell>Zona</TableCell>
                <TableCell>Holat</TableCell>
                <TableCell>Xarakteristika</TableCell>
                <TableCell>Amallar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {computers.map((computer) => (
                <TableRow key={computer._id}>
                  <TableCell>{computer.number}</TableCell>
                  <TableCell>{computer.zone.name}</TableCell>
                  <TableCell>{getStatusText(computer.status)}</TableCell>
                  <TableCell>{computer.specs}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(computer)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(computer._id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <ComputerDialog
          open={dialogOpen}
          computer={selectedComputer}
          onClose={() => {
            setDialogOpen(false);
            setSelectedComputer(null);
          }}
          onSave={handleSave}
        />
      </Container>
    </AdminLayout>
  );
};

export default Computers; 