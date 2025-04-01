import { api } from '@/services/api';
import { logger } from './logger';

export class MaintenanceManager {
  private static instance: MaintenanceManager;

  private constructor() {}

  public static getInstance(): MaintenanceManager {
    if (!MaintenanceManager.instance) {
      MaintenanceManager.instance = new MaintenanceManager();
    }
    return MaintenanceManager.instance;
  }

  // System health check
  public async checkHealth(): Promise<boolean> {
    try {
      const response = await api.get('/health');
      return response.status === 200;
    } catch (error) {
      logger.error('Health check failed', error);
      return false;
    }
  }

  // Cache cleanup
  public clearCache(): void {
    try {
      localStorage.clear();
      sessionStorage.clear();
      caches.keys().then(keys => {
        keys.forEach(key => caches.delete(key));
      });
    } catch (error) {
      logger.error('Cache cleanup failed', error);
    }
  }

  // Error reporting
  public async reportError(error: Error, context?: object): Promise<void> {
    try {
      await api.post('/errors/report', {
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString()
      });
    } catch (reportError) {
      logger.error('Error reporting failed', reportError);
    }
  }

  // System diagnostics
  public async runDiagnostics(): Promise<object> {
    const results = {
      api: false,
      database: false,
      cache: false,
      websocket: false
    };

    try {
      // API check
      results.api = await this.checkHealth();

      // Database check
      const dbCheck = await api.get('/health/database');
      results.database = dbCheck.status === 200;

      // Cache check
      results.cache = await caches.has('app-cache');

      // WebSocket check
      results.websocket = this.checkWebSocket();

      return results;
    } catch (error) {
      logger.error('Diagnostics failed', error);
      return results;
    }
  }

  private checkWebSocket(): boolean {
    try {
      const ws = new WebSocket(import.meta.env.VITE_WS_URL);
      return ws.readyState === WebSocket.CONNECTING;
    } catch {
      return false;
    }
  }
} 