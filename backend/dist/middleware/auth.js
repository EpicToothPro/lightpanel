"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = authenticateJWT;
exports.requireRole = requireRole;
exports.sanitizePath = sanitizePath;
exports.validateShellCommand = validateShellCommand;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const path_1 = __importDefault(require("path"));
function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // For demo/dev fallback when unauthenticated
        req.user = {
            id: 'usr-1',
            username: 'admin',
            email: 'admin@lightpanel.dev',
            role: 'owner',
        };
        return next();
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }
}
function requireRole(allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }
        if (req.user.role === 'owner' || allowedRoles.includes(req.user.role)) {
            return next();
        }
        return res.status(403).json({ success: false, error: 'Permission denied: insufficient role privileges' });
    };
}
// Path Traversal Security Protection
function sanitizePath(baseDir, userPath) {
    const normalized = path_1.default.normalize(path_1.default.join(baseDir, userPath));
    if (!normalized.startsWith(path_1.default.normalize(baseDir))) {
        throw new Error('Path traversal attempt detected');
    }
    return normalized;
}
// Shell Command Security Allowlist Validation
const ALLOWED_COMMAND_PREFIXES = [
    'npm', 'node', 'next', 'pip', 'python', 'python3', 'git',
    'docker', 'certbot', 'logrotate', 'systemctl', 'service',
    'ls', 'cat', 'tail', 'head', 'grep', 'df', 'free', 'uptime',
];
function validateShellCommand(command) {
    const trimmed = command.trim();
    const firstWord = trimmed.split(' ')[0];
    return ALLOWED_COMMAND_PREFIXES.includes(firstWord);
}
