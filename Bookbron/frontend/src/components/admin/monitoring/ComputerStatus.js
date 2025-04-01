import React from 'react';
import { Chip } from '@mui/material';
import {
  CheckCircle,
  Warning,
  Block,
  Timer
} from '@mui/icons-material';

const statusConfig = {
  available: {
    label: 'Bo\'sh',
    color: 'success',
    icon: CheckCircle
  },
  busy: {
    label: 'Band',
    color: 'primary',
    icon: Timer
  },
  warning: {
    label: 'Ogohlantirish',
    color: 'warning',
    icon: Warning
  },
  blocked: {
    label: 'Bloklangan',
    color: 'error',
    icon: Block
  }
};

const ComputerStatus = ({ status }) => {
  const config = statusConfig[status] || statusConfig.available;
  
  return (
    <Chip
      label={config.label}
      color={config.color}
      icon={<config.icon />}
      size="small"
    />
  );
};

export default ComputerStatus; 