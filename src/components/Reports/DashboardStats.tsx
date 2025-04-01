import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { 
  TrendingUp, 
  Computer, 
  Person, 
  AttachMoney 
} from '@mui/icons-material';
import { useStats } from '@/hooks/useStats';
import { formatCurrency } from '@/utils/format';
import { LineChart } from './LineChart';

export const DashboardStats: React.FC = () => {
  const { 
    dailyStats, 
    isLoading,
    totalRevenue,
    activeUsers,
    computerUsage
  } = useStats();

  return (
    <Grid container spacing={3}>
      {/* Statistika kartalari */}
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <AttachMoney color="primary" />
            <Typography variant="h6" sx={{ ml: 1 }}>
              Bugungi tushum
            </Typography>
          </Box>
          <Typography variant="h4">
            {formatCurrency(totalRevenue.daily)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Kecha: {formatCurrency(totalRevenue.yesterday)}
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Person color="primary" />
            <Typography variant="h6" sx={{ ml: 1 }}>
              Faol mijozlar
            </Typography>
          </Box>
          <Typography variant="h4">{activeUsers.current}</Typography>
          <Typography variant="body2" color="text.secondary">
            Bugun tashrif: {activeUsers.total}
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Computer color="primary" />
            <Typography variant="h6" sx={{ ml: 1 }}>
              Kompyuterlar holati
            </Typography>
          </Box>
          <Typography variant="h4">
            {computerUsage.active}/{computerUsage.total}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Band: {computerUsage.usagePercentage}%
          </Typography>
        </Paper>
      </Grid>

      {/* Grafik */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Soatlik foydalanish statistikasi
          </Typography>
          <LineChart 
            data={dailyStats.hourlyUsage}
            xAxis="hour"
            yAxis="users"
            height={300}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}; 