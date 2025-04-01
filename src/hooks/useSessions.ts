import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionsAPI } from '@/services/api';
import { showNotification } from '@/utils/notification';

export const useSessions = () => {
  const queryClient = useQueryClient();

  const { data: activeSessions = [], isLoading } = useQuery({
    queryKey: ['active-sessions'],
    queryFn: () => sessionsAPI.getActive(),
    refetchInterval: 30000 // Har 30 sekundda yangilanadi
  });

  const endSessionMutation = useMutation({
    mutationFn: (sessionId: string) => sessionsAPI.end(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries(['active-sessions']);
      showNotification('Session ended successfully', 'success');
    }
  });

  const calculateCurrentCost = (session: Session) => {
    const duration = new Date().getTime() - new Date(session.startTime).getTime();
    const hours = duration / (1000 * 60 * 60);
    return Math.ceil(hours * session.hourlyRate);
  };

  return {
    activeSessions,
    isLoading,
    endSession: endSessionMutation.mutate,
    calculateCurrentCost
  };
}; 