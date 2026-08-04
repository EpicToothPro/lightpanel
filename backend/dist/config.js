"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: parseInt(process.env.PORT || '3001', 10),
    jwtSecret: process.env.JWT_SECRET || 'lightpanel-super-secret-jwt-key-2026',
    databaseUrl: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/lightpanel',
    redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || '*',
    defaultQuotaUnlimited: true,
};
