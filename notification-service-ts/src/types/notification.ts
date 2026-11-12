export enum NotificationType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
  IN_APP = 'IN_APP',
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
}

export interface Notification {
  id: string;
  type: NotificationType;
  recipient: string;
  subject: string;
  message: string;
  status: NotificationStatus;
  createdAt: Date;
  sentAt?: Date;
  error?: string;
}

export interface CreateNotificationRequest {
  type: NotificationType;
  recipient: string;
  subject: string;
  message: string;
}

export interface NotificationResponse {
  id: string;
  type: NotificationType;
  recipient: string;
  subject: string;
  message: string;
  status: NotificationStatus;
  createdAt: string;
  sentAt?: string;
  error?: string;
}