import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/material';
import {
  Computer,
  Person,
  Warning,
  Block,
  CheckCircle
} from '@mui/icons-material';
import api from '../../../services/api';

const TimelineView = ({ open, computer, onClose }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (computer && open) {
      loadEvents();
    }
  }, [computer, open]);

  const loadEvents = async () => {
    try {
      const response = await api.get(`/admin/computers/${computer._id}/timeline`);
      setEvents(response.data);
    } catch (error) {
      console.error('Tarix yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'booking': return <Person />;
      case 'warning': return <Warning />;
      case 'blocked': return <Block />;
      case 'unblocked': return <CheckCircle />;
      default: return <Computer />;
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'booking': return 'primary';
      case 'warning': return 'warning';
      case 'blocked': return 'error';
      case 'unblocked': return 'success';
      default: return 'grey';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        PC #{computer?.number} - Vaqt tarixi
      </DialogTitle>
      <DialogContent>
        <Timeline>
          {events.map((event, index) => (
            <TimelineItem key={event._id}>
              <TimelineSeparator>
                <TimelineDot color={getEventColor(event.type)}>
                  {getEventIcon(event.type)}
                </TimelineDot>
                {index < events.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="subtitle2">
                    {event.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(event.timestamp).toLocaleString()}
                  </Typography>
                  {event.description && (
                    <Typography variant="body2">
                      {event.description}
                    </Typography>
                  )}
                </Box>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </DialogContent>
    </Dialog>
  );
};

export default TimelineView; 