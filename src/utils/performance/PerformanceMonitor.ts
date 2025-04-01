import { MetricsService } from '@/services/MetricsService';

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics = {
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
    ttfb: 0
  };

  private constructor() {
    this.initializeObservers();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializeObservers(): void {
    // Web Vitals monitoring
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          this.metrics.lcp = entry.startTime;
        }
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.entryType === 'first-input') {
          this.metrics.fid = entry.processingStart - entry.startTime;
        }
      }
    }).observe({ entryTypes: ['first-input'] });
  }

  async reportMetrics(): Promise<void> {
    try {
      await MetricsService.sendMetrics({
        ...this.metrics,
        timestamp: Date.now(),
        userAgent: navigator.userAgent
      });
    } catch (error) {
      console.error('Failed to report metrics:', error);
    }
  }
} 