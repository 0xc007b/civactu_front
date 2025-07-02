import type { User } from '~/types/user'
import type { OpinionType } from '~/types/opinion'
import type { ReportStatus, ReportCategory } from '~/types/report'

// Formatage des dates
export function formatDate(date: string | Date | null, options: {
  format?: 'short' | 'medium' | 'long' | 'full'
  includeTime?: boolean
  relative?: boolean
} = {}): string {
  if (!date) return 'Date inconnue'
  
  const { format = 'medium', includeTime = false, relative = false } = options
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) return 'Date invalide'
  
  if (relative) {
    return formatRelativeTime(dateObj)
  }
  
  const formatOptions: Intl.DateTimeFormatOptions = {
    dateStyle: format === 'short' ? 'short' : format === 'medium' ? 'medium' : format === 'long' ? 'long' : 'full'
  }
  
  if (includeTime) {
    formatOptions.timeStyle = 'short'
  }
  
  return new Intl.DateTimeFormat('fr-FR', formatOptions).format(dateObj)
}

export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - dateObj.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)
  
  if (diffSeconds < 60) return 'À l\'instant'
  if (diffMinutes < 60) return `Il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`
  if (diffHours < 24) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`
  if (diffDays < 7) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`
  if (diffWeeks < 4) return `Il y a ${diffWeeks} semaine${diffWeeks > 1 ? 's' : ''}`
  if (diffMonths < 12) return `Il y a ${diffMonths} mois`
  return `Il y a ${diffYears} an${diffYears > 1 ? 's' : ''}`
}

export function formatTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('fr-FR', {
    timeStyle: 'short'
  }).format(dateObj)
}

export function formatDateTime(date: string | Date): string {
  return formatDate(date, { includeTime: true })
}

// Formatage des nombres
export function formatNumber(number: number, options: {
  style?: 'decimal' | 'currency' | 'percent'
  currency?: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
} = {}): string {
  const { style = 'decimal', currency = 'EUR', minimumFractionDigits, maximumFractionDigits } = options
  
  return new Intl.NumberFormat('fr-FR', {
    style,
    currency: style === 'currency' ? currency : undefined,
    minimumFractionDigits,
    maximumFractionDigits
  }).format(number)
}

export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  return formatNumber(amount, { style: 'currency', currency })
}

export function formatPercent(value: number, decimals: number = 1): string {
  return formatNumber(value / 100, { 
    style: 'percent', 
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals 
  })
}

export function formatCompactNumber(number: number): string {
  return new Intl.NumberFormat('fr-FR', {
    notation: 'compact',
    compactDisplay: 'short'
  }).format(number)
}

// Formatage des chaînes de caractères
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - suffix.length) + suffix
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function capitalizeWords(str: string): string {
  return str.split(' ').map(word => capitalize(word)).join(' ')
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

// Formatage des types de données métier
export function formatOpinionType(type: OpinionType): string {
  const types: Record<OpinionType, string> = {
    SUPPORT: 'Soutien',
    OPPOSE: 'Opposition',
    NEUTRAL: 'Neutre',
    SUGGESTION: 'Suggestion'
  }
  return types[type] || type
}

export function formatReportStatus(status: ReportStatus): string {
  const statuses: Record<ReportStatus, string> = {
    PENDING: 'En attente',
    IN_PROGRESS: 'En cours',
    RESOLVED: 'Résolu',
    REJECTED: 'Rejeté'
  }
  return statuses[status] || status
}

export function formatReportCategory(category: ReportCategory): string {
  const categories: Record<ReportCategory, string> = {
    INFRASTRUCTURE: 'Infrastructure',
    ENVIRONMENT: 'Environnement',
    SECURITY: 'Sécurité',
    PUBLIC_SERVICE: 'Service public',
    TRANSPORTATION: 'Transport',
    HEALTH: 'Santé',
    EDUCATION: 'Éducation',
    OTHER: 'Autre'
  }
  return categories[category] || category
}

export function formatPriority(priority: number): string {
  const priorities: Record<number, string> = {
    1: 'Faible',
    2: 'Moyenne',
    3: 'Élevée',
    4: 'Critique'
  }
  return priorities[priority] || `Priorité ${priority}`
}

// Formatage des utilisateurs
export function formatUserName(user: User | null, options: {
  includeFirstName?: boolean
  includeLastName?: boolean
  anonymous?: boolean
  fallback?: string
} = {}): string {
  const { 
    includeFirstName = true, 
    includeLastName = true, 
    anonymous = false,
    fallback = 'Utilisateur inconnu'
  } = options
  
  if (!user) return fallback
  if (anonymous) return 'Utilisateur anonyme'
  
  const parts: string[] = []
  if (includeFirstName && user.firstName) parts.push(user.firstName)
  if (includeLastName && user.lastName) parts.push(user.lastName)
  
  return parts.length > 0 ? parts.join(' ') : user.email
}

export function formatUserInitials(user: User | null): string {
  if (!user) return '??'
  
  const firstInitial = user.firstName?.[0]?.toUpperCase() || ''
  const lastInitial = user.lastName?.[0]?.toUpperCase() || ''
  
  return firstInitial + lastInitial || user.email[0]?.toUpperCase() || '?'
}

// Formatage des tailles de fichiers
export function formatFileSize(bytes: number): string {
  const sizes = ['octets', 'Ko', 'Mo', 'Go', 'To']
  if (bytes === 0) return '0 octet'
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const size = bytes / Math.pow(1024, i)
  
  return `${size.toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`
}

// Formatage des adresses
export function formatAddress(address: {
  street?: string
  city?: string
  postalCode?: string
  country?: string
}): string {
  const parts: string[] = []
  
  if (address.street) parts.push(address.street)
  if (address.postalCode && address.city) {
    parts.push(`${address.postalCode} ${address.city}`)
  } else if (address.city) {
    parts.push(address.city)
  }
  if (address.country && address.country !== 'France') {
    parts.push(address.country)
  }
  
  return parts.join(', ')
}

// Note: formatCoordinates est disponible dans utils/geo.ts

// Formatage des durées
export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) return `${days} jour${days > 1 ? 's' : ''}`
  if (hours > 0) return `${hours} heure${hours > 1 ? 's' : ''}`
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`
  return `${seconds} seconde${seconds > 1 ? 's' : ''}`
}

// Formatage des listes
export function formatList(items: string[], options: {
  style?: 'short' | 'long' | 'narrow'
  type?: 'conjunction' | 'disjunction'
} = {}): string {
  const { style = 'long', type = 'conjunction' } = options
  
  return new Intl.ListFormat('fr-FR', { style, type }).format(items)
}

// Validation et nettoyage des chaînes
export function sanitizeString(str: string): string {
  return str.trim().replace(/\s+/g, ' ')
}

export function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export function extractHashtags(text: string): string[] {
  const hashtagRegex = /#(\w+)/g
  const matches = text.match(hashtagRegex)
  return matches ? matches.map(tag => tag.substring(1)) : []
}

export function extractMentions(text: string): string[] {
  const mentionRegex = /@(\w+)/g
  const matches = text.match(mentionRegex)
  return matches ? matches.map(mention => mention.substring(1)) : []
}

// Utilitaires de couleurs
export function getContrastColor(hexColor: string): 'black' | 'white' {
  const r = parseInt(hexColor.substr(1, 2), 16)
  const g = parseInt(hexColor.substr(3, 2), 16)
  const b = parseInt(hexColor.substr(5, 2), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? 'black' : 'white'
}

export function hexToRgba(hex: string, alpha: number = 1): string {
  const r = parseInt(hex.substr(1, 2), 16)
  const g = parseInt(hex.substr(3, 2), 16)
  const b = parseInt(hex.substr(5, 2), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
