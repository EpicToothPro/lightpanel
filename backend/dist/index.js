"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const ws_1 = require("ws");
const config_1 = require("./config");
const auth_1 = require("./middleware/auth");
const auth_2 = require("./controllers/auth");
const setup_1 = require("./controllers/setup");
const analytics_1 = require("./controllers/analytics");
const resources_1 = require("./controllers/resources");
const email_1 = require("./controllers/email");
const workers_1 = require("./workers");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const wss = new ws_1.WebSocketServer({ server, path: '/ws/logs' });
app.use((0, cors_1.default)({ origin: config_1.config.corsOrigin }));
app.use(express_1.default.json());
// OpenAPI Specification JSON Route
app.get('/api/v1/openapi.json', (req, res) => {
    res.json({
        openapi: '3.0.0',
        info: {
            title: 'LightPanel Private Infrastructure Management API',
            version: '1.0.0',
            description: 'REST API for managing private server infrastructure, apps, websites, domains, databases, SSL, mail, and analytics.',
        },
        paths: {
            '/api/v1/auth/login': { post: { summary: 'Authenticate user and issue JWT' } },
            '/api/v1/setup/status': { get: { summary: 'Get 10-step onboarding wizard status' } },
            '/api/v1/resources/stats': { get: { summary: 'Get real-time CPU, RAM, Disk, Uptime system metrics' } },
            '/api/v1/resources/domains': { get: { summary: 'List and add custom domains' } },
            '/api/v1/resources/websites': { get: { summary: 'List hosted websites' } },
            '/api/v1/resources/applications': { get: { summary: 'List deployed application services' } },
        },
    });
});
// Setup & Installer Routes
app.get('/api/v1/setup/status', setup_1.getSetupStatusHandler);
app.post('/api/v1/setup/step', setup_1.saveSetupStepHandler);
app.post('/api/v1/setup/finish', setup_1.finishSetupHandler);
// Auth & Sharing Routes
app.post('/api/v1/auth/login', auth_2.loginHandler);
app.get('/api/v1/users', auth_1.authenticateJWT, (0, auth_1.requireRole)(['owner', 'admin']), auth_2.listUsersHandler);
app.post('/api/v1/shares', auth_1.authenticateJWT, auth_2.shareResourceHandler);
// Public / Authenticated Stats Route
app.get('/api/v1/stats', resources_1.getSystemStatsHandler);
app.get('/api/v1/resources/stats', resources_1.getSystemStatsHandler);
// Resource Routes (Websites, Apps, Domains, Subdomains, Databases)
app.get('/api/v1/resources/websites', resources_1.listWebsitesHandler);
app.post('/api/v1/resources/websites', resources_1.createWebsiteHandler);
app.delete('/api/v1/resources/websites/:id', resources_1.deleteWebsiteHandler);
app.get('/api/v1/resources/apps', resources_1.listApplicationsHandler);
app.post('/api/v1/resources/apps', resources_1.createApplicationHandler);
app.delete('/api/v1/resources/apps/:id', resources_1.deleteApplicationHandler);
app.get('/api/v1/resources/domains', resources_1.listDomainsHandler);
app.post('/api/v1/resources/domains', resources_1.createDomainHandler);
app.delete('/api/v1/resources/domains/:id', resources_1.deleteDomainHandler);
app.get('/api/v1/resources/subdomains', resources_1.listSubdomainsHandler);
app.post('/api/v1/resources/subdomains', resources_1.createSubdomainHandler);
app.delete('/api/v1/resources/subdomains/:id', resources_1.deleteSubdomainHandler);
app.get('/api/v1/resources/databases', resources_1.listDatabasesHandler);
app.post('/api/v1/resources/databases', resources_1.createDatabaseHandler);
app.delete('/api/v1/resources/databases/:id', resources_1.deleteDatabaseHandler);
app.post('/api/v1/terminal', resources_1.executeTerminalCommandHandler);
// Email & Mailbox Routes
app.get('/api/v1/email/mailboxes', email_1.listMailboxesHandler);
app.post('/api/v1/email/mailboxes', email_1.createMailboxHandler);
app.get('/api/v1/email/queue', email_1.listMailQueueHandler);
app.post('/api/v1/email/queue/flush', email_1.flushMailQueueHandler);
// Analytics Routes
app.get('/api/v1/analytics', analytics_1.getAnalyticsSummaryHandler);
app.post('/api/v1/analytics/toggle', analytics_1.toggleAnalyticsHandler);
app.post('/api/v1/analytics/track', analytics_1.trackAnalyticsEvent);
// Background Worker Async Dispatch Route
app.post('/api/v1/tasks/dispatch', (req, res) => {
    const { type, payload } = req.body;
    const job = (0, workers_1.addJob)(type, payload);
    res.json({ success: true, data: job });
});
app.get('/api/v1/tasks/:id', (req, res) => {
    const job = (0, workers_1.getJobStatus)(req.params.id);
    if (!job)
        return res.status(404).json({ success: false, error: 'Job not found' });
    res.json({ success: true, data: job });
});
// WebSocket Live Logs Connection Handler
wss.on('connection', (ws) => {
    console.log('[WebSocket] Client connected for live log streaming');
    ws.send(JSON.stringify({ type: 'connected', message: 'Connected to LightPanel live log stream' }));
    const interval = setInterval(() => {
        if (ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify({
                type: 'log',
                timestamp: new Date().toISOString(),
                level: 'info',
                source: 'system',
                message: 'System heartbeat operational',
            }));
        }
    }, 5000);
    ws.on('close', () => clearInterval(interval));
});
// Start Server
server.listen(config_1.config.port, () => {
    console.log(`🚀 LightPanel Backend Server running on http://localhost:${config_1.config.port}`);
    console.log(`📄 OpenAPI Spec available at http://localhost:${config_1.config.port}/api/v1/openapi.json`);
});
