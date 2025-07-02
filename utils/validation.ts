import { z } from 'zod'

// Schémas de validation pour l'authentification
export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères')
})

export const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'),
  confirmPassword: z.string(),
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  phone: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword']
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email invalide')
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token requis'),
  password: z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword']
})

// Schémas pour les profils utilisateur
export const updateProfileSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères').optional(),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').optional(),
  phone: z.string().optional(),
  profile: z.object({
    dateOfBirth: z.string().optional(),
    address: z.string().optional(),
    postalCode: z.string().regex(/^\d{5}$/, 'Code postal invalide').optional(),
    city: z.string().optional(),
    biography: z.string().max(500, 'La biographie ne peut pas dépasser 500 caractères').optional(),
    website: z.string().url('URL invalide').optional(),
    municipalityId: z.string().optional(),
    regionId: z.string().optional()
  }).optional()
})

// Schémas pour les avis/opinions
export const createOpinionSchema = z.object({
  title: z.string().min(5, 'Le titre doit contenir au moins 5 caractères').max(200, 'Le titre ne peut pas dépasser 200 caractères'),
  content: z.string().min(10, 'Le contenu doit contenir au moins 10 caractères').max(5000, 'Le contenu ne peut pas dépasser 5000 caractères'),
  type: z.enum(['SUPPORT', 'OPPOSE', 'NEUTRAL', 'SUGGESTION']),
  isPublic: z.boolean().default(true),
  isAnonymous: z.boolean().default(false),
  municipalityId: z.string().optional(),
  regionId: z.string().optional(),
  tags: z.array(z.string()).optional()
})

export const updateOpinionSchema = createOpinionSchema.partial()

// Schémas pour les signalements
export const createReportSchema = z.object({
  title: z.string().min(5, 'Le titre doit contenir au moins 5 caractères').max(200, 'Le titre ne peut pas dépasser 200 caractères'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères').max(5000, 'La description ne peut pas dépasser 5000 caractères'),
  category: z.enum(['INFRASTRUCTURE', 'ENVIRONMENT', 'SECURITY', 'PUBLIC_SERVICE', 'TRANSPORTATION', 'HEALTH', 'EDUCATION', 'OTHER']),
  priority: z.number().min(1).max(4).default(1),
  address: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  municipalityId: z.string().optional(),
  regionId: z.string().optional(),
  isAnonymous: z.boolean().default(false),
  incidentDate: z.string().optional()
})

export const updateReportSchema = createReportSchema.partial().extend({
  status: z.enum(['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED']).optional(),
  assignedToId: z.string().optional()
})

export const createReportUpdateSchema = z.object({
  content: z.string().min(5, 'Le contenu doit contenir au moins 5 caractères').max(1000, 'Le contenu ne peut pas dépasser 1000 caractères'),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED']).optional()
})

// Schémas pour les messages
export const createMessageSchema = z.object({
  recipientId: z.string().min(1, 'Destinataire requis'),
  subject: z.string().min(3, 'Le sujet doit contenir au moins 3 caractères').max(200, 'Le sujet ne peut pas dépasser 200 caractères'),
  content: z.string().min(10, 'Le message doit contenir au moins 10 caractères').max(5000, 'Le message ne peut pas dépasser 5000 caractères'),
  parentId: z.string().optional()
})

// Schémas pour les commentaires
export const createCommentSchema = z.object({
  content: z.string().min(3, 'Le commentaire doit contenir au moins 3 caractères').max(1000, 'Le commentaire ne peut pas dépasser 1000 caractères'),
  isPublic: z.boolean().default(true),
  opinionId: z.string().optional(),
  reportId: z.string().optional(),
  parentId: z.string().optional()
}).refine((data) => data.opinionId || data.reportId, {
  message: 'Le commentaire doit être associé à un avis ou un signalement'
})

export const updateCommentSchema = z.object({
  content: z.string().min(3, 'Le commentaire doit contenir au moins 3 caractères').max(1000, 'Le commentaire ne peut pas dépasser 1000 caractères').optional(),
  isPublic: z.boolean().optional()
})

// Schémas pour les tags
export const createTagSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Couleur hexadécimale invalide').optional(),
  description: z.string().max(200, 'La description ne peut pas dépasser 200 caractères').optional()
})

export const updateTagSchema = createTagSchema.partial()

// Schémas de validation pour les filtres
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

export const searchSchema = z.object({
  search: z.string().optional()
})

// Validation d'email
export function isValidEmail(email: string): boolean {
  return z.string().email().safeParse(email).success
}

// Validation de mot de passe
export function isValidPassword(password: string): boolean {
  return z.string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .safeParse(password).success
}

// Validation de numéro de téléphone français
export function isValidFrenchPhone(phone: string): boolean {
  return /^(?:(?:\+33|0)[1-9](?:[0-9]{8}))$/.test(phone.replace(/\s/g, ''))
}

// Validation de code postal français
export function isValidFrenchPostalCode(postalCode: string): boolean {
  return /^\d{5}$/.test(postalCode)
}

// Validation d'URL
export function isValidUrl(url: string): boolean {
  return z.string().url().safeParse(url).success
}

// Utilitaires de validation génériques
export function validateRequired(value: any, fieldName: string): string | null {
  if (value === undefined || value === null || value === '') {
    return `${fieldName} est requis`
  }
  return null
}

export function validateMinLength(value: string, minLength: number, fieldName: string): string | null {
  if (value && value.length < minLength) {
    return `${fieldName} doit contenir au moins ${minLength} caractères`
  }
  return null
}

export function validateMaxLength(value: string, maxLength: number, fieldName: string): string | null {
  if (value && value.length > maxLength) {
    return `${fieldName} ne peut pas dépasser ${maxLength} caractères`
  }
  return null
}

export function validateRange(value: number, min: number, max: number, fieldName: string): string | null {
  if (value < min || value > max) {
    return `${fieldName} doit être entre ${min} et ${max}`
  }
  return null
}

// Fonction générique de validation avec Zod
export function validateWithSchema<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data)
  
  if (result.success) {
    return { success: true, data: result.data }
  } else {
    const errors = result.error.errors.map(err => err.message)
    return { success: false, errors }
  }
}

// Types pour les résultats de validation
export type ValidationResult<T> = {
  success: true
  data: T
} | {
  success: false
  errors: string[]
}
