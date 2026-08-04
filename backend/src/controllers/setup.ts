import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';

let setupState = {
  isCompleted: false,
  step: 1,
  data: {
    hostname: 'vps-prod-01',
    adminUsername: 'admin',
    adminEmail: 'admin@lightpanel.dev',
    databaseUrl: 'postgres://postgres:postgres@localhost:5432/lightpanel',
    redisUrl: 'redis://localhost:6379',
    mailDomain: 'lightpanel.dev',
    enableSSLAuto: true,
    quotaDefault: -1, // Unlimited by default
    analyticsEnabled: true,
  },
};

export async function getSetupStatusHandler(req: AuthenticatedRequest, res: Response) {
  return res.json({
    success: true,
    data: setupState,
  });
}

export async function saveSetupStepHandler(req: AuthenticatedRequest, res: Response) {
  const { step, data } = req.body;

  setupState = {
    ...setupState,
    step: Math.min(10, step || setupState.step + 1),
    data: { ...setupState.data, ...data },
  };

  if (step === 10) {
    setupState.isCompleted = true;
  }

  return res.json({
    success: true,
    data: setupState,
  });
}

export async function finishSetupHandler(req: AuthenticatedRequest, res: Response) {
  setupState.isCompleted = true;
  return res.json({
    success: true,
    message: 'LightPanel setup successfully completed!',
    data: setupState,
  });
}
