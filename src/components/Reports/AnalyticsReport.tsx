import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAnalytics } from '@/hooks/useAnalytics';
import styled from '@emotion/styled';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const StyledCard = styled(Card)`
  height: 100%;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const MetricValue = styled(Typography)`
  font-size: 2.5rem;
  font-weight: 500;
  color: ${({ theme }) => theme.palette.primary.main};
`;

export const AnalyticsReport: React.FC = () => {
  const [timeRange, setTimeRange] = React.useState('week');
  const { data, isLoading } = useAnalytics(timeRange);

  const metrics = [
    {
      title: 'Jami daromad',
      value: `${data?.totalRevenue.toLocaleString()} so'm`,
      change: '+12%',
    },
    {
      title: 'Faol mijozlar',
      value: data?.activeUsers || 0,
      change: '+5%',
    },
    {
      title: 'O\'rtacha sessiya',
      value: `${data?.averageSession} daqiqa`,
      change: '-2%',
    },
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5">Analitika</Typography>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Vaqt oralig'i</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              label="Vaqt oralig'i"
            >
              <MenuItem value="day">Bugun</MenuItem>
              <MenuItem value="week">Hafta</MenuItem>
              <MenuItem value="month">Oy</MenuItem>
              <MenuItem value="year">Yil</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Grid>

      {metrics.map((metric) => (
        <Grid item xs={12} md={4} key={metric.title}>
          <StyledCard>
            <CardContent>
              <Typography variant="subtitle1" color="textSecondary">
                {metric.title}
              </Typography>
              <MetricValue>{metric.value}</MetricValue>
              <Typography
                variant="body2"
                color={metric.change.startsWith('+') ? 'success.main' : 'error.main'}
              >
                {metric.change} o'tgan davr bilan solishtirganda
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
      ))}

      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Daromad dinamikasi
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data?.revenueChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Kompyuterlar band bo'lishi
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data?.computerUsage}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {data?.computerUsage.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
}; 