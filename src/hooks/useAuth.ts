import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login as loginAction } from '@/store/slices/authSlice';
import { authAPI } from '@/services/api';
import { showNotification } from '@/utils/notification';

export const useAuth = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: { username: string; password: string }) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authAPI.login(credentials);
      dispatch(loginAction(response.data));
      showNotification('Tizimga muvaffaqiyatli kirdingiz', 'success');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Tizimga kirishda xatolik yuz berdi');
      showNotification('Tizimga kirishda xatolik', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
    error
  };
}; 