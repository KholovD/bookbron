import React from 'react';
import { 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box,
  Link,
  Alert
} from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const loginSchema = yup.object({
  username: yup.string().required('Login kiritish shart'),
  password: yup.string().required('Parol kiritish shart')
});

export const LoginForm: React.FC = () => {
  const { login, isLoading, error } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema)
  });

  const onSubmit = async (data: any) => {
    await login(data);
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      bgcolor: 'background.default'
    }}>
      <Paper sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h5" align="center" gutterBottom>
          Internet Kafe Admin Panel
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register('username')}
            label="Login"
            fullWidth
            margin="normal"
            error={!!errors.username}
            helperText={errors.username?.message}
          />

          <TextField
            {...register('password')}
            label="Parol"
            type="password"
            fullWidth
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ mt: 2 }}
            disabled={isLoading}
          >
            {isLoading ? 'Kirish...' : 'Kirish'}
          </Button>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link href="/forgot-password" variant="body2">
              Parolni unutdingizmi?
            </Link>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}; 