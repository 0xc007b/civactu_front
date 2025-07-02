import type { User } from './user'
import type { Municipality, Region } from './user'

export type ReportStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED'
export type ReportCategory = 
  | 'INFRASTRUCTURE' 
  | 'ENVIRONMENT' 
  | 'SECURITY' 
  | 'PUBLIC_SERVICE' 
  | 'TRANSPORTATION' 
  | 'HEALTH' 
  | 'EDUCATION' 
  | 'OTHER'

export interface Report {
  id: string
  title: string
  description: string
  category: ReportCategory
  status: ReportStatus
  isAnonymous: boolean
  priority: number // 1=Low, 2=Medium, 3=High, 4=Critical
  address?: string
  latitude?: number
  longitude?: number
  municipalityId?: string
  regionId?: string
  images: string[]
  documents: string[]
  incidentDate?: string
  resolvedAt?: string
  reporterId: string
  assignedToId?: string
  reporter?: User
  assignedTo?: User
  municipality?: Municipality
  region?: Region
  updates?: ReportUpdate[]
  comments?: Comment[]
  type?: string
  targetType?: string
  targetId?: string
  reportedBy?: string
  reason?: string
  createdAt: string
  updatedAt: string
}

export interface ReportCreateInput {
  title: string
  description: string
  category: ReportCategory
  priority?: number
  address?: string
  latitude?: number
  longitude?: number
  municipalityId?: string
  regionId?: string
  images?: string[]
  documents?: string[]
  incidentDate?: string
  isAnonymous?: boolean
}

export interface ReportUpdateInput {
  title?: string
  description?: string
  category?: ReportCategory
  status?: ReportStatus
  priority?: number
  address?: string
  latitude?: number
  longitude?: number
  municipalityId?: string
  regionId?: string
  images?: string[]
  documents?: string[]
  incidentDate?: string
  resolvedAt?: string
  assignedToId?: string
}

export interface ReportUpdate {
  id: string
  reportId: string
  content: string
  status?: ReportStatus
  updatedBy: string
  user?: User
  createdAt: string
}

export interface CreateReportData {
  title: string
  description: string
  category: ReportCategory
  priority?: number
  address?: string
  latitude?: number
  longitude?: number
  municipalityId?: string
  regionId?: string
  isAnonymous?: boolean
  incidentDate?: string
  images?: string[] | File[]
  documents?: string[] | File[]
}

export interface UpdateReportData {
  title?: string
  description?: string
  category?: ReportCategory
  priority?: number
  address?: string
  latitude?: number
  longitude?: number
  municipalityId?: string
  regionId?: string
  status?: ReportStatus
  assignedToId?: string
}

export interface ReportFilters {
  search?: string
  status?: ReportStatus
  category?: ReportCategory
  priority?: number
  municipalityId?: string
  regionId?: string
  reporterId?: string
  assignedToId?: string
  dateFrom?: string
  dateTo?: string
  sortBy?: 'createdAt' | 'priority' | 'status' | 'category'
  sortOrder?: 'asc' | 'desc'
}

export interface ReportStats {
  totalReports: number
  reportsByStatus: Record<ReportStatus, number>
  reportsByCategory: Record<ReportCategory, number>
  reportsByPriority: Record<string, number>
  averageResolutionTime: number
  resolutionRate: number
}

export interface AssignReportData {
  assignedToId: string
}

export interface CreateReportUpdateData {
  content: string
  status?: ReportStatus
}

// Interface pour les commentaires (définie ici temporairement)
interface Comment {
  id: string
  content: string
  isPublic: boolean
  authorId: string
  author?: User
  reportId?: string
  parentId?: string
  replies?: Comment[]
  createdAt: string
  updatedAt: string
}
