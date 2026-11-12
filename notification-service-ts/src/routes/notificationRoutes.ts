import { Router } from 'express';
import { notificationController } from '../controllers/notificationController';
import { createNotificationValidation, getNotificationValidation } from '../controllers/notificationController';

const router = Router();

router.post(
  '/',
  createNotificationValidation,
  notificationController.createNotification
);

router.get(
  '/',
  notificationController.getAllNotifications
);

router.get(
  '/status',
  notificationController.getNotificationsByStatus
);

router.get(
  '/type',
  notificationController.getNotificationsByType
);

router.get(
  '/:id',
  getNotificationValidation,
  notificationController.getNotification
);

export default router;