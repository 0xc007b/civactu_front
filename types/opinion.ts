import type { User } from './user'
import type { Municipality, Region } from './user'
import type { Tag } from './tag'
import type { Comment } from './comment'

export type OpinionType = 'SUPPORT' | 'OPPOSE' | 'NEUTRAL' | 'SUGGESTION'

export interface Opinion {
  id: string
  title: string
  content: string
  type: OpinionType
  isPublic: boolean
  isAnonymous: boolean
  likesCount: number
  viewsCount: number
  municipalityId?: string
  regionId?: string
  authorId: string
  author?: User
  municipality?: Municipality
  region?: Region
  comments?: Comment[]
  tags?: Tag[]
  createdAt: string
  updatedAt: string
  isLiked?: boolean // Calculé côté client
}

export interface CreateOpinionData {
  title: string
  content: string
  type: OpinionType
  isPublic?: boolean
  isAnonymous?: boolean
  municipalityId?: string
  regionId?: string
  tags?: string[]
}

export interface UpdateOpinionData {
  title?: string
  content?: string
  type?: OpinionType
  isPublic?: boolean
  isAnonymous?: boolean
  municipalityId?: string
  regionId?: string
  tags?: string[]
}

export interface OpinionFilters {
  search?: string
  type?: OpinionType
  municipalityId?: string
  regionId?: string
  tags?: string[]
  authorId?: string
  isPublic?: boolean
  sortBy?: 'createdAt' | 'likesCount' | 'viewsCount' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
}

export interface OpinionStats {
  totalOpinions: number
  opinionsByType: Record<OpinionType, number>
  totalLikes: number
  totalViews: number
  averageLikesPerOpinion: number
}
