import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  LinearProgress,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Theme,
} from '@mui/material';
import {
  Refresh,
  Memory,
  Storage,
  Speed,
  Warning,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { useMonitoring } from './hooks/useMonitoring';
import { LineChart } from './components/common/LineChart';

const StyledCard = styled(Card)`
  height: 100%;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const MetricValue = styled(Typography)`
  font-size: 2rem;
  font-weight: 500;
  color: ${({ theme }: { theme: Theme }) => theme.palette.primary.main};
`;

const WarningIcon = styled(Warning)`
  color: ${({ theme }: { theme: Theme }) => theme.palette.warning.main};
`;

interface SystemStats {
  cpuUsage: number;
  memoryUsage: number;
}

interface NetworkStatus {
  speed: number;
  history: Array<{time: string, speed: number}>;
}

interface Metric {
  title: string;
  value: string;
  icon: JSX.Element;
  color: 'warning' | 'primary';
  progress: number;
}

export const SystemMonitor: React.FC = () => {
  const {
    systemStats,
    networkStatus,
    serverLogs,
    isLoading,
    refetch
  } = useMonitoring();

  const metrics: Metric[] = [
    {
      title: 'CPU yuklanishi',
      value: `${systemStats.cpuUsage}%`,
      icon: <Memory />,
      color: systemStats.cpuUsage > 80 ? 'warning' : 'primary',
      progress: systemStats.cpuUsage,
    },
    {
      title: 'Xotira (RAM)',
      value: `${systemStats.memoryUsage}%`,
      icon: <Storage />,
      color: systemStats.memoryUsage > 80 ? 'warning' : 'primary',
      progress: systemStats.memoryUsage,
    },
    {
      title: 'Internet tezligi',
      value: `${networkStatus.speed} Mb/s`,
      icon: <Speed />,
      color: networkStatus.speed < 10 ? 'warning' : 'primary',
      progress: (networkStatus.speed / 100) * 100,
    },
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5">Tizim monitoringi</Typography>
          <Tooltip title="Yangilash">
            <IconButton onClick={refetch} disabled={isLoading}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Grid>

      {metrics.map((metric, index) => (
        <Grid item xs={12} md={4} key={metric.title}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StyledCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {metric.icon}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {metric.title}
                  </Typography>
                  {metric.color === 'warning' && (
                    <WarningIcon sx={{ ml: 1 }} />
                  )}
                </Box>
                <MetricValue>{metric.value}</MetricValue>
                <LinearProgress
                  variant="determinate"
                  value={metric.progress}
                  color={metric.color}
                  sx={{ mt: 2 }}
                />
              </CardContent>
            </StyledCard>
          </motion.div>
        </Grid>
      ))}

      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Tarmoq tezligi dinamikasi
          </Typography>
          <LineChart
            data={networkStatus.history}
            xAxis="time"
            yAxis="speed"
            height={300}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};