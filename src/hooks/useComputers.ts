import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { computersAPI } from '@/services/api';
import { showNotification } from '@/utils/notification';

export const useComputers = () => {
  const queryClient = useQueryClient();

  const { data: computers = [], isLoading } = useQuery({
    queryKey: ['computers'],
    queryFn: () => computersAPI.getAll()
  });

  const controlMutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'restart' | 'shutdown' }) =>
      computersAPI.control(id, action),
    onSuccess: () => {
      queryClient.invalidateQueries(['computers']);
      showNotification('Computer control action successful', 'success');
    },
    onError: (error) => {
      showNotification('Failed to control computer', 'error');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Computer> }) =>
      computersAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['computers']);
      showNotification('Computer updated successfully', 'success');
    }
  });

  return {
    computers,
    isLoading,
    controlComputer: controlMutation.mutate,
    updateComputer: updateMutation.mutate
  };
}; 