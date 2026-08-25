/**
 * Vercel Speed Insights integration for IGNYXX
 * This module initializes Vercel Speed Insights to track Web Vitals and performance metrics
 */
import { injectSpeedInsights } from 'https://cdn.jsdelivr.net/npm/@vercel/speed-insights@2/+esm';

// Initialize Speed Insights with default configuration
injectSpeedInsights({
  // Enable debug mode in development
  debug: false,
  // Track all events by default (adjust sampleRate if needed to control costs)
  sampleRate: 1
});
