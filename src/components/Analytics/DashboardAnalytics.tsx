import React from 'react';
import {
  Paper,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useAnalytics } from '@/hooks/useAnalytics';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const DashboardAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = React.useState('week');
  const { 
    revenueData,
    usageStats,
    popularTimes,
    computerUtilization,
    isLoading
  } = useAnalytics(timeRange);

  return (
    <Grid container spacing={3}>
      {/* Vaqt oralig'ini tanlash */}
      <Grid item xs={12}>
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
      </Grid>

      {/* Daromad grafigi */}
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Daromad dinamikasi
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#8884d8" 
                name="Daromad"
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Kompyuterlar band bo'lishi */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Kompyuterlar band bo'lishi
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={computerUtilization}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {computerUtilization.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Mashg'ul vaqtlar */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Mashg'ul vaqtlar
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={popularTimes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#82ca9d" name="Foydalanuvchilar" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
}; 