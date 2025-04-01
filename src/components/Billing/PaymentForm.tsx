import React from 'react';
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
  Box,
  Typography,
  Chip,
  Alert,
  Theme,
} from '@mui/material';
import {
  AttachMoney,
  CreditCard,
  QrCode2,
  Receipt,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';

// TODO: Create usePayments hook
const usePayments = () => {
  return {
    processPayment: async () => true,
    isLoading: false,
    error: null
  };
};

const PaymentMethod = styled(motion.div)<{ selected?: boolean }>`
  border: 2px solid ${({ theme, selected }: { theme: any; selected?: boolean }) =>
    selected ? theme.palette.primary.main : theme.palette.divider};
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${({ theme, selected }: { theme: any; selected?: boolean }) =>
    selected ? theme.palette.primary.light + '20' : 'transparent'};

  &:hover {
    border-color: ${({ theme }: { theme: any }) => theme.palette.primary.main};
    transform: translateY(-2px);
  }
`;

const PaymentDetails = styled(motion.div)`
  margin-top: 1rem;
`;

interface PaymentFormProps {
  session: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  session,
  onSuccess,
  onCancel,
}) => {
  const [paymentMethod, setPaymentMethod] = React.useState('cash');
  const { processPayment, isLoading, error } = usePayments();

  const paymentMethods = [
    { id: 'cash', label: 'Naqd pul', icon: <AttachMoney /> },
    { id: 'card', label: 'Plastik karta', icon: <CreditCard /> },
    { id: 'qr', label: 'QR-kod', icon: <QrCode2 /> },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await processPayment({
      sessionId: session.id,
      amount: session.currentCost,
      method: paymentMethod,
    });
    if (success) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>
        To'lov
        <Typography variant="subtitle2" color="textSecondary">
          Sessiya: {session.computerName} - {session.userName}
        </Typography>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            To'lov summasi
          </Typography>
          <Chip
            icon={<Receipt />}
            label={`${session.currentCost.toLocaleString()} so'm`}
            color="primary"
            size="medium"
          />
        </Box>

        <Typography variant="h6" gutterBottom>
          To'lov usulini tanlang
        </Typography>

        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {paymentMethods.map((method) => (
            <PaymentMethod
              key={method.id}
              selected={paymentMethod === method.id}
              onClick={() => setPaymentMethod(method.id)}
              whileHover={{ scale: 1.02 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {method.icon}
                <Typography>{method.label}</Typography>
              </Box>
            </PaymentMethod>
          ))}
        </Box>

        <AnimatePresence mode="wait">
          {paymentMethod === 'card' && (
            <PaymentDetails
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <TextField
                fullWidth
                label="Karta raqami"
                margin="normal"
                placeholder="0000 0000 0000 0000"
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Amal qilish muddati"
                  margin="normal"
                  placeholder="MM/YY"
                />
                <TextField
                  label="CVV"
                  margin="normal"
                  type="password"
                  inputProps={{ maxLength: 3 }}
                />
              </Box>
            </PaymentDetails>
          )}

          {paymentMethod === 'qr' && (
            <PaymentDetails
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <img
                  src={`data:image/png;base64,${session.qrCode}`}
                  alt="Payment QR Code"
                  style={{ maxWidth: '200px' }}
                />
                <Typography variant="body2" color="textSecondary">
                  QR-kodni skanerlang
                </Typography>
              </Box>
            </PaymentDetails>
          )}
        </AnimatePresence>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel}>
          Bekor qilish
        </Button>
        <Button
          variant="contained"
          type="submit"
          disabled={isLoading}
        >
          To'lash
        </Button>
      </DialogActions>
    </form>
  );
};