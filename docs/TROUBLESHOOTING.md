# Troubleshooting Guide

## Common Issues

### 1. Authentication Issues

#### Login Failed
```typescript
// Muammoni aniqlash
const diagnoseLoginIssue = async () => {
  try {
    // Token tekshirish
    const token = localStorage.getItem('token');
    if (!token) {
      return 'Token topilmadi';
    }

    // Token validate
    const isValid = await validateToken(token);
    if (!isValid) {
      return 'Token yaroqsiz';
    }

    // Server connection
    const response = await fetch('/api/health');
    if (!response.ok) {
      return 'Server bilan aloqa yo\'q';
    }
  } catch (error) {
    logger.error('Login diagnosis failed', error);
  }
};
```

#### Yechim:
1. Browser cache tozalash
2. Local storage tozalash
3. Qayta login qilish

### 2. Performance Issues

#### Slow Loading
```typescript
// Performance monitoring
const monitorPageLoad = () => {
  const metrics = {
    FCP: 0, // First Contentful Paint
    LCP: 0, // Largest Contentful Paint
    TTI: 0, // Time to Interactive
  };

  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach(entry => {
      metrics[entry.name] = entry.startTime;
      logger.info('Performance metric:', {
        metric: entry.name,
        value: entry.startTime
      });
    });
  }).observe({ entryTypes: ['paint', 'largest-contentful-paint'] });

  return metrics;
};
```

#### Yechim:
1. Code splitting tekshirish
2. Image optimization
3. Caching strategy review

### 3. WebSocket Issues

#### Connection Lost
```typescript
// WebSocket reconnection
class WebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect() {
    try {
      this.ws = new WebSocket(WS_URL);
      this.setupListeners();
    } catch (error) {
      this.handleConnectionError(error);
    }
  }

  private handleConnectionError(error: Error) {
    logger.error('WebSocket connection failed', error);
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => this.connect(), 1000 * this.reconnectAttempts);
    }
  }
}
```

#### Yechim:
1. Network connection tekshirish
2. Firewall settings
3. Server status verification 