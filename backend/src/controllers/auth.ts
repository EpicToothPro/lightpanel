import { Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AuthenticatedRequest } from '../middleware/auth';
import { config } from '../config';

export async function loginHandler(req: AuthenticatedRequest, res: Response) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Username and password required' });
  }

  // Simulated authentication check
  const token = jwt.sign(
    { id: 'usr-1', username: 'admin', email: 'admin@lightpanel.dev', role: 'owner' },
    config.jwtSecret,
    { expiresIn: '7d' }
  );

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

export async function listUsersHandler(req: AuthenticatedRequest, res: Response) {
  return res.json({
    success: true,
    data: [
      { id: 'usr-1', username: 'admin', email: 'admin@lightpanel.dev', role: 'owner', status: 'active', quota_mb: -1 },
      { id: 'usr-2', username: 'deployer', email: 'ci-cd@lightpanel.dev', role: 'standard', status: 'active', quota_mb: 10240 },
    ],
  });
}

export async function shareResourceHandler(req: AuthenticatedRequest, res: Response) {
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
