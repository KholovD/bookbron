import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Container,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { LoadingButton } from '@mui/lab';
import styled from '@emotion/styled';

const StyledPaper = styled(Paper)`
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const Background = styled(Box)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #6B73FF 0%, #000DFF 100%);
  z-index: -1;
`;

const AnimatedContainer = styled(motion.div)`
  width: 100%;
`;

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <>
      <Background />
      <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
        <AnimatedContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StyledPaper>
            <Typography variant="h4" align="center" gutterBottom>
              Internet Cafe
            </Typography>
            <Typography variant="subtitle1" align="center" sx={{ mb: 4 }}>
              Admin paneliga kirish
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
              />
              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isLoading}
                sx={{ mt: 3 }}
              >
                Kirish
              </LoadingButton>
            </form>
          </StyledPaper>
        </AnimatedContainer>
      </Container>
    </>
  );
};