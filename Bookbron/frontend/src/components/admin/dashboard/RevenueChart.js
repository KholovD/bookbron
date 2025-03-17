import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Box, FormControl, Select, MenuItem } from '@mui/material';
import api from '../../../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const RevenueChart = () => {
  const [data, setData] = useState({
    labels: [],
    datasets: []
  });
  const [period, setPeriod] = useState('week');

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    try {
      const response = await api.get(`/admin/dashboard/revenue?period=${period}`);
      
      setData({
        labels: response.data.map(item => item.date),
        datasets: [
          {
            label: 'Daromad',
            data: response.data.map(item => item.revenue),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Buyurtmalar',
            data: response.data.map(item => item.bookings * 10000), // Scale for visualization
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: true,
            tension: 0.4,
            yAxisID: 'bookings'
          }
        ]
      });
    } catch (error) {
      console.error('Daromad ma\'lumotlarini yuklashda xatolik:', error);
    }
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            if (context.datasetIndex === 0) {
              return `Daromad: ${context.raw.toLocaleString()} so'm`;
            } else {
              return `Buyurtmalar: ${(context.raw / 10000).toFixed(0)} ta`;
            }
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        ticks: {
          callback: function(value) {
            return value.toLocaleString() + ' so\'m';
          }
        }
      },
      bookings: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value) {
            return (value / 10000).toFixed(0) + ' ta';
          }
        }
      }
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <FormControl size="small" sx={{ width: 120 }}>
          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <MenuItem value="day">Bugun</MenuItem>
            <MenuItem value="week">Hafta</MenuItem>
            <MenuItem value="month">Oy</MenuItem>
            <MenuItem value="year">Yil</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Line data={data} options={options} />
    </Box>
  );
};

export default RevenueChart; 