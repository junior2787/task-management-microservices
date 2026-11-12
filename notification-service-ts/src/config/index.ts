import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  taskServiceUrl: process.env.TASK_SERVICE_URL || 'http://localhost:8081',
  logLevel: process.env.LOG_LEVEL || 'info',
};