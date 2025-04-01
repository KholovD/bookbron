import { useQuery } from '@tanstack/react-query';
import { sessionsAPI } from '@/services/api';

export const useStats = () => {
  const { data: dailyStats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['daily-stats'],
    queryFn: () => sessionsAPI.getStats('daily'),
    refetchInterval: 300000 // Har 5 daqiqada yangilanadi
  });

  const { data: totalRevenue } = useQuery({
    queryKey: ['revenue'],
    queryFn: () => sessionsAPI.getRevenue(),
    refetchInterval: 300000
  });

  const { data: computerUsage } = useQuery({
    queryKey: ['computer-usage'],
    queryFn: () => sessionsAPI.getComputerUsage(),
    refetchInterval: 60000 // Har daqiqada yangilanadi
  });

  return {
    dailyStats: dailyStats || {
      hourlyUsage: [],
      totalSessions: 0,
      averageSessionDuration: 0
    },
    totalRevenue: totalRevenue || {
      daily: 0,
      yesterday: 0,
      weekly: 0
    },
    computerUsage: computerUsage || {
      total: 0,
      active: 0,
      maintenance: 0,
      usagePercentage: 0
    },
    isLoading: isStatsLoading
  };
}; 