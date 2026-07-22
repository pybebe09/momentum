export interface PerformanceTelemetry {
  pageLoadMs: number;
  domContentMs: number;
  dnsMs: number;
  connectMs: number;
  memoryUsageMb?: number;
}

export const measurePerformance = (): PerformanceTelemetry | null => {
  if (typeof window === 'undefined' || !window.performance) {
    return null;
  }

  const timing = window.performance.timing;
  const pageLoadMs = timing.loadEventEnd - timing.navigationStart;
  const domContentMs = timing.domContentLoadedEventEnd - timing.navigationStart;
  const dnsMs = timing.domainLookupEnd - timing.domainLookupStart;
  const connectMs = timing.connectEnd - timing.connectStart;

  let memoryUsageMb: number | undefined = undefined;
  if ((window.performance as any).memory) {
    memoryUsageMb = Math.round(
      (window.performance as any).memory.usedJSHeapSize / (1024 * 1024)
    );
  }

  const telemetry: PerformanceTelemetry = {
    pageLoadMs: Math.max(0, pageLoadMs),
    domContentMs: Math.max(0, domContentMs),
    dnsMs: Math.max(0, dnsMs),
    connectMs: Math.max(0, connectMs),
    memoryUsageMb,
  };

  if (import.meta.env.DEV) {
    console.log('[MOMENTUM PERFORMANCE TELEMETRY]', telemetry);
  }

  return telemetry;
};
