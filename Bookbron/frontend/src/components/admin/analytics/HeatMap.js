import React from 'react';
import { Box, Typography } from '@mui/material';

const HeatMap = ({ data }) => {
  const days = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getColor = (value) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const intensity = value / maxValue;
    return `rgba(75, 192, 192, ${intensity})`;
  };

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Box sx={{ display: 'flex', mb: 1 }}>
        <Box sx={{ width: 50 }} /> {/* Placeholder for days column */}
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
                  color: cellData?.value > 0 ? '#fff' : 'transparent'
                }}
              >
                {cellData?.value || 0}
              </Box>
            );
          })}
        </Box>
      ))}

      <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>
        * Raqamlar band bo'lish sonini ko'rsatadi
      </Typography>
    </Box>
  );
};

export default HeatMap; 