"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listWebsitesHandler = listWebsitesHandler;
exports.listApplicationsHandler = listApplicationsHandler;
exports.executeTerminalCommandHandler = executeTerminalCommandHandler;
exports.getSystemStatsHandler = getSystemStatsHandler;
const auth_1 = require("../middleware/auth");
async function listWebsitesHandler(req, res) {
    return res.json({
        success: true,
        data: [
            { id: 'site-1', name: 'lightpanel.dev', domain: 'lightpanel.dev', document_root: '/var/www/lightpanel.dev', runtime: 'static', ssl_enabled: true, ssl_status: 'active', deployment_status: 'success', traffic_today: 2847 },
            { id: 'site-2', name: 'portfolio.example.com', domain: 'portfolio.example.com', document_root: '/var/www/portfolio.example.com', runtime: 'php', php_version: '8.3', ssl_enabled: true, ssl_status: 'active', deployment_status: 'success', traffic_today: 456 },
        ],
    });
}
async function listApplicationsHandler(req, res) {
    return res.json({
        success: true,
        data: [
            { id: 'app-1', name: 'api-gateway', runtime: 'nodejs', version: '20.11.0', status: 'running', domain: 'api.lightpanel.dev', port: 3001, cpu_usage: 12.3, memory_usage: 256, memory_limit: 512, last_deployment: new Date().toISOString() },
            { id: 'app-2', name: 'web-dashboard', runtime: 'nextjs', version: '14.2.0', status: 'running', domain: 'app.lightpanel.dev', port: 3000, cpu_usage: 8.1, memory_usage: 384, memory_limit: 1024, last_deployment: new Date().toISOString() },
        ],
    });
}
async function executeTerminalCommandHandler(req, res) {
    const { command, cwd } = req.body;
    if (!command) {
        return res.status(400).json({ success: false, error: 'Command string is required' });
    }
    // Validate shell command security allowlist
    if (!(0, auth_1.validateShellCommand)(command)) {
        return res.status(403).json({
            success: false,
            error: 'Security Error: Command not allowed by security policy allowlist.',
        });
    }
    // Safe simulated execution
    return res.json({
        success: true,
        command,
        output: `Command "${command}" executed successfully.\n[exit code 0]`,
    });
}
async function getSystemStatsHandler(req, res) {
    return res.json({
        success: true,
        data: {
            cpu_usage: 23.4,
            mem_total_mb: 8192,
            mem_used_mb: 3276,
            mem_free_mb: 4916,
            mem_percent: 40.0,
            disk_total_gb: 256,
            disk_used_gb: 89,
            disk_free_gb: 167,
            disk_percent: 34.8,
            uptime: '42d 7h 23m',
            load_avg: '0.45 0.62 0.71',
            hostname: 'vps-prod-01',
        },
    });
}
