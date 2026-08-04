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
            '/api/v1/stats': { get: { summary: 'Get real-time CPU, RAM, Disk, Uptime system metrics' } },
            '/api/v1/websites': { get: { summary: 'List hosted websites' } },
            '/api/v1/applications': { get: { summary: 'List deployed application services' } },
            '/api/v1/email/mailboxes': { get: { summary: 'List email mailboxes & quotas' } },
            '/api/v1/analytics': { get: { summary: 'Get privacy-conscious traffic analytics' } },
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
// Core Resource Routes
app.get('/api/v1/stats', resources_1.getSystemStatsHandler);
app.get('/api/v1/websites', auth_1.authenticateJWT, resources_1.listWebsitesHandler);
app.get('/api/v1/applications', auth_1.authenticateJWT, resources_1.listApplicationsHandler);
app.post('/api/v1/terminal', auth_1.authenticateJWT, (0, auth_1.requireRole)(['owner', 'admin']), resources_1.executeTerminalCommandHandler);
// Email & Mailbox Routes
app.get('/api/v1/email/mailboxes', auth_1.authenticateJWT, email_1.listMailboxesHandler);
app.post('/api/v1/email/mailboxes', auth_1.authenticateJWT, email_1.createMailboxHandler);
app.get('/api/v1/email/queue', auth_1.authenticateJWT, email_1.listMailQueueHandler);
app.post('/api/v1/email/queue/flush', auth_1.authenticateJWT, email_1.flushMailQueueHandler);
// Analytics Routes
app.get('/api/v1/analytics', auth_1.authenticateJWT, analytics_1.getAnalyticsSummaryHandler);
app.post('/api/v1/analytics/toggle', auth_1.authenticateJWT, analytics_1.toggleAnalyticsHandler);
app.post('/api/v1/analytics/track', analytics_1.trackAnalyticsEvent);
// Background Worker Async Dispatch Route
app.post('/api/v1/tasks/dispatch', auth_1.authenticateJWT, (req, res) => {
    const { type, payload } = req.body;
    const job = (0, workers_1.addJob)(type, payload);
    res.json({ success: true, data: job });
});
app.get('/api/v1/tasks/:id', auth_1.authenticateJWT, (req, res) => {
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
                message: `Heartbeat stats CPU: ${(20 + Math.random() * 5).toFixed(1)}% | RAM: 3276 MB`,
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
