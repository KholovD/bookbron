import { StorageService } from '@/services/StorageService';
import { NotificationService } from '@/services/NotificationService';

interface BackupConfig {
  frequency: 'daily' | 'weekly' | 'monthly';
  retention: number; // days to keep backups
  type: 'full' | 'incremental';
}

export class BackupManager {
  private static instance: BackupManager;
  private config: BackupConfig = {
    frequency: 'daily',
    retention: 30,
    type: 'full'
  };

  private constructor() {
    this.initializeBackupSchedule();
  }

  static getInstance(): BackupManager {
    if (!BackupManager.instance) {
      BackupManager.instance = new BackupManager();
    }
    return BackupManager.instance;
  }

  private initializeBackupSchedule(): void {
    // Schedule daily backups at 2 AM
    const schedule = require('node-schedule');
    schedule.scheduleJob('0 2 * * *', () => {
      this.createBackup();
    });
  }

  async createBackup(): Promise<void> {
    try {
      const timestamp = new Date().toISOString();
      const data = await this.gatherBackupData();
      
      await StorageService.uploadBackup({
        data,
        timestamp,
        type: this.config.type
      });

      await this.cleanupOldBackups();
      
      await NotificationService.sendAlert({
        type: 'info',
        message: `Backup created successfully at ${timestamp}`
      });
    } catch (error) {
      await NotificationService.sendAlert({
        type: 'error',
        message: `Backup failed: ${error.message}`
      });
    }
  }

  private async gatherBackupData() {
    // Gather all necessary data for backup
    const data = {
      database: await this.getDatabaseDump(),
      files: await this.getFileSystemData(),
      config: await this.getSystemConfig()
    };
    return data;
  }

  private async cleanupOldBackups(): Promise<void> {
    const oldBackups = await StorageService.listBackups({
      olderThan: this.config.retention
    });

    for (const backup of oldBackups) {
      await StorageService.deleteBackup(backup.id);
    }
  }

  public async restoreFromBackup(backupId: string): Promise<void> {
    try {
      const { data } = await api.get(`/backup/${backupId}`);

      // Restore local data
      if (data.localStorage) {
        localStorage.clear();
        Object.entries(data.localStorage).forEach(([key, value]) => {
          localStorage.setItem(key, value as string);
        });
      }

      if (data.sessionStorage) {
        sessionStorage.clear();
        Object.entries(data.sessionStorage).forEach(([key, value]) => {
          sessionStorage.setItem(key, value as string);
        });
      }

      logger.info('Backup restored successfully');
    } catch (error) {
      logger.error('Backup restoration failed', error);
      throw error;
    }
  }

  public async getBackupsList(): Promise<any[]> {
    try {
      const { data } = await api.get('/backup/list');
      return data;
    } catch (error) {
      logger.error('Failed to fetch backups list', error);
      throw error;
    }
  }

  public async deleteBackup(backupId: string): Promise<void> {
    try {
      await api.delete(`/backup/${backupId}`);
      logger.info('Backup deleted successfully');
    } catch (error) {
      logger.error('Backup deletion failed', error);
      throw error;
    }
  }

  public destroy(): void {
    if (this.backupSchedule) {
      clearInterval(this.backupSchedule);
    }
  }
} 