import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  services: {
    taskService: process.env.TASK_SERVICE_URL || 'http://localhost:8081',
    notificationService: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3001',
  },
  logLevel: process.env.LOG_LEVEL || 'info',
};