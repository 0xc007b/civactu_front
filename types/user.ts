
export type UserRole = 'CITIZEN' | 'OFFICIAL' | 'ADMIN'
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  role: UserRole
  status: UserStatus
  isVerified: boolean
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
  profile?: UserProfile
}

export interface UserProfile {
  id: string
  userId: string
  dateOfBirth?: string
  address?: string
  postalCode?: string
  city?: string
  biography?: string
  website?: string
  socialLinks?: Record<string, string>
  preferences?: Record<string, any>
  municipalityId?: string
  regionId?: string
  municipality?: Municipality
  region?: Region
  createdAt: string
  updatedAt: string
}

export interface Municipality {
  id: string
  name: string
  postalCode: string
  inseeCode: string
  description?: string
  latitude?: number
  longitude?: number
  regionId: string
  createdAt: string
  updatedAt: string
}

export interface Region {
  id: string
  name: string
  code: string
  description?: string
}

export interface UpdateUserData {
  firstName?: string
  lastName?: string
  phone?: string
  avatar?: string
}

export interface UpdateProfileData {
  dateOfBirth?: string
  address?: string
  postalCode?: string
  city?: string
  biography?: string
  website?: string
  socialLinks?: Record<string, string>
  preferences?: Record<string, any>
  municipalityId?: string
  regionId?: string
}
