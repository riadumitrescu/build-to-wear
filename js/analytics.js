// Initialize Vercel Analytics
import { Analytics } from '@vercel/analytics/react';

// Create and inject the analytics script
const script = document.createElement('script');
script.src = 'https://va.vercel-scripts.com/v1/script.js';
script.async = true;
document.head.appendChild(script);

// Initialize analytics
const analytics = new Analytics();
analytics.trackPageView(); 