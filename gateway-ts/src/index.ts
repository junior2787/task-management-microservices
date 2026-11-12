import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import logger from './utils/logger';
import { createServiceProxy, checkServicesHealth } from './utils/proxy';

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
  origin: config.nodeEnv === 'production'
    ? process.env.ALLOWED_ORIGINS?.split(',')
    : true,
  credentials: true,
}));

// Body parsing
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests, please try again later' },
});
app.use(limiter);

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.info('Request completed', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${Date.now() - start}ms`,
      ip: req.ip,
    });
  });
  next();
});

// Health check endpoint (aggregates all services)
app.get('/health', async (req, res) => {
  const servicesHealth = await checkServicesHealth();
  const allHealthy = Object.values(servicesHealth).every(h => h);

  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? 'healthy' : 'degraded',
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
    services: servicesHealth,
  });
});

// Service info endpoint
app.get('/info', (req, res) => {
  res.json({
    name: 'API Gateway',
    version: '1.0.0',
    services: {
      taskService: config.services.taskService,
      notificationService: config.services.notificationService,
    },
  });
});

// Proxy routes
app.use('/api/tasks', createServiceProxy('/api/tasks'));
app.use('/api/notifications', createServiceProxy('/api/notifications'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
  });
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const server = app.listen(config.port, () => {
  logger.info(`API Gateway running on port ${config.port}`, {
    env: config.nodeEnv,
    taskService: config.services.taskService,
    notificationService: config.services.notificationService,
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

export default app;