import Analytics from 'analytics';
import googleAnalytics from '@analytics/google-analytics';
import segmentPlugin from '@analytics/segment';
import { logger } from '../logger';

export class AnalyticsManager {
  private static instance: AnalyticsManager;
  private analytics: any;

  private constructor() {
    this.initializeAnalytics();
  }

  public static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager();
    }
    return AnalyticsManager.instance;
  }

  private initializeAnalytics(): void {
    this.analytics = Analytics({
      app: 'internet-cafe',
      plugins: [
        googleAnalytics({
          trackingId: import.meta.env.VITE_GA_ID
        }),
        segmentPlugin({
          writeKey: import.meta.env.VITE_SEGMENT_KEY
        })
      ]
    });
  }

  public trackEvent(eventName: string, properties?: object): void {
    try {
      this.analytics.track(eventName, {
        timestamp: new Date(),
        ...properties
      });
    } catch (error) {
      logger.error('Event tracking failed', error);
    }
  }

  public trackPageView(path: string, properties?: object): void {
    try {
      this.analytics.page({
        path,
        timestamp: new Date(),
        ...properties
      });
    } catch (error) {
      logger.error('Page view tracking failed', error);
    }
  }

  public identifyUser(userId: string, traits?: object): void {
    try {
      this.analytics.identify(userId, {
        timestamp: new Date(),
        ...traits
      });
    } catch (error) {
      logger.error('User identification failed', error);
    }
  }

  public trackError(error: Error, context?: object): void {
    try {
      this.analytics.track('Error Occurred', {
        error: error.message,
        stack: error.stack,
        context,
        timestamp: new Date()
      });
    } catch (trackError) {
      logger.error('Error tracking failed', trackError);
    }
  }
} 