import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer } from 'ws';
import { config } from './config';
import { authenticateJWT, requireRole } from './middleware/auth';
import { loginHandler, listUsersHandler, shareResourceHandler } from './controllers/auth';
import { getSetupStatusHandler, saveSetupStepHandler, finishSetupHandler } from './controllers/setup';
import { getAnalyticsSummaryHandler, toggleAnalyticsHandler, trackAnalyticsEvent } from './controllers/analytics';
import {
  listWebsitesHandler,
  createWebsiteHandler,
  deleteWebsiteHandler,
  listApplicationsHandler,
  createApplicationHandler,
  deleteApplicationHandler,
  listDomainsHandler,
  createDomainHandler,
  deleteDomainHandler,
  listSubdomainsHandler,
  createSubdomainHandler,
  deleteSubdomainHandler,
  listDatabasesHandler,
  createDatabaseHandler,
  deleteDatabaseHandler,
  executeTerminalCommandHandler,
  getSystemStatsHandler,
} from './controllers/resources';
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
      '/api/v1/resources/stats': { get: { summary: 'Get real-time CPU, RAM, Disk, Uptime system metrics' } },
      '/api/v1/resources/domains': { get: { summary: 'List and add custom domains' } },
      '/api/v1/resources/websites': { get: { summary: 'List hosted websites' } },
      '/api/v1/resources/applications': { get: { summary: 'List deployed application services' } },
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

// Public / Authenticated Stats Route
app.get('/api/v1/stats', getSystemStatsHandler);
app.get('/api/v1/resources/stats', getSystemStatsHandler);

// Resource Routes (Websites, Apps, Domains, Subdomains, Databases)
app.get('/api/v1/resources/websites', listWebsitesHandler);
app.post('/api/v1/resources/websites', createWebsiteHandler);
app.delete('/api/v1/resources/websites/:id', deleteWebsiteHandler);

app.get('/api/v1/resources/apps', listApplicationsHandler);
app.post('/api/v1/resources/apps', createApplicationHandler);
app.delete('/api/v1/resources/apps/:id', deleteApplicationHandler);

app.get('/api/v1/resources/domains', listDomainsHandler);
app.post('/api/v1/resources/domains', createDomainHandler);
app.delete('/api/v1/resources/domains/:id', deleteDomainHandler);

app.get('/api/v1/resources/subdomains', listSubdomainsHandler);
app.post('/api/v1/resources/subdomains', createSubdomainHandler);
app.delete('/api/v1/resources/subdomains/:id', deleteSubdomainHandler);

app.get('/api/v1/resources/databases', listDatabasesHandler);
app.post('/api/v1/resources/databases', createDatabaseHandler);
app.delete('/api/v1/resources/databases/:id', deleteDatabaseHandler);

app.post('/api/v1/terminal', executeTerminalCommandHandler);

// Email & Mailbox Routes
app.get('/api/v1/email/mailboxes', listMailboxesHandler);
app.post('/api/v1/email/mailboxes', createMailboxHandler);
app.get('/api/v1/email/queue', listMailQueueHandler);
app.post('/api/v1/email/queue/flush', flushMailQueueHandler);

// Analytics Routes
app.get('/api/v1/analytics', getAnalyticsSummaryHandler);
app.post('/api/v1/analytics/toggle', toggleAnalyticsHandler);
app.post('/api/v1/analytics/track', trackAnalyticsEvent);

// Background Worker Async Dispatch Route
app.post('/api/v1/tasks/dispatch', (req, res) => {
  const { type, payload } = req.body;
  const job = addJob(type, payload);
  res.json({ success: true, data: job });
});

app.get('/api/v1/tasks/:id', (req, res) => {
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
        message: 'System heartbeat operational',
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
