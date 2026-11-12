import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { notificationService } from '../services/notificationService';
import { NotificationType, NotificationStatus } from '../types/notification';
import logger from '../utils/logger';

export const createNotificationValidation = [
  body('type').isIn(Object.values(NotificationType)).withMessage('Invalid notification type'),
  body('recipient').isString().notEmpty().withMessage('Recipient is required'),
  body('subject').isString().notEmpty().withMessage('Subject is required'),
  body('message').isString().notEmpty().withMessage('Message is required'),
];

export const getNotificationValidation = [
  param('id').isUUID().withMessage('Invalid notification ID'),
];

export const notificationController = {
  async createNotification(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const notification = await notificationService.createNotification(req.body);
      res.status(201).json(notification);
    } catch (error) {
      next(error);
    }
  },

  async getNotification(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const notification = await notificationService.getNotification(req.params.id);
      if (!notification) {
        res.status(404).json({ error: 'Notification not found' });
        return;
      }

      res.json(notification);
    } catch (error) {
      next(error);
    }
  },

  async getAllNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const notifications = await notificationService.getAllNotifications();
      res.json(notifications);
    } catch (error) {
      next(error);
    }
  },

  async getNotificationsByStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const status = req.query.status as NotificationStatus;
      if (status && !Object.values(NotificationStatus).includes(status)) {
        res.status(400).json({ error: 'Invalid status' });
        return;
      }

      const notifications = status
        ? await notificationService.getNotificationsByStatus(status)
        : await notificationService.getAllNotifications();

      res.json(notifications);
    } catch (error) {
      next(error);
    }
  },

  async getNotificationsByType(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const type = req.query.type as NotificationType;
      if (type && !Object.values(NotificationType).includes(type)) {
        res.status(400).json({ error: 'Invalid type' });
        return;
      }

      const notifications = type
        ? await notificationService.getNotificationsByType(type)
        : await notificationService.getAllNotifications();

      res.json(notifications);
    } catch (error) {
      next(error);
    }
  },
};