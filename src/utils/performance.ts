import { logger } from './logger';

export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  private observer: PerformanceObserver;

  constructor() {
    // Performance metrics monitoring
    this.observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.recordMetric(entry.name, entry.duration);
      });
    });

    this.observer.observe({ 
      entryTypes: ['resource', 'paint', 'largest-contentful-paint'] 
    });
  }

  private recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)?.push(value);

    // Alert if performance degrades
    this.checkThresholds(name, value);
  }

  private checkThresholds(name: string, value: number) {
    const thresholds = {
      'first-contentful-paint': 1000,
      'largest-contentful-paint': 2500,
      'time-to-interactive': 3000
    };

    if (thresholds[name] && value > thresholds[name]) {
      logger.warn(`Performance threshold exceeded`, {
        metric: name,
        value,
        threshold: thresholds[name]
      });
    }
  }

  public getMetrics() {
    const result = {};
    this.metrics.forEach((values, key) => {
      result[key] = {
        average: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values)
      };
    });
    return result;
  }

  public clearMetrics() {
    this.metrics.clear();
  }
} 