import { v4 as uuidv4 } from 'uuid';
import { Notification, NotificationStatus, CreateNotificationRequest, NotificationType } from '../types/notification';
import logger from '../utils/logger';

class NotificationService {
  private notifications: Map<string, Notification> = new Map();

  async createNotification(request: CreateNotificationRequest): Promise<Notification> {
    const notification: Notification = {
      id: uuidv4(),
      type: request.type,
      recipient: request.recipient,
      subject: request.subject,
      message: request.message,
      status: NotificationStatus.PENDING,
      createdAt: new Date(),
    };

    this.notifications.set(notification.id, notification);

    // Simulate async processing
    this.processNotification(notification.id);

    logger.info('Notification created', { notificationId: notification.id, type: notification.type });
    return notification;
  }

  async getNotification(id: string): Promise<Notification | null> {
    return this.notifications.get(id) || null;
  }

  async getAllNotifications(): Promise<Notification[]> {
    return Array.from(this.notifications.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getNotificationsByStatus(status: NotificationStatus): Promise<Notification[]> {
    return Array.from(this.notifications.values()).filter(n => n.status === status);
  }

  async getNotificationsByType(type: NotificationType): Promise<Notification[]> {
    return Array.from(this.notifications.values()).filter(n => n.type === type);
  }

  private async processNotification(id: string): Promise<void> {
    const notification = this.notifications.get(id);
    if (!notification) return;

    try {
      // Simulate sending notification (in real app, integrate with email/SMS/push providers)
      await this.simulateSend(notification);

      notification.status = NotificationStatus.SENT;
      notification.sentAt = new Date();
      this.notifications.set(id, notification);

      logger.info('Notification sent successfully', { notificationId: id });
    } catch (error) {
      notification.status = NotificationStatus.FAILED;
      notification.error = error instanceof Error ? error.message : 'Unknown error';
      this.notifications.set(id, notification);

      logger.error('Failed to send notification', { notificationId: id, error: notification.error });
    }
  }

  private async simulateSend(notification: Notification): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

    // Simulate occasional failures (10% chance)
    if (Math.random() < 0.1) {
      throw new Error(`${notification.type} provider unavailable`);
    }

    logger.debug(`Simulated ${notification.type} sent to ${notification.recipient}`);
  }
}

export const notificationService = new NotificationService();