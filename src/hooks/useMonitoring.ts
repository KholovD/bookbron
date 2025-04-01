import { useQuery } from '@tanstack/react-query';
import { monitoringAPI } from '@/services/api';

export const useMonitoring = () => {
  const { data: systemStats = defaultSystemStats } = useQuery({
    queryKey: ['system-stats'],
    queryFn: () => monitoringAPI.getSystemStats(),
    refetchInterval: 5000 // Har 5 sekundda yangilanadi
  });

  const { data: networkStatus = defaultNetworkStatus } = useQuery({
    queryKey: ['network-status'],
    queryFn: () => monitoringAPI.getNetworkStatus(),
    refetchInterval: 10000 // Har 10 sekundda yangilanadi
  });

  const { data: serverLogs = [] } = useQuery({
    queryKey: ['server-logs'],
    queryFn: () => monitoringAPI.getServerLogs(),
    refetchInterval: 30000 // Har 30 sekundda yangilanadi
  });

  return {
    systemStats,
    networkStatus,
    serverLogs
  };
}; 