import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  jwtSecret: process.env.JWT_SECRET || 'lightpanel-super-secret-jwt-key-2026',
  databaseUrl: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/lightpanel',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  defaultQuotaUnlimited: true,
};
