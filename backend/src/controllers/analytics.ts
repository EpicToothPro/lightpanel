import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';

let analyticsGlobalEnabled = true;

const mockAnalyticsProperties: Record<string, { enabled: boolean; privacyMode: string; pageviews: number; visitors: number }> = {
  'lightpanel.dev': { enabled: true, privacyMode: 'anonymized', pageviews: 12450, visitors: 3200 },
  'example.com': { enabled: true, privacyMode: 'anonymized', pageviews: 4520, visitors: 1100 },
};

export async function getAnalyticsSummaryHandler(req: AuthenticatedRequest, res: Response) {
  const domain = (req.query.domain as string) || 'lightpanel.dev';

  return res.json({
    success: true,
    data: {
      globalEnabled: analyticsGlobalEnabled,
      domain,
      period: '30d',
      metrics: {
        pageviews: 12450,
        uniqueVisitors: 3200,
        avgDurationSeconds: 142,
        bounceRatePct: 32.4,
      },
      topPages: [
        { path: '/', views: 5400 },
        { path: '/docs', views: 2300 },
        { path: '/pricing', views: 1200 },
      ],
      topReferrers: [
        { name: 'google.com', count: 4200 },
        { name: 'github.com', count: 2800 },
        { name: 'direct', count: 1900 },
      ],
      deviceBreakdown: [
        { device: 'Desktop', percentage: 68 },
        { device: 'Mobile', percentage: 27 },
        { device: 'Tablet', percentage: 5 },
      ],
      countryBreakdown: [
        { country: 'United States', count: 4500 },
        { country: 'Germany', count: 1800 },
        { country: 'United Kingdom', count: 1200 },
      ],
    },
  });
}

export async function toggleAnalyticsHandler(req: AuthenticatedRequest, res: Response) {
  const { enabled, domain } = req.body;

  if (domain) {
    if (mockAnalyticsProperties[domain]) {
      mockAnalyticsProperties[domain].enabled = enabled;
    }
  } else {
    analyticsGlobalEnabled = enabled;
  }

  return res.json({
    success: true,
    message: `Analytics updated (global: ${analyticsGlobalEnabled})`,
    data: { globalEnabled: analyticsGlobalEnabled, properties: mockAnalyticsProperties },
  });
}

export async function trackAnalyticsEvent(req: AuthenticatedRequest, res: Response) {
  if (!analyticsGlobalEnabled) {
    return res.json({ success: true, tracking: 'disabled' });
  }

  const { domain, path, referrer } = req.body;

  return res.json({
    success: true,
    recorded: true,
    domain,
    path,
  });
}
