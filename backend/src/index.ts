import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer } from 'ws';
import { config } from './config';
import { authenticateJWT, requireRole } from './middleware/auth';
import { loginHandler, listUsersHandler, shareResourceHandler } from './controllers/auth';
import { getSetupStatusHandler, saveSetupStepHandler, finishSetupHandler } from './controllers/setup';
import { getAnalyticsSummaryHandler, toggleAnalyticsHandler, trackAnalyticsEvent } from './controllers/analytics';
import { listWebsitesHandler, listApplicationsHandler, executeTerminalCommandHandler, getSystemStatsHandler } from './controllers/resources';
import { listMailboxesHandler, createMailboxHandler, listMailQueueHandler, flushMailQueueHandler } from './controllers/email';
import { addJob, getJobStatus } from './workers';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws/logs' });

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

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
app.get('/api/v1/setup/status', getSetupStatusHandler);
app.post('/api/v1/setup/step', saveSetupStepHandler);
app.post('/api/v1/setup/finish', finishSetupHandler);

// Auth & Sharing Routes
app.post('/api/v1/auth/login', loginHandler);
app.get('/api/v1/users', authenticateJWT, requireRole(['owner', 'admin']), listUsersHandler);
app.post('/api/v1/shares', authenticateJWT, shareResourceHandler);

// Core Resource Routes
app.get('/api/v1/stats', getSystemStatsHandler);
app.get('/api/v1/websites', authenticateJWT, listWebsitesHandler);
app.get('/api/v1/applications', authenticateJWT, listApplicationsHandler);
app.post('/api/v1/terminal', authenticateJWT, requireRole(['owner', 'admin']), executeTerminalCommandHandler);

// Email & Mailbox Routes
app.get('/api/v1/email/mailboxes', authenticateJWT, listMailboxesHandler);
app.post('/api/v1/email/mailboxes', authenticateJWT, createMailboxHandler);
app.get('/api/v1/email/queue', authenticateJWT, listMailQueueHandler);
app.post('/api/v1/email/queue/flush', authenticateJWT, flushMailQueueHandler);

// Analytics Routes
app.get('/api/v1/analytics', authenticateJWT, getAnalyticsSummaryHandler);
app.post('/api/v1/analytics/toggle', authenticateJWT, toggleAnalyticsHandler);
app.post('/api/v1/analytics/track', trackAnalyticsEvent);

// Background Worker Async Dispatch Route
app.post('/api/v1/tasks/dispatch', authenticateJWT, (req, res) => {
  const { type, payload } = req.body;
  const job = addJob(type, payload);
  res.json({ success: true, data: job });
});

app.get('/api/v1/tasks/:id', authenticateJWT, (req, res) => {
  const job = getJobStatus(req.params.id);
  if (!job) return res.status(404).json({ success: false, error: 'Job not found' });
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
server.listen(config.port, () => {
  console.log(`🚀 LightPanel Backend Server running on http://localhost:${config.port}`);
  console.log(`📄 OpenAPI Spec available at http://localhost:${config.port}/api/v1/openapi.json`);
});
