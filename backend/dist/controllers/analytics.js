"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalyticsSummaryHandler = getAnalyticsSummaryHandler;
exports.toggleAnalyticsHandler = toggleAnalyticsHandler;
exports.trackAnalyticsEvent = trackAnalyticsEvent;
let analyticsGlobalEnabled = true;
const mockAnalyticsProperties = {
    'lightpanel.dev': { enabled: true, privacyMode: 'anonymized', pageviews: 12450, visitors: 3200 },
    'example.com': { enabled: true, privacyMode: 'anonymized', pageviews: 4520, visitors: 1100 },
};
async function getAnalyticsSummaryHandler(req, res) {
    const domain = req.query.domain || 'lightpanel.dev';
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
async function toggleAnalyticsHandler(req, res) {
    const { enabled, domain } = req.body;
    if (domain) {
        if (mockAnalyticsProperties[domain]) {
            mockAnalyticsProperties[domain].enabled = enabled;
        }
    }
    else {
        analyticsGlobalEnabled = enabled;
    }
    return res.json({
        success: true,
        message: `Analytics updated (global: ${analyticsGlobalEnabled})`,
        data: { globalEnabled: analyticsGlobalEnabled, properties: mockAnalyticsProperties },
    });
}
async function trackAnalyticsEvent(req, res) {
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
