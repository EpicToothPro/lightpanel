"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listMailboxesHandler = listMailboxesHandler;
exports.createMailboxHandler = createMailboxHandler;
exports.listMailQueueHandler = listMailQueueHandler;
exports.flushMailQueueHandler = flushMailQueueHandler;
async function listMailboxesHandler(req, res) {
    return res.json({
        success: true,
        data: [
            { id: 'mbox-1', email: 'admin@lightpanel.dev', domain: 'lightpanel.dev', quota_mb: -1, used_mb: 840, status: 'active', imap_enabled: true, smtp_enabled: true, pop3_enabled: true },
            { id: 'mbox-2', email: 'support@lightpanel.dev', domain: 'lightpanel.dev', quota_mb: 10240, used_mb: 3420, status: 'active', imap_enabled: true, smtp_enabled: true, pop3_enabled: false },
        ],
    });
}
async function createMailboxHandler(req, res) {
    const { username, domain, password, quotaMb } = req.body;
    if (!username || !domain || !password) {
        return res.status(400).json({ success: false, error: 'Username, domain, and password required' });
    }
    const email = `${username}@${domain}`;
    return res.json({
        success: true,
        data: {
            id: `mbox-${Date.now()}`,
            email,
            domain,
            quota_mb: quotaMb || -1, // Default unlimited
            used_mb: 0,
            status: 'active',
            imap_enabled: true,
            smtp_enabled: true,
            pop3_enabled: true,
            created_at: new Date().toISOString(),
        },
    });
}
async function listMailQueueHandler(req, res) {
    return res.json({
        success: true,
        data: [
            { id: 'q-1', queue_id: '4Wz9K10x8zZ1001', sender: 'admin@lightpanel.dev', recipient: 'digest-subscribers@example.com', size_bytes: 48200, arrived_at: new Date().toISOString(), status: 'active' },
        ],
    });
}
async function flushMailQueueHandler(req, res) {
    return res.json({
        success: true,
        message: 'Postfix mail queue flushed successfully.',
    });
}
