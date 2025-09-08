/**
 * Analytics and Error Tracking Utilities
 * Provides production monitoring capabilities
 */

// Analytics configuration
interface AnalyticsConfig {
  enabled: boolean;
  environment: string;
  version: string;
}

interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  customDimensions?: Record<string, string>;
}

interface ErrorTrackingEvent {
  error: Error;
  context?: string;
  userId?: string;
  url?: string;
  userAgent?: string;
  timestamp: number;
}

class Analytics {
  private config: AnalyticsConfig;
  private userId?: string;

  constructor() {
    this.config = {
      enabled: import.meta.env.VITE_ANALYTICS_ENABLED === 'true',
      environment: import.meta.env.VITE_ENVIRONMENT || 'development',
      version: import.meta.env.VITE_BUILD_VERSION || 'unknown'
    };

    // Initialize in production only
    if (this.config.enabled) {
      this.initialize();
    }
  }

  private initialize(): void {
    if (this.config.environment === 'production') {
      console.log('📊 Analytics initialized for production');
      
      // Initialize Google Analytics 4 (example)
      // Replace with your actual analytics service
      this.loadGoogleAnalytics();
    }
  }

  private loadGoogleAnalytics(): void {
    // Example GA4 implementation
    // const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';
    
    // Create script tag for GA4
    // const script = document.createElement('script');
    // script.async = true;
    // script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    // document.head.appendChild(script);

    // Initialize gtag
    // window.gtag = function() {
    //   (window as any).dataLayer = (window as any).dataLayer || [];
    //   (window as any).dataLayer.push(arguments);
    // };

    // window.gtag('js', new Date());
    // window.gtag('config', GA_MEASUREMENT_ID);
  }

  public setUserId(userId: string): void {
    this.userId = userId;
    
    if (this.config.enabled) {
      // Set user ID in analytics service
      console.log(`📊 Setting user ID: ${this.userId}`);
      // window.gtag && window.gtag('config', 'GA_MEASUREMENT_ID', { user_id: this.userId });
    }
  }

  public trackEvent(event: AnalyticsEvent): void {
    if (!this.config.enabled) return;

    console.log('📊 Tracking event:', event);

    // Send to analytics service
    if (this.config.environment === 'production') {
      // window.gtag && window.gtag('event', event.action, {
      //   event_category: event.category,
      //   event_label: event.label,
      //   value: event.value,
      //   custom_map: event.customDimensions
      // });
    }
  }

  public trackPageView(path: string, title?: string): void {
    if (!this.config.enabled) return;

    console.log(`📊 Tracking page view: ${path}${title ? ` - ${title}` : ''}`);

    if (this.config.environment === 'production') {
      // window.gtag && window.gtag('config', 'GA_MEASUREMENT_ID', {
      //   page_path: path,
      //   page_title: title || document.title
      // });
    }
  }

  public trackUserInteraction(action: string, element: string, context?: string): void {
    this.trackEvent({
      event: 'user_interaction',
      category: 'engagement',
      action,
      label: element,
      customDimensions: context ? { context } : undefined
    });
  }

  public trackPerformanceMetric(metric: string, value: number, unit = 'ms'): void {
    this.trackEvent({
      event: 'performance_metric',
      category: 'performance',
      action: metric,
      value,
      customDimensions: { unit }
    });
  }
}

class ErrorTracking {
  private config: AnalyticsConfig;
  private errorQueue: ErrorTrackingEvent[] = [];

  constructor() {
    this.config = {
      enabled: import.meta.env.VITE_ERROR_TRACKING_ENABLED === 'true',
      environment: import.meta.env.VITE_ENVIRONMENT || 'development',
      version: import.meta.env.VITE_BUILD_VERSION || 'unknown'
    };

    if (this.config.enabled) {
      this.setupGlobalErrorHandlers();
    }
  }

  private setupGlobalErrorHandlers(): void {
    // Handle uncaught JavaScript errors
    window.addEventListener('error', (event) => {
      this.trackError(new Error(event.message), 'global_error', {
        filename: event.filename,
        lineno: event.lineno.toString(),
        colno: event.colno.toString()
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(
        new Error(`Unhandled Promise Rejection: ${event.reason}`),
        'promise_rejection'
      );
    });
  }

  public trackError(
    error: Error,
    context = 'unknown',
    additionalData?: Record<string, string>
  ): void {
    const errorEvent: ErrorTrackingEvent = {
      error,
      context,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now()
    };

    // Log locally
    if (this.config.environment === 'development') {
      console.error('🚨 Error tracked:', {
        message: error.message,
        stack: error.stack,
        context,
        additionalData
      });
    }

    // Queue for sending to error tracking service
    this.errorQueue.push(errorEvent);

    // Send to error tracking service in production
    if (this.config.enabled && this.config.environment === 'production') {
      this.sendErrorToService(errorEvent, additionalData);
    }
  }

  private sendErrorToService(
    errorEvent: ErrorTrackingEvent,
    additionalData?: Record<string, string>
  ): void {
    // Send to error tracking service (e.g., Sentry, LogRocket, etc.)
    console.log('🚨 Sending error to tracking service:', {
      ...errorEvent,
      additionalData
    });

    // Example implementation for custom error tracking
    // fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     message: errorEvent.error.message,
    //     stack: errorEvent.error.stack,
    //     context: errorEvent.context,
    //     url: errorEvent.url,
    //     userAgent: errorEvent.userAgent,
    //     timestamp: errorEvent.timestamp,
    //     version: this.config.version,
    //     environment: this.config.environment,
    //     additionalData
    //   })
    // }).catch(err => console.error('Failed to send error to tracking service:', err));
  }

  public getErrorQueue(): ErrorTrackingEvent[] {
    return [...this.errorQueue];
  }

  public clearErrorQueue(): void {
    this.errorQueue = [];
  }
}

// Performance monitoring utilities
class PerformanceMonitor {
  private analytics: Analytics;
  private startTimes: Map<string, number> = new Map();

  constructor(analytics: Analytics) {
    this.analytics = analytics;
  }

  public startTiming(label: string): void {
    this.startTimes.set(label, performance.now());
  }

  public endTiming(label: string): number {
    const startTime = this.startTimes.get(label);
    if (!startTime) {
      console.warn(`⚠️ No start time found for timing label: ${label}`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.startTimes.delete(label);
    
    this.analytics.trackPerformanceMetric(label, Math.round(duration));
    
    return duration;
  }

  public measureAsync<T>(label: string, asyncFn: () => Promise<T>): Promise<T> {
    this.startTiming(label);
    
    return asyncFn()
      .finally(() => {
        this.endTiming(label);
      });
  }

  public getPageLoadMetrics(): void {
    // Get Core Web Vitals and other performance metrics
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        this.analytics.trackPerformanceMetric('page_load_time', Math.round(navigation.loadEventEnd - navigation.fetchStart));
        this.analytics.trackPerformanceMetric('dom_content_loaded', Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart));
        this.analytics.trackPerformanceMetric('time_to_first_byte', Math.round(navigation.responseStart - navigation.fetchStart));
      }
    }
  }
}

// Singleton instances
export const analytics = new Analytics();
export const errorTracking = new ErrorTracking();
export const performanceMonitor = new PerformanceMonitor(analytics);

// Convenience exports
export const trackEvent = analytics.trackEvent.bind(analytics);
export const trackPageView = analytics.trackPageView.bind(analytics);
export const trackError = errorTracking.trackError.bind(errorTracking);
export const trackUserInteraction = analytics.trackUserInteraction.bind(analytics);

// Initialize analytics when module loads
export const initializeAnalytics = (): void => {
  if (import.meta.env.VITE_ENVIRONMENT === 'production') {
    console.log('🚀 Production analytics and monitoring initialized');
    
    // Track initial page load
    trackPageView(window.location.pathname, document.title);
    
    // Measure page load performance
    setTimeout(() => {
      performanceMonitor.getPageLoadMetrics();
    }, 0);
  }
};

// Auto-initialize
if (typeof window !== 'undefined') {
  initializeAnalytics();
}
