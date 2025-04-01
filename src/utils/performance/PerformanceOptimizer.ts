import { logger } from '../logger';

export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private metrics: Map<string, number[]> = new Map();
  private observer: PerformanceObserver;

  private constructor() {
    this.initializeObserver();
  }

  public static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  private initializeObserver(): void {
    this.observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.recordMetric(entry.name, entry.duration);
        this.checkThresholds(entry);
      });
    });

    this.observer.observe({
      entryTypes: ['resource', 'paint', 'largest-contentful-paint', 'navigation']
    });
  }

  private recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)?.push(value);
  }

  private checkThresholds(entry: PerformanceEntry): void {
    const thresholds = {
      'first-contentful-paint': 1000,
      'largest-contentful-paint': 2500,
      'time-to-interactive': 3000
    };

    if (thresholds[entry.name] && entry.duration > thresholds[entry.name]) {
      logger.warn(`Performance threshold exceeded for ${entry.name}`, {
        value: entry.duration,
        threshold: thresholds[entry.name]
      });

      this.optimizePerformance(entry.name);
    }
  }

  private optimizePerformance(metricName: string): void {
    switch (metricName) {
      case 'largest-contentful-paint':
        this.optimizeImageLoading();
        break;
      case 'time-to-interactive':
        this.optimizeInteractivity();
        break;
      default:
        this.generalOptimization();
    }
  }

  private optimizeImageLoading(): void {
    // Lazy loading implementation
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
      img.setAttribute('loading', 'lazy');
    });

    // Image compression check
    const largeImages = Array.from(document.querySelectorAll('img')).filter(
      img => img.naturalWidth > 1000 || img.naturalHeight > 1000
    );
    if (largeImages.length > 0) {
      logger.warn('Large images detected', { count: largeImages.length });
    }
  }

  private optimizeInteractivity(): void {
    // Remove unnecessary event listeners
    this.cleanupEventListeners();

    // Debounce frequent events
    this.debounceEvents();
  }

  private cleanupEventListeners(): void {
    const elements = document.querySelectorAll('*');
    elements.forEach(element => {
      const listeners = getEventListeners(element);
      if (Object.keys(listeners).length > 3) {
        logger.warn('Element with many event listeners', {
          element,
          listenerCount: Object.keys(listeners).length
        });
      }
    });
  }

  private debounceEvents(): void {
    // Implementation of debounce for scroll and resize events
    let timeout: NodeJS.Timeout;
    window.addEventListener('scroll', () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        // Handle scroll event
      }, 150);
    }, { passive: true });
  }

  private generalOptimization(): void {
    // Clear unused timers
    this.clearUnusedTimers();

    // Clean up DOM
    this.cleanupDOM();

    // Optimize memory usage
    this.optimizeMemory();
  }

  private clearUnusedTimers(): void {
    // Clear all registered intervals
    const highestId = window.setInterval(() => {}, 9999);
    for (let i = 1; i < highestId; i++) {
      window.clearInterval(i);
    }
  }

  private cleanupDOM(): void {
    // Remove empty text nodes
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null
    );

    const emptyTextNodes: Text[] = [];
    let node: Text;
    while (node = walker.nextNode() as Text) {
      if (!node.textContent?.trim()) {
        emptyTextNodes.push(node);
      }
    }

    emptyTextNodes.forEach(node => node.remove());
  }

  private optimizeMemory(): void {
    // Clear object references
    this.metrics.forEach((values, key) => {
      if (values.length > 1000) {
        this.metrics.set(key, values.slice(-1000));
      }
    });

    // Suggest garbage collection
    if (window.gc) {
      window.gc();
    }
  }

  public getMetrics(): object {
    const result = {};
    this.metrics.forEach((values, key) => {
      result[key] = {
        average: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        latest: values[values.length - 1]
      };
    });
    return result;
  }
} 