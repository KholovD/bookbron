import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  IconButton,
  Box,
  Tooltip,
  Badge,
  Dialog,
} from '@mui/material';
import {
  Computer,
  PowerSettingsNew,
  Warning,
  CheckCircle,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { useComputers } from '@/hooks/useComputers';
import { ComputerControl } from './ComputerControl';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

interface Computer {
  id: string;
  name: string;
  status: 'active' | 'maintenance' | 'offline';
}

const StyledPaper = styled(Paper)`
  padding: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const StatusBadge = styled(Badge)`
  .MuiBadge-badge {
    right: -3px;
    top: 13px;
    border: 2px solid ${({ theme }) => theme.palette.background.paper};
    padding: 0 4px;
  }
`;

export const ComputerGrid = () => {
  const { computers, isLoading, controlComputer } = useComputers();
  const [selectedComputer, setSelectedComputer] = useState<Computer | null>(null);
  const [layout, setLayout] = useState([]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'maintenance': return 'warning';
      case 'offline': return 'error';
      default: return 'default';
    }
  };

  const handleControlClick = (computer: Computer) => {
    setSelectedComputer(computer);
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={100}
        width={1200}
        onLayoutChange={setLayout}
        isDraggable
        isResizable
      >
        {computers.map((computer) => (
          <motion.div
            key={computer.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <StyledPaper onClick={() => handleControlClick(computer)}>
              <StatusBadge
                color={getStatusColor(computer.status)}
                variant="dot"
              >
                <Computer fontSize="large" />
              </StatusBadge>
              <Typography variant="h6" sx={{ mt: 2 }}>
                {computer.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {computer.status}
              </Typography>
              <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                <Tooltip title="Boshqarish">
                  <IconButton size="small">
                    <PowerSettingsNew />
                  </IconButton>
                </Tooltip>
              </Box>
            </StyledPaper>
          </motion.div>
        ))}
      </GridLayout>

      <Dialog
        open={Boolean(selectedComputer)}
        onClose={() => setSelectedComputer(null)}
        maxWidth="sm"
        fullWidth
      >
        {selectedComputer && (
          <ComputerControl
            computer={selectedComputer}
            onClose={() => setSelectedComputer(null)}
            onControl={controlComputer}
          />
        )}
      </Dialog>
    </Box>
  );
}; 