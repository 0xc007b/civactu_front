import type { User } from './user'

export interface Comment {
  id: string
  content: string
  isPublic: boolean
  opinionId?: string
  reportId?: string
  authorId: string
  parentId?: string
  author?: User
  parent?: Comment
  replies?: Comment[]
  createdAt: string
  updatedAt: string
}

export interface CreateCommentData {
  content: string
  isPublic?: boolean
  opinionId?: string
  reportId?: string
  parentId?: string
}

export interface UpdateCommentData {
  content?: string
  isPublic?: boolean
}

export interface CommentFilters {
  search?: string
  opinionId?: string
  reportId?: string
  authorId?: string
  isPublic?: boolean
  parentId?: string
  sortBy?: 'createdAt' | 'content'
  sortOrder?: 'asc' | 'desc'
}

export interface CommentStats {
  totalComments: number
  publicComments: number
  privateComments: number
  commentsByEntity: {
    opinions: number
    reports: number
  }
}
