import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import api from '../../../services/api';

const UsageHeatmap = () => {
  const [data, setData] = useState([]);
  const days = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await api.get('/admin/dashboard/usage-heatmap');
      setData(response.data);
    } catch (error) {
      console.error('Heatmap ma\'lumotlarini yuklashda xatolik:', error);
    }
  };

  const getColor = (value) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const intensity = value / maxValue;
    return `rgba(75, 192, 192, ${intensity})`;
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Kompyuterlardan foydalanish vaqtlari
      </Typography>
      
      <Box sx={{ overflowX: 'auto' }}>
        <Box sx={{ display: 'flex', mb: 1 }}>
          <Box sx={{ width: 50 }} />
          {hours.map(hour => (
            <Box
              key={hour}
              sx={{
                width: 30,
                textAlign: 'center',
                fontSize: '0.75rem'
              }}
            >
              {hour}
            </Box>
          ))}
        </Box>

        {days.map((day, dayIndex) => (
          <Box key={day} sx={{ display: 'flex', mb: 1 }}>
            <Box
              sx={{
                width: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem'
              }}
            >
              {day}
            </Box>
            {hours.map(hour => {
              const cellData = data.find(d => d.day === dayIndex && d.hour === hour);
              return (
                <Box
                  key={`${day}-${hour}`}
                  sx={{
                    width: 30,
                    height: 30,
                    backgroundColor: getColor(cellData?.value || 0),
                    border: '1px solid #fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    color: cellData?.value > 0 ? '#fff' : 'transparent',
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.8
                    }
                  }}
                  title={`${day} ${hour}:00 - ${cellData?.value || 0} buyurtma`}
                >
                  {cellData?.value || 0}
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>

      <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>
        * Raqamlar band bo'lish sonini ko'rsatadi
      </Typography>
    </Paper>
  );
};

export default UsageHeatmap; 