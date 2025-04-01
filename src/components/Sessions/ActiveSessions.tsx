import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Chip,
  Box,
  Button,
  Dialog,
} from '@mui/material';
import {
  Stop,
  Timer,
  AttachMoney,
  Person,
  Computer,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import { useSessions } from '@/hooks/useSessions';
import { format, formatDistance } from 'date-fns';
import { PaymentForm } from '../Billing/PaymentForm';

const StyledTableRow = styled(TableRow)`
  &:nth-of-type(odd) {
    background-color: ${({ theme }) => theme.palette.action.hover};
  }
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.palette.action.selected};
  }
`;

const SessionTimer = styled(Typography)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.palette.primary.main};
`;

export const ActiveSessions: React.FC = () => {
  const { sessions, endSession, isLoading } = useSessions();
  const [selectedSession, setSelectedSession] = React.useState(null);

  const handleEndSession = async (sessionId: string) => {
    setSelectedSession(sessions.find(s => s.id === sessionId));
  };

  return (
    <>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5">Faol sessiyalar</Typography>
          <Chip 
            label={`Jami: ${sessions.length}`}
            color="primary"
            variant="outlined"
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Kompyuter</TableCell>
                <TableCell>Foydalanuvchi</TableCell>
                <TableCell>Boshlangan vaqt</TableCell>
                <TableCell>Davomiyligi</TableCell>
                <TableCell>Summa</TableCell>
                <TableCell>Amallar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <AnimatePresence>
                {sessions.map((session) => (
                  <motion.tr
                    key={session.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    component={StyledTableRow}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Computer />
                        {session.computerName}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Person />
                        {session.userName}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {format(new Date(session.startTime), 'HH:mm:ss')}
                    </TableCell>
                    <TableCell>
                      <SessionTimer>
                        <Timer />
                        {formatDistance(new Date(session.startTime), new Date(), { addSuffix: false })}
                      </SessionTimer>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AttachMoney />
                        {session.currentCost.toLocaleString()} so'm
                      </Box>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => handleEndSession(session.id)}
                        disabled={isLoading}
                      >
                        <Stop />
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
        open={Boolean(selectedSession)}
        onClose={() => setSelectedSession(null)}
        maxWidth="sm"
        fullWidth
      >
        {selectedSession && (
          <PaymentForm
            session={selectedSession}
            onSuccess={() => {
              endSession(selectedSession.id);
              setSelectedSession(null);
            }}
            onCancel={() => setSelectedSession(null)}
          />
        )}
      </Dialog>
    </>
  );
}; 