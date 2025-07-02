import type { User } from './user'

export type NotificationStatus = 'UNREAD' | 'READ'

export interface Notification {
  id: string
  title: string
  content: string
  type: string // 'report_update', 'message', 'opinion_comment', etc.
  status: NotificationStatus
  userId: string
  user?: User
  entityType?: string // 'report', 'opinion', 'message'
  entityId?: string // ID de l'entité concernée
  createdAt: string
  readAt?: string
}

export interface NotificationFilters {
  status?: NotificationStatus
  type?: string
  entityType?: string
  dateFrom?: string
  dateTo?: string
  sortBy?: 'createdAt' | 'type' | 'status'
  sortOrder?: 'asc' | 'desc'
}

export interface NotificationStats {
  totalNotifications: number
  unreadNotifications: number
  notificationsByType: Record<string, number>
}

export interface CreateNotificationData {
  title: string
  content: string
  type: string
  userId: string
  entityType?: string
  entityId?: string
}

export interface NotificationPreferences {
  emailNotifications: boolean
  pushNotifications: boolean
  reportUpdates: boolean
  messageReceived: boolean
  opinionComments: boolean
  systemUpdates: boolean
  weeklyDigest: boolean
}
