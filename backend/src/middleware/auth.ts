import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import path from 'path';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
    role: 'owner' | 'admin' | 'standard' | 'readonly';
  };
}

export function authenticateJWT(req: AuthenticatedRequest, res: Response, next: NextFunction) {
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
    const decoded = jwt.verify(token, config.jwtSecret) as any;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
}

export function requireRole(allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
export function sanitizePath(baseDir: string, userPath: string): string {
  const normalized = path.normalize(path.join(baseDir, userPath));
  if (!normalized.startsWith(path.normalize(baseDir))) {
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

export function validateShellCommand(command: string): boolean {
  const trimmed = command.trim();
  const firstWord = trimmed.split(' ')[0];
  return ALLOWED_COMMAND_PREFIXES.includes(firstWord);
}
