import React from 'react';
import {
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

export const UserGuide: React.FC = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Foydalanuvchi qo'llanmasi
      </Typography>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Tizimga kirish</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItem>
              <ListItemText
                primary="1. Login va parolni kiriting"
                secondary="Admin panelga kirish uchun sizga berilgan login va paroldan foydalaning"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="2. Ikki bosqichli autentifikatsiya"
                secondary="Agar yoqilgan bo'lsa, telefoningizga yuborilgan kodni kiriting"
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Kompyuterlarni boshqarish</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItem>
              <ListItemText
                primary="Kompyuter qo'shish"
                secondary="Yangi kompyuter qo'shish uchun 'Qo'shish' tugmasini bosing va ma'lumotlarni kiriting"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Kompyuterni o'chirish"
                secondary="Kompyuterni tanlang va 'O'chirish' tugmasini bosing"
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Boshqa bo'limlar... */}
    </Paper>
  );
}; 