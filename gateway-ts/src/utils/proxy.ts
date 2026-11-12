import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { Request, Response, NextFunction } from 'express';
import { config } from '../config';
import logger from '../utils/logger';

interface ServiceConfig {
  target: string;
  pathRewrite?: Record<string, string>;
  changeOrigin: boolean;
}

const serviceConfigs: Record<string, ServiceConfig> = {
  '/api/tasks': {
    target: config.services.taskService,
    changeOrigin: true,
  },
  '/api/notifications': {
    target: config.services.notificationService,
    changeOrigin: true,
  },
};

export function createServiceProxy(servicePath: string) {
  const serviceConfig = serviceConfigs[servicePath];

  if (!serviceConfig) {
    throw new Error(`No configuration found for service path: ${servicePath}`);
  }

  return createProxyMiddleware({
    ...serviceConfig,
    onProxyReq: (proxyReq, req) => {
      logger.debug('Proxying request', {
        method: req.method,
        path: req.path,
        target: serviceConfig.target,
      });
    },
    onError: (err, req, res) => {
      logger.error('Proxy error', {
        error: err.message,
        target: serviceConfig.target,
        path: req.path,
      });

      if (!res.headersSent) {
        res.status(502).json({
          error: 'Bad Gateway',
          message: 'Service temporarily unavailable'
        });
      }
    },
    onProxyRes: (proxyRes, req) => {
      logger.debug('Proxy response', {
        statusCode: proxyRes.statusCode,
        path: req.path,
      });
    },
  } as Options);
}

// Health check aggregation
export async function checkServicesHealth(): Promise<Record<string, boolean>> {
  const results: Record<string, boolean> = {};

  for (const [path, serviceConfig] of Object.entries(serviceConfigs)) {
    try {
      const response = await fetch(`${serviceConfig.target}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      results[path] = response.ok;
    } catch {
      results[path] = false;
    }
  }

  return results;
}