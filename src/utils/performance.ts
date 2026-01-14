// Performance monitoring utility
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Monitor Core Web Vitals
  monitorCoreWebVitals() {
    // LCP (Largest Contentful Paint)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as PerformanceEntry;
          this.metrics.set('LCP', lastEntry.startTime);
          console.log('LCP:', lastEntry.startTime, 'ms');
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('LCP monitoring failed:', e);
      }

      // FID (First Input Delay)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const firstEntry = entries[0] as PerformanceEntry;
          this.metrics.set('FID', firstEntry.processingStart - firstEntry.startTime);
          console.log('FID:', firstEntry.processingStart - firstEntry.startTime, 'ms');
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        console.warn('FID monitoring failed:', e);
      }

      // CLS (Cumulative Layout Shift)
      try {
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          this.metrics.set('CLS', clsValue);
          console.log('CLS:', clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.warn('CLS monitoring failed:', e);
      }
    }

    // FCP (First Contentful Paint)
    if ('PerformanceObserver' in window) {
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const firstEntry = entries[0] as PerformanceEntry;
          this.metrics.set('FCP', firstEntry.startTime);
          console.log('FCP:', firstEntry.startTime, 'ms');
        });
        fcpObserver.observe({ entryTypes: ['first-contentful-paint'] });
      } catch (e) {
        console.warn('FCP monitoring failed:', e);
      }
    }
  }

  // Monitor font loading
  monitorFontLoading() {
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        const loadTime = performance.now();
        this.metrics.set('FontLoadTime', loadTime);
        console.log('Fonts loaded in:', loadTime, 'ms');
        
        // Check if Inter font is available
        if (document.fonts.check('1em Inter')) {
          console.log('Inter font successfully loaded');
        } else {
          console.warn('Inter font not available, using fallback');
        }
      });
    }
  }

  // Get all metrics
  getMetrics(): Map<string, number> {
    return new Map(this.metrics);
  }

  // Log performance summary
  logSummary() {
    console.log('=== Performance Summary ===');
    this.metrics.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
    console.log('==========================');
  }
}

// Auto-initialize performance monitoring
export const performanceMonitor = PerformanceMonitor.getInstance();

// Start monitoring when the module is imported
if (typeof window !== 'undefined') {
  performanceMonitor.monitorCoreWebVitals();
  performanceMonitor.monitorFontLoading();
  
  // Log summary after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      performanceMonitor.logSummary();
    }, 2000);
  });
}


