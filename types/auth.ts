// Import User types to avoid duplication
import type { User, UserRole, UserStatus, Municipality } from './user'

export type { UserRole, UserStatus } from './user'
//   municipalityId?: string
//   regionId?: string
//   municipality?: Municipality
//   region?: Region
//   createdAt: string
//   updatedAt: string
// }

// export interface Municipality {
//   id: string
//   name: string
//   postalCode: string
//   inseeCode: string
//   description?: string
//   latitude?: number
//   longitude?: number
//   regionId: string
//   region?: Region
//   createdAt: string
//   updatedAt: string
// }

// export interface Region {
//   id: string
//   name: string
//   code: string
//   description?: string
//   createdAt: string
//   updatedAt: string
// }

export interface Official {
  id: string
  userId: string
  municipalityId: string
  position: string
  startDate: string
  endDate?: string
  isActive: boolean
  user?: User
  municipality?: Municipality
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  role?: UserRole
}

export interface AuthResponse {
  success: boolean
  data: {
    user: User
    access_token: string
  }
}

export interface ForgotPasswordData {
  email: string
}

export interface ResetPasswordData {
  token: string
  password: string
}

export interface VerifyEmailData {
  token: string
}

export interface UpdateProfileData {
  firstName?: string
  lastName?: string
  phone?: string
  profile?: {
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
}
