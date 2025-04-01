import { EventEmitter } from 'events';
import { logger } from '../logger';
import { WebSocketManager } from '@/services/WebSocketManager';
import { NotificationService } from '@/services/NotificationService';

interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  activeConnections: number;
  errorRate: number;
}

export class SystemMonitor extends EventEmitter {
  private static instance: SystemMonitor;
  private ws: WebSocketManager;
  private metrics: SystemMetrics = {
    cpuUsage: 0,
    memoryUsage: 0,
    activeConnections: 0,
    errorRate: 0
  };
  private alertThresholds: Map<string, number> = new Map();
  private checkInterval: NodeJS.Timer;

  private constructor() {
    super();
    this.ws = WebSocketManager.getInstance();
    this.initializeMonitoring();
    this.setDefaultThresholds();
  }

  public static getInstance(): SystemMonitor {
    if (!SystemMonitor.instance) {
      SystemMonitor.instance = new SystemMonitor();
    }
    return SystemMonitor.instance;
  }

  private initializeMonitoring(): void {
    this.checkInterval = setInterval(() => {
      this.checkMetrics();
    }, 60000); // Har daqiqada tekshirish

    window.addEventListener('error', (event) => {
      this.recordMetric('errors', {
        message: event.message,
        timestamp: new Date(),
      });
    });

    this.monitorPerformance();
    this.monitorNetwork();
    this.monitorMemory();

    this.ws.subscribe('system:metrics', (data) => {
      this.updateMetrics(data);
      this.checkThresholds();
    });
  }

  private monitorPerformance(): void {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.recordMetric('performance', {
          name: entry.name,
          duration: entry.duration,
          timestamp: new Date(),
        });
      });
    });

    observer.observe({ entryTypes: ['resource', 'navigation', 'paint'] });
  }

  private monitorNetwork(): void {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      connection.addEventListener('change', () => {
        this.recordMetric('network', {
          type: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          timestamp: new Date(),
        });
      });
    }
  }

  private monitorMemory(): void {
    if ('memory' in performance) {
      setInterval(() => {
        this.recordMetric('memory', {
          usage: (performance as any).memory.usedJSHeapSize,
          total: (performance as any).memory.totalJSHeapSize,
          timestamp: new Date(),
        });
      }, 30000);
    }
  }

  private setDefaultThresholds(): void {
    this.alertThresholds.set('memory.usage', 0.9); // 90% memory usage
    this.alertThresholds.set('errors.count', 5); // 5 errors per minute
    this.alertThresholds.set('response.time', 3000); // 3 seconds
  }

  public recordMetric(name: string, value: any): void {
    this.metrics.cpuUsage = (performance as any).cpuUsage;
    this.metrics.memoryUsage = (performance as any).memoryUsage;
    this.metrics.activeConnections = this.ws.activeConnections;
    this.metrics.errorRate = this.ws.errorRate;
    this.emit('metric', { name, value });
    this.checkThreshold(name, value);
  }

  private checkThreshold(name: string, value: any): void {
    const threshold = this.alertThresholds.get(name);
    if (threshold && value > threshold) {
      this.emit('alert', {
        metric: name,
        value,
        threshold,
        timestamp: new Date(),
      });
      
      logger.warn(`Threshold exceeded for ${name}`, {
        value,
        threshold,
      });
    }
  }

  public getMetrics(): object {
    const result = {};
    Object.entries(this.metrics).forEach(([key, value]) => {
      result[key] = value;
    });
    return result;
  }

  public setThreshold(metric: string, value: number): void {
    this.alertThresholds.set(metric, value);
  }

  public destroy(): void {
    clearInterval(this.checkInterval);
    this.removeAllListeners();
  }

  private updateMetrics(data: Partial<SystemMetrics>): void {
    this.metrics = { ...this.metrics, ...data };
  }

  private async checkThresholds(): Promise<void> {
    if (this.metrics.cpuUsage > this.thresholds.cpuUsage) {
      await NotificationService.sendAlert({
        type: 'warning',
        message: `CPU usage is high: ${this.metrics.cpuUsage}%`
      });
    }

    if (this.metrics.memoryUsage > this.thresholds.memoryUsage) {
      await NotificationService.sendAlert({
        type: 'critical',
        message: `Memory usage is critical: ${this.metrics.memoryUsage}%`
      });
    }
  }
} 