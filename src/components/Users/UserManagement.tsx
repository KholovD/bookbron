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
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  Person,
  Block,
  CheckCircle,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { useUsers } from '@/hooks/useUsers';

const StyledTableRow = styled(TableRow)`
  &:nth-of-type(odd) {
    background-color: ${({ theme }) => theme.palette.action.hover};
  }
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.palette.action.selected};
  }
`;

const UserDialog = styled(Dialog)`
  .MuiDialog-paper {
    padding: 2rem;
  }
`;

export const UserManagement: React.FC = () => {
  const {
    users,
    createUser,
    updateUser,
    deleteUser,
    isLoading,
  } = useUsers();

  const [selectedUser, setSelectedUser] = React.useState(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    fullName: '',
    username: '',
    role: 'user',
    status: 'active',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      await updateUser(selectedUser.id, formData);
    } else {
      await createUser(formData);
    }
    handleCloseDialog();
  };

  const handleOpenDialog = (user = null) => {
    if (user) {
      setFormData(user);
      setSelectedUser(user);
    } else {
      setFormData({
        fullName: '',
        username: '',
        role: 'user',
        status: 'active',
      });
      setSelectedUser(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedUser(null);
  };

  return (
    <>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5">Foydalanuvchilar</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Yangi foydalanuvchi
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>F.I.O</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Amallar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  component={StyledTableRow}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person />
                      {user.fullName}
                    </Box>
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      color={user.role === 'admin' ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={user.status === 'active' ? <CheckCircle /> : <Block />}
                      label={user.status}
                      color={user.status === 'active' ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleOpenDialog(user)}
                      size="small"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => deleteUser(user.id)}
                      size="small"
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <UserDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom>
            {selectedUser ? 'Foydalanuvchini tahrirlash' : 'Yangi foydalanuvchi'}
          </Typography>

          <Box sx={{ display: 'grid', gap: 2, mb: 3 }}>
            <TextField
              label="F.I.O"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
            <TextField
              label="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
            <FormControl>
              <InputLabel>Rol</InputLabel>
              <Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                label="Rol"
              >
                <MenuItem value="user">Foydalanuvchi</MenuItem>
                <MenuItem value="admin">Administrator</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                label="Status"
              >
                <MenuItem value="active">Faol</MenuItem>
                <MenuItem value="blocked">Bloklangan</MenuItem>
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
              {selectedUser ? 'Saqlash' : 'Qo\'shish'}
            </LoadingButton>
          </Box>
        </form>
      </UserDialog>
    </>
  );
}; 