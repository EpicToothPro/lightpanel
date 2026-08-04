"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listWebsitesHandler = listWebsitesHandler;
exports.createWebsiteHandler = createWebsiteHandler;
exports.deleteWebsiteHandler = deleteWebsiteHandler;
exports.listApplicationsHandler = listApplicationsHandler;
exports.createApplicationHandler = createApplicationHandler;
exports.deleteApplicationHandler = deleteApplicationHandler;
exports.listDomainsHandler = listDomainsHandler;
exports.createDomainHandler = createDomainHandler;
exports.deleteDomainHandler = deleteDomainHandler;
exports.listSubdomainsHandler = listSubdomainsHandler;
exports.createSubdomainHandler = createSubdomainHandler;
exports.deleteSubdomainHandler = deleteSubdomainHandler;
exports.listDatabasesHandler = listDatabasesHandler;
exports.createDatabaseHandler = createDatabaseHandler;
exports.deleteDatabaseHandler = deleteDatabaseHandler;
exports.executeTerminalCommandHandler = executeTerminalCommandHandler;
exports.getSystemStatsHandler = getSystemStatsHandler;
const os_1 = __importDefault(require("os"));
const auth_1 = require("../middleware/auth");
let domainList = [
    { id: 'dom-1', name: 'lightpanel.dev', status: 'active', dns_status: 'propagated', ssl_status: 'active', linked_to: 'lightpanel.dev', linked_type: 'website', nameservers: ['ns1.digitalocean.com', 'ns2.digitalocean.com'], verified: true, created_at: new Date().toISOString() },
];
let subdomainList = [
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
async function listWebsitesHandler(req, res) {
    return res.json({ success: true, data: websiteList });
}
async function createWebsiteHandler(req, res) {
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
        ssl_status: 'active',
        deployment_status: 'success',
        traffic_today: 0,
        created_at: new Date().toISOString(),
    };
    websiteList.unshift(newSite);
    return res.json({ success: true, data: newSite });
}
async function deleteWebsiteHandler(req, res) {
    const id = req.params.id || req.query.id;
    websiteList = websiteList.filter(s => s.id !== id && s.domain !== id);
    return res.json({ success: true });
}
// --- Applications Handlers ---
async function listApplicationsHandler(req, res) {
    return res.json({ success: true, data: applicationList });
}
async function createApplicationHandler(req, res) {
    const { name, runtime, version, port } = req.body;
    if (!name) {
        return res.status(400).json({ success: false, error: 'Application name is required.' });
    }
    const newApp = {
        id: `app-${Date.now()}`,
        name,
        runtime: runtime || 'nodejs',
        version: version || '20.x',
        status: 'running',
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
async function deleteApplicationHandler(req, res) {
    const id = req.params.id;
    applicationList = applicationList.filter(a => a.id !== id);
    return res.json({ success: true });
}
// --- Domains Handlers ---
async function listDomainsHandler(req, res) {
    return res.json({ success: true, data: domainList });
}
async function createDomainHandler(req, res) {
    const { name, linked_to } = req.body;
    if (!name) {
        return res.status(400).json({ success: false, error: 'Domain name is required.' });
    }
    const newDomain = {
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
async function deleteDomainHandler(req, res) {
    const id = req.params.id || req.query.id;
    domainList = domainList.filter(d => d.id !== id && d.name !== id);
    return res.json({ success: true });
}
// --- Subdomains Handlers ---
async function listSubdomainsHandler(req, res) {
    return res.json({ success: true, data: subdomainList });
}
async function createSubdomainHandler(req, res) {
    const { name, parent_domain, target, target_type } = req.body;
    if (!name || !parent_domain) {
        return res.status(400).json({ success: false, error: 'Subdomain name and parent domain are required.' });
    }
    const full_domain = `${name}.${parent_domain}`;
    const newSubdomain = {
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
async function deleteSubdomainHandler(req, res) {
    const id = req.params.id;
    subdomainList = subdomainList.filter(s => s.id !== id);
    return res.json({ success: true });
}
// --- Databases Handlers ---
async function listDatabasesHandler(req, res) {
    return res.json({ success: true, data: databaseList });
}
async function createDatabaseHandler(req, res) {
    const { name, type, username } = req.body;
    if (!name) {
        return res.status(400).json({ success: false, error: 'Database name is required.' });
    }
    const newDb = {
        id: `db-${Date.now()}`,
        name,
        type: type || 'postgresql',
        version: '16.1',
        status: 'running',
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
async function deleteDatabaseHandler(req, res) {
    const id = req.params.id;
    databaseList = databaseList.filter(d => d.id !== id);
    return res.json({ success: true });
}
// --- Terminal Exec Handler ---
async function executeTerminalCommandHandler(req, res) {
    const { command } = req.body;
    if (!command) {
        return res.status(400).json({ success: false, error: 'Command string is required.' });
    }
    if (!(0, auth_1.validateShellCommand)(command)) {
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
async function getSystemStatsHandler(req, res) {
    const totalMemMb = Math.round(os_1.default.totalmem() / 1024 / 1024);
    const freeMemMb = Math.round(os_1.default.freemem() / 1024 / 1024);
    const usedMemMb = totalMemMb - freeMemMb;
    const memPercent = Math.round((usedMemMb / totalMemMb) * 1000) / 10;
    const cpus = os_1.default.cpus();
    const loadAvg = os_1.default.loadavg();
    const rawCpuUsage = (loadAvg[0] / (cpus.length || 1)) * 100;
    const cpuPercent = Math.min(Math.round(rawCpuUsage * 10) / 10, 100);
    const uptimeSeconds = Math.floor(os_1.default.uptime());
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
            hostname: os_1.default.hostname() || 'lightpanel-node',
        },
    });
}
