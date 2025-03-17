import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import api from '../../../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ActivityChart = () => {
  const [data, setData] = useState({
    labels: [],
    datasets: []
  });
  const [view, setView] = useState('hourly');

  useEffect(() => {
    loadData();
  }, [view]);

  const loadData = async () => {
    try {
      const response = await api.get(`/admin/dashboard/activity?view=${view}`);
      
      const colors = {
        bookings: {
          primary: 'rgba(75, 192, 192, 0.8)',
          hover: 'rgba(75, 192, 192, 1)'
        },
        users: {
          primary: 'rgba(255, 99, 132, 0.8)',
          hover: 'rgba(255, 99, 132, 1)'
        },
        revenue: {
          primary: 'rgba(54, 162, 235, 0.8)',
          hover: 'rgba(54, 162, 235, 1)'
        }
      };

      setData({
        labels: response.data.labels,
        datasets: [
          {
            label: 'Buyurtmalar',
            data: response.data.bookings,
            backgroundColor: colors.bookings.primary,
            hoverBackgroundColor: colors.bookings.hover,
            borderRadius: 5
          },
          {
            label: 'Foydalanuvchilar',
            data: response.data.users,
            backgroundColor: colors.users.primary,
            hoverBackgroundColor: colors.users.hover,
            borderRadius: 5
          },
          {
            label: 'Daromad (x10,000 so\'m)',
            data: response.data.revenue.map(v => v / 10000),
            backgroundColor: colors.revenue.primary,
            hoverBackgroundColor: colors.revenue.hover,
            borderRadius: 5
          }
        ]
      });
    } catch (error) {
      console.error('Faollik ma\'lumotlarini yuklashda xatolik:', error);
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            if (context.dataset.label.includes('Daromad')) {
              return `Daromad: ${(context.raw * 10000).toLocaleString()} so'm`;
            }
            return `${context.dataset.label}: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(e, newView) => newView && setView(newView)}
          size="small"
        >
          <ToggleButton value="hourly">Soatlik</ToggleButton>
          <ToggleButton value="daily">Kunlik</ToggleButton>
          <ToggleButton value="weekly">Haftalik</ToggleButton>
          <ToggleButton value="monthly">Oylik</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Bar data={data} options={options} />
    </Box>
  );
};

export default ActivityChart; 