import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

export const DataVisualization: React.FC = () => {
  const [timeRange, setTimeRange] = React.useState('week');
  
  const { data: statsData } = useQuery(
    ['statistics', timeRange],
    () => api.get(`/statistics/${timeRange}`).then(res => res.data)
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5">Statistika</Typography>
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

      {/* Daromad grafigi */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Daromad dinamikasi
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={statsData?.revenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Foydalanish statistikasi */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Kompyuterlar band bo'lishi
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statsData?.usage}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Soatlik statistika */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Soatlik foydalanish
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statsData?.hourly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#82ca9d" name="Foydalanuvchilar" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Trend analizi */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Trend analizi
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={statsData?.trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#8884d8"
                name="Foydalanuvchilar"
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#82ca9d"
                name="Daromad"
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
}; 