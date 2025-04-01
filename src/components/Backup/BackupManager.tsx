import React from 'react';
import {
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert
} from '@mui/material';
import { Download, Delete, Restore } from '@mui/icons-material';
import { useBackup } from '@/hooks/useBackup';

export const BackupManager: React.FC = () => {
  const {
    backups,
    isLoading,
    error,
    createBackup,
    restoreBackup,
    deleteBackup,
    downloadBackup
  } = useBackup();

  const [selectedBackup, setSelectedBackup] = React.useState<string | null>(null);
  const [restoreDialogOpen, setRestoreDialogOpen] = React.useState(false);

  const handleRestore = async () => {
    if (selectedBackup) {
      await restoreBackup(selectedBackup);
      setRestoreDialogOpen(false);
      setSelectedBackup(null);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Ma'lumotlar arxivi
      </Typography>

      <Button
        variant="contained"
        onClick={createBackup}
        disabled={isLoading}
        sx={{ mb: 3 }}
      >
        {isLoading ? <CircularProgress size={24} /> : 'Yangi arxiv yaratish'}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <List>
        {backups.map((backup) => (
          <ListItem key={backup.id} divider>
            <ListItemText
              primary={new Date(backup.createdAt).toLocaleString()}
              secondary={`Hajmi: ${backup.size} MB`}
            />
            <ListItemSecondaryAction>
              <IconButton 
                onClick={() => downloadBackup(backup.id)}
                title="Yuklab olish"
              >
                <Download />
              </IconButton>
              <IconButton
                onClick={() => {
                  setSelectedBackup(backup.id);
                  setRestoreDialogOpen(true);
                }}
                title="Tiklash"
              >
                <Restore />
              </IconButton>
              <IconButton
                onClick={() => deleteBackup(backup.id)}
                title="O'chirish"
                color="error"
              >
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog
        open={restoreDialogOpen}
        onClose={() => setRestoreDialogOpen(false)}
      >
        <DialogTitle>Arxivdan tiklash</DialogTitle>
        <DialogContent>
          <Typography>
            Tizimni tanlangan arxiv holatiga qaytarishni xohlaysizmi?
            Bu jarayon bir necha daqiqa vaqt olishi mumkin.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRestoreDialogOpen(false)}>
            Bekor qilish
          </Button>
          <Button onClick={handleRestore} variant="contained" color="warning">
            Tiklash
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}; 