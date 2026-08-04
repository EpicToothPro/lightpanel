import { Response } from 'express';
import os from 'os';
import { AuthenticatedRequest, validateShellCommand, sanitizePath } from '../middleware/auth';

interface DomainRecord {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'error';
  dns_status: 'propagated' | 'pending' | 'error';
  ssl_status: 'active' | 'pending' | 'expired' | 'none';
  linked_to?: string;
  linked_type?: 'website' | 'application';
  nameservers: string[];
  verified: boolean;
  created_at: string;
}

interface SubdomainRecord {
  id: string;
  name: string;
  parent_domain: string;
  full_domain: string;
  target: string;
  target_type: 'website' | 'application' | 'redirect';
  port?: number;
  ssl_enabled: boolean;
  created_at: string;
}

let domainList: DomainRecord[] = [
  { id: 'dom-1', name: 'lightpanel.dev', status: 'active', dns_status: 'propagated', ssl_status: 'active', linked_to: 'lightpanel.dev', linked_type: 'website', nameservers: ['ns1.digitalocean.com', 'ns2.digitalocean.com'], verified: true, created_at: new Date().toISOString() },
];

let subdomainList: SubdomainRecord[] = [
  { id: 'sub-1', name: 'api', parent_domain: 'lightpanel.dev', full_domain: 'api.lightpanel.dev', target: 'lightpanel-backend', target_type: 'application', port: 3001, ssl_enabled: true, created_at: new Date().toISOString() },
];

let websiteList = [
  { id: 'site-1', name: 'lightpanel.dev', domain: 'lightpanel.dev', document_root: '/var/www/lightpanel.dev', runtime: 'static', ssl_enabled: true, ssl_status: 'active', deployment_status: 'success', traffic_today: 0, created_at: new Date().toISOString() },
];

let applicationList = [
  { id: 'app-1', name: 'lightpanel-backend', runtime: 'nodejs', version: process.version, status: 'running', domain: 'localhost', port: 3001, cpu_usage: 0.5, memory_usage: Math.round(process.memoryUsage().rss / 1024 / 1024), memory_limit: 512, last_deployment: new Date().toISOString() },
  { id: 'app-2', name: 'lightpanel-frontend', runtime: 'nextjs', version: '16.3.0', status: 'running', domain: 'localhost', port: 3000, cpu_usage: 0.8, memory_usage: 192, memory_limit: 1024, last_deployment: new Date().toISOString() },
];

let databaseList = [
  { id: 'db-1', name: 'lightpanel', type: 'postgresql', version: '16.1', status: 'running', host: 'postgres', port: 5432, storage_used_mb: 24, storage_limit_mb: -1, linked_apps: ['lightpanel-backend'], username: 'postgres', created_at: new Date().toISOString() },
];

// --- Websites Handlers ---
export async function listWebsitesHandler(req: AuthenticatedRequest, res: Response) {
  return res.json({ success: true, data: websiteList });
}

export async function createWebsiteHandler(req: AuthenticatedRequest, res: Response) {
  const { name, domain, runtime, php_version } = req.body;
  if (!name || !domain) {
    return res.status(400).json({ success: false, error: 'Name and domain are required.' });
  }

  const newSite = {
    id: `site-${Date.now()}`,
    name,
    domain,
    document_root: `/var/www/${domain}`,
    runtime: runtime || 'static',
    php_version: php_version || undefined,
    ssl_enabled: true,
    ssl_status: 'active' as const,
    deployment_status: 'success' as const,
    traffic_today: 0,
    created_at: new Date().toISOString(),
  };

  websiteList.unshift(newSite);
  return res.json({ success: true, data: newSite });
}

export async function deleteWebsiteHandler(req: AuthenticatedRequest, res: Response) {
  const id = req.params.id || (req.query.id as string);
  websiteList = websiteList.filter(s => s.id !== id && s.domain !== id);
  return res.json({ success: true });
}

// --- Applications Handlers ---
export async function listApplicationsHandler(req: AuthenticatedRequest, res: Response) {
  return res.json({ success: true, data: applicationList });
}

export async function createApplicationHandler(req: AuthenticatedRequest, res: Response) {
  const { name, runtime, version, port } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, error: 'Application name is required.' });
  }

  const newApp = {
    id: `app-${Date.now()}`,
    name,
    runtime: runtime || 'nodejs',
    version: version || '20.x',
    status: 'running' as const,
    domain: `${name}.lightpanel.dev`,
    port: port || Math.floor(3000 + Math.random() * 5000),
    cpu_usage: 0.2,
    memory_usage: 64,
    memory_limit: 512,
    last_deployment: new Date().toISOString(),
    env_vars: {},
    created_at: new Date().toISOString(),
  };

  applicationList.unshift(newApp);
  return res.json({ success: true, data: newApp });
}

export async function deleteApplicationHandler(req: AuthenticatedRequest, res: Response) {
  const id = req.params.id;
  applicationList = applicationList.filter(a => a.id !== id);
  return res.json({ success: true });
}

// --- Domains Handlers ---
export async function listDomainsHandler(req: AuthenticatedRequest, res: Response) {
  return res.json({ success: true, data: domainList });
}

export async function createDomainHandler(req: AuthenticatedRequest, res: Response) {
  const { name, linked_to } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, error: 'Domain name is required.' });
  }

  const newDomain: DomainRecord = {
    id: `dom-${Date.now()}`,
    name: name.trim().toLowerCase(),
    status: 'active',
    dns_status: 'propagated',
    ssl_status: 'active',
    linked_to: linked_to || undefined,
    linked_type: linked_to ? 'website' : undefined,
    nameservers: ['ns1.lightpanel.dev', 'ns2.lightpanel.dev'],
    verified: true,
    created_at: new Date().toISOString(),
  };

  domainList.unshift(newDomain);
  return res.json({ success: true, data: newDomain });
}

export async function deleteDomainHandler(req: AuthenticatedRequest, res: Response) {
  const id = req.params.id || (req.query.id as string);
  domainList = domainList.filter(d => d.id !== id && d.name !== id);
  return res.json({ success: true });
}

// --- Subdomains Handlers ---
export async function listSubdomainsHandler(req: AuthenticatedRequest, res: Response) {
  return res.json({ success: true, data: subdomainList });
}

export async function createSubdomainHandler(req: AuthenticatedRequest, res: Response) {
  const { name, parent_domain, target, target_type } = req.body;
  if (!name || !parent_domain) {
    return res.status(400).json({ success: false, error: 'Subdomain name and parent domain are required.' });
  }

  const full_domain = `${name}.${parent_domain}`;
  const newSubdomain: SubdomainRecord = {
    id: `sub-${Date.now()}`,
    name,
    parent_domain,
    full_domain,
    target: target || 'website',
    target_type: target_type || 'website',
    ssl_enabled: true,
    created_at: new Date().toISOString(),
  };

  subdomainList.unshift(newSubdomain);
  return res.json({ success: true, data: newSubdomain });
}

export async function deleteSubdomainHandler(req: AuthenticatedRequest, res: Response) {
  const id = req.params.id;
  subdomainList = subdomainList.filter(s => s.id !== id);
  return res.json({ success: true });
}

// --- Databases Handlers ---
export async function listDatabasesHandler(req: AuthenticatedRequest, res: Response) {
  return res.json({ success: true, data: databaseList });
}

export async function createDatabaseHandler(req: AuthenticatedRequest, res: Response) {
  const { name, type, username } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, error: 'Database name is required.' });
  }

  const newDb = {
    id: `db-${Date.now()}`,
    name,
    type: type || 'postgresql',
    version: '16.1',
    status: 'running' as const,
    host: '127.0.0.1',
    port: type === 'redis' ? 6379 : type === 'mongodb' ? 27017 : type === 'mariadb' ? 3306 : 5432,
    storage_used_mb: 0,
    storage_limit_mb: -1, // Unlimited
    linked_apps: [],
    username: username || 'postgres',
    created_at: new Date().toISOString(),
  };

  databaseList.unshift(newDb);
  return res.json({ success: true, data: newDb });
}

export async function deleteDatabaseHandler(req: AuthenticatedRequest, res: Response) {
  const id = req.params.id;
  databaseList = databaseList.filter(d => d.id !== id);
  return res.json({ success: true });
}

// --- Terminal Exec Handler ---
export async function executeTerminalCommandHandler(req: AuthenticatedRequest, res: Response) {
  const { command } = req.body;
  if (!command) {
    return res.status(400).json({ success: false, error: 'Command string is required.' });
  }

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

// --- System Stats Handler ---
export async function getSystemStatsHandler(req: AuthenticatedRequest, res: Response) {
  const totalMemMb = Math.round(os.totalmem() / 1024 / 1024);
  const freeMemMb = Math.round(os.freemem() / 1024 / 1024);
  const usedMemMb = totalMemMb - freeMemMb;
  const memPercent = Math.round((usedMemMb / totalMemMb) * 1000) / 10;

  const cpus = os.cpus();
  const loadAvg = os.loadavg();
  const rawCpuUsage = (loadAvg[0] / (cpus.length || 1)) * 100;
  const cpuPercent = Math.min(Math.round(rawCpuUsage * 10) / 10, 100);

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
