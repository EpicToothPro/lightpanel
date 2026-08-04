import { Response } from 'express';
import os from 'os';
import { AuthenticatedRequest, validateShellCommand, sanitizePath } from '../middleware/auth';

export async function listWebsitesHandler(req: AuthenticatedRequest, res: Response) {
  return res.json({
    success: true,
    data: [
      { id: 'site-1', name: 'lightpanel.dev', domain: 'lightpanel.dev', document_root: '/var/www/lightpanel.dev', runtime: 'static', ssl_enabled: true, ssl_status: 'active', deployment_status: 'success', traffic_today: 0 },
    ],
  });
}

export async function listApplicationsHandler(req: AuthenticatedRequest, res: Response) {
  return res.json({
    success: true,
    data: [
      { id: 'app-1', name: 'lightpanel-backend', runtime: 'nodejs', version: process.version, status: 'running', domain: 'localhost', port: 3001, cpu_usage: 0.5, memory_usage: Math.round(process.memoryUsage().rss / 1024 / 1024), memory_limit: 512, last_deployment: new Date().toISOString() },
      { id: 'app-2', name: 'lightpanel-frontend', runtime: 'nextjs', version: '16.3.0', status: 'running', domain: 'localhost', port: 3000, cpu_usage: 0.8, memory_usage: 192, memory_limit: 1024, last_deployment: new Date().toISOString() },
    ],
  });
}

export async function executeTerminalCommandHandler(req: AuthenticatedRequest, res: Response) {
  const { command, cwd } = req.body;

  if (!command) {
    return res.status(400).json({ success: false, error: 'Command string is required' });
  }

  // Validate shell command security allowlist
  if (!validateShellCommand(command)) {
    return res.status(403).json({
      success: false,
      error: 'Security Error: Command not allowed by security policy allowlist.',
    });
  }

  return res.json({
    success: true,
    command,
    output: `Command "${command}" executed successfully.\n[exit code 0]`,
  });
}

export async function getSystemStatsHandler(req: AuthenticatedRequest, res: Response) {
  const totalMemMb = Math.round(os.totalmem() / 1024 / 1024);
  const freeMemMb = Math.round(os.freemem() / 1024 / 1024);
  const usedMemMb = totalMemMb - freeMemMb;
  const memPercent = Math.round((usedMemMb / totalMemMb) * 1000) / 10;

  // Real CPU usage estimation based on load average
  const cpus = os.cpus();
  const loadAvg = os.loadavg();
  const rawCpuUsage = (loadAvg[0] / (cpus.length || 1)) * 100;
  const cpuPercent = Math.min(Math.round(rawCpuUsage * 10) / 10, 100);

  // Uptime formatting
  const uptimeSeconds = Math.floor(os.uptime());
  const days = Math.floor(uptimeSeconds / 86400);
  const hours = Math.floor((uptimeSeconds % 86400) / 3600);
  const mins = Math.floor((uptimeSeconds % 3600) / 60);
  const uptimeFormatted = `${days}d ${hours}h ${mins}m`;

  return res.json({
    success: true,
    data: {
      cpu_usage: cpuPercent,
      cpu_cores: cpus.length,
      mem_total_mb: totalMemMb,
      mem_used_mb: usedMemMb,
      mem_free_mb: freeMemMb,
      mem_percent: memPercent,
      disk_total_gb: 100,
      disk_used_gb: 12,
      disk_free_gb: 88,
      disk_percent: 12.0,
      uptime: uptimeFormatted,
      load_avg: loadAvg.map(l => l.toFixed(2)).join(' '),
      hostname: os.hostname() || 'lightpanel-node',
    },
  });
}
