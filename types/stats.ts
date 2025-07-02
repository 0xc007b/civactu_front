import type { User } from './user'
import type { Municipality, Region } from './user'
import type { Opinion } from './opinion'
import type { Report } from './report'
import type { Message } from './message'
import type { Notification } from './notification'

export interface UserStats {
  opinions: number
  reports: number
  messages: number
  notifications: number
  likes: number
  views: number
  totalViews: number
  resolvedReports: number
  opinionsCount?: number
  commentsCount?: number
  userRank?: number
  averageRating?: number
}

export interface PublicStats {
  totalUsers: number
  totalReports: number
  resolvedReports: number
  totalOpinions: number
  activeMunicipalities: number
  totalMessages: number
  resolutionRate: number
  averageResolutionTime: number
  opinionsCount: number
  usersCount: number
  commentsCount: number
  averageRating: number
}

export interface DashboardData {
  userStats: UserStats
  recentActivities: Activity[]
  notifications: Notification[]
  recentReports: Report[]
  recentOpinions: Opinion[]
  municipality?: Municipality
}

export interface Activity {
  id: string
  type: 'opinion_created' | 'report_created' | 'report_updated' | 'message_sent' | 'comment_added'
  title: string
  description: string
  entityType: 'opinion' | 'report' | 'message' | 'comment'
  entityId: string
  userId: string
  user?: User
  createdAt: string
}

export interface MunicipalityStats {
  id: string
  name: string
  totalReports: number
  resolvedReports: number
  pendingReports: number
  totalOpinions: number
  totalUsers: number
  resolutionRate: number
  averageResolutionTime: number
  reportsByCategory: Record<string, number>
  opinionsByType: Record<string, number>
}

export interface RegionStats {
  id: string
  name: string
  municipalities: MunicipalityStats[]
  totalReports: number
  resolvedReports: number
  totalOpinions: number
  totalUsers: number
  resolutionRate: number
}

export interface TimeSeriesData {
  date: string
  value: number
  label?: string
}

export interface ChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string
    borderWidth?: number
  }>
}

export interface StatsFilters {
  municipalityId?: string
  regionId?: string
  dateFrom?: string
  dateTo?: string
  period?: 'day' | 'week' | 'month' | 'year'
}

export interface Stats {
  users: UserStats
  public: PublicStats
  activity: Activity[]
  trends: {
    opinions: Array<{ date: string; count: number }>
    reports: Array<{ date: string; count: number }>
    resolutions: Array<{ date: string; count: number }>
  }
  topMunicipalities: Array<{
    municipality: Municipality
    stats: {
      reports: number
      opinions: number
      resolutionRate: number
    }
  }>
}
