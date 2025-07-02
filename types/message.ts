import type { User } from './user'

export type MessageStatus = 'SENT' | 'READ' | 'REPLIED'

export interface Message {
  id: string
  subject: string
  content: string
  status: MessageStatus
  isRead: boolean
  readAt?: string
  senderId: string
  recipientId: string
  parentId?: string
  sender?: User
  recipient?: User
  parent?: Message
  replies?: Message[]
  createdAt: string
  updatedAt: string
}

export interface MessageCreateInput {
  recipientId: string
  subject: string
  content: string
  parentId?: string
}

export interface MessageUpdateInput {
  subject?: string
  content?: string
  isRead?: boolean
  status?: MessageStatus
}

export interface MessageFilters {
  type?: 'sent' | 'received'
  isRead?: boolean
  search?: string
  senderId?: string
  recipientId?: string
  receiverId?: string
  status?: MessageStatus
  dateFrom?: string
  dateTo?: string
  sortBy?: 'createdAt' | 'subject' | 'status'
  sortOrder?: 'asc' | 'desc'
}

export interface MessageThread {
  id: string
  subject: string
  participants: User[]
  lastMessage: Message
  unreadCount: number
  messages: Message[]
  createdAt: string
  updatedAt: string
}

export interface MessageStats {
  totalMessages: number
  unreadMessages: number
  sentMessages: number
  receivedMessages: number
  repliedMessages: number
}
