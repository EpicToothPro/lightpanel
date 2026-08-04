"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginHandler = loginHandler;
exports.listUsersHandler = listUsersHandler;
exports.shareResourceHandler = shareResourceHandler;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
async function loginHandler(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, error: 'Username and password required' });
    }
    // Simulated authentication check
    const token = jsonwebtoken_1.default.sign({ id: 'usr-1', username: 'admin', email: 'admin@lightpanel.dev', role: 'owner' }, config_1.config.jwtSecret, { expiresIn: '7d' });
    return res.json({
        success: true,
        data: {
            token,
            user: {
                id: 'usr-1',
                username: 'admin',
                email: 'admin@lightpanel.dev',
                role: 'owner',
            },
        },
    });
}
async function listUsersHandler(req, res) {
    return res.json({
        success: true,
        data: [
            { id: 'usr-1', username: 'admin', email: 'admin@lightpanel.dev', role: 'owner', status: 'active', quota_mb: -1 },
            { id: 'usr-2', username: 'deployer', email: 'ci-cd@lightpanel.dev', role: 'standard', status: 'active', quota_mb: 10240 },
        ],
    });
}
async function shareResourceHandler(req, res) {
    const { resourceType, resourceId, shareWithEmail, permissionLevel } = req.body;
    if (!resourceType || !resourceId || !shareWithEmail) {
        return res.status(400).json({ success: false, error: 'Missing required parameters' });
    }
    return res.json({
        success: true,
        data: {
            id: `share-${Date.now()}`,
            resourceType,
            resourceId,
            sharedWith: shareWithEmail,
            permissionLevel: permissionLevel || 'edit',
            createdAt: new Date().toISOString(),
        },
    });
}
