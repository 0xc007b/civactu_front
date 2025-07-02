// Configuration de l'API
export const API_CONFIG = {
  BASE_URL: process.env.API_BASE_URL || 'http://localhost:3001/api/v1',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
} as const

// Configuration WebSocket
export const WS_CONFIG = {
  URL: process.env.WS_URL || 'ws://localhost:3001',
  RECONNECT_INTERVAL: 5000,
  MAX_RECONNECT_ATTEMPTS: 5
} as const

// Configuration PWA
export const PWA_CONFIG = {
  VAPID_PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY || '',
  NOTIFICATION_ICON: '/icons/icon-192x192.png',
  BADGE_ICON: '/icons/badge-72x72.png'
} as const

// Configuration de l'application
export const APP_CONFIG = {
  NAME: 'CivActu',
  VERSION: '1.0.0',
  DESCRIPTION: 'Application citoyenne pour la démocratie participative',
  CONTACT_EMAIL: 'contact@civactu.fr',
  SUPPORT_EMAIL: 'support@civactu.fr'
} as const

// Limites de pagination
export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  DEFAULT_PAGE: 1
} as const

// Limites de fichiers
export const FILE_LIMITS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_FILES: 5,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.pdf']
} as const

// Configuration des cartes
export const MAP_CONFIG = {
  DEFAULT_CENTER: {
    latitude: 46.603354,
    longitude: 1.888334
  },
  DEFAULT_ZOOM: 6,
  MAPBOX_TOKEN: process.env.MAPBOX_TOKEN || '',
  TILE_URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  ATTRIBUTION: '© OpenStreetMap contributors'
} as const

// Durées de cache
export const CACHE_DURATION = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 30 * 60 * 1000, // 30 minutes
  LONG: 24 * 60 * 60 * 1000, // 24 heures
  VERY_LONG: 7 * 24 * 60 * 60 * 1000 // 7 jours
} as const

// Délais de rafraîchissement
export const REFRESH_INTERVALS = {
  NOTIFICATIONS: 30 * 1000, // 30 secondes
  MESSAGES: 60 * 1000, // 1 minute
  DASHBOARD: 5 * 60 * 1000, // 5 minutes
  STATS: 15 * 60 * 1000 // 15 minutes
} as const

// Seuils et limites
export const THRESHOLDS = {
  PASSWORD_MIN_LENGTH: 8,
  TEXT_PREVIEW_LENGTH: 150,
  TITLE_MAX_LENGTH: 200,
  CONTENT_MAX_LENGTH: 5000,
  BIOGRAPHY_MAX_LENGTH: 500,
  COMMENT_MAX_LENGTH: 1000,
  TAG_MAX_LENGTH: 50
} as const

// Codes d'erreur
export const ERROR_CODES = {
  // Authentification
  AUTH_TOKEN_MISSING: 'AUTH_001',
  AUTH_TOKEN_INVALID: 'AUTH_002',
  AUTH_TOKEN_EXPIRED: 'AUTH_003',
  AUTH_CREDENTIALS_INVALID: 'AUTH_004',
  AUTH_ACCOUNT_NOT_VERIFIED: 'AUTH_005',
  AUTH_ACCOUNT_SUSPENDED: 'AUTH_006',
  
  // Autorisation
  AUTHZ_INSUFFICIENT_PERMISSIONS: 'AUTHZ_001',
  AUTHZ_RESOURCE_FORBIDDEN: 'AUTHZ_002',
  AUTHZ_ACTION_NOT_ALLOWED: 'AUTHZ_003',
  
  // Validation
  VALID_DATA_MISSING: 'VALID_001',
  VALID_FORMAT_INVALID: 'VALID_002',
  VALID_VALUE_OUT_OF_RANGE: 'VALID_003',
  VALID_EMAIL_ALREADY_USED: 'VALID_004',
  
  // Ressources
  RESOURCE_NOT_FOUND: 'RESOURCE_001',
  RESOURCE_ALREADY_EXISTS: 'RESOURCE_002',
  RESOURCE_CONFLICT: 'RESOURCE_003',
  
  // Serveur
  SERVER_INTERNAL_ERROR: 'SERVER_001',
  SERVER_DATABASE_UNAVAILABLE: 'SERVER_002',
  SERVER_EXTERNAL_SERVICE_UNAVAILABLE: 'SERVER_003'
} as const

// Messages d'erreur par défaut
export const ERROR_MESSAGES = {
  [ERROR_CODES.AUTH_TOKEN_MISSING]: 'Token d\'authentification manquant',
  [ERROR_CODES.AUTH_TOKEN_INVALID]: 'Token d\'authentification invalide',
  [ERROR_CODES.AUTH_TOKEN_EXPIRED]: 'Session expirée, veuillez vous reconnecter',
  [ERROR_CODES.AUTH_CREDENTIALS_INVALID]: 'Identifiants incorrects',
  [ERROR_CODES.AUTH_ACCOUNT_NOT_VERIFIED]: 'Compte non vérifié',
  [ERROR_CODES.AUTH_ACCOUNT_SUSPENDED]: 'Compte suspendu',
  
  [ERROR_CODES.AUTHZ_INSUFFICIENT_PERMISSIONS]: 'Permissions insuffisantes',
  [ERROR_CODES.AUTHZ_RESOURCE_FORBIDDEN]: 'Accès à cette ressource interdit',
  [ERROR_CODES.AUTHZ_ACTION_NOT_ALLOWED]: 'Action non autorisée',
  
  [ERROR_CODES.VALID_DATA_MISSING]: 'Données manquantes',
  [ERROR_CODES.VALID_FORMAT_INVALID]: 'Format invalide',
  [ERROR_CODES.VALID_VALUE_OUT_OF_RANGE]: 'Valeur hors limites',
  [ERROR_CODES.VALID_EMAIL_ALREADY_USED]: 'Email déjà utilisé',
  
  [ERROR_CODES.RESOURCE_NOT_FOUND]: 'Ressource non trouvée',
  [ERROR_CODES.RESOURCE_ALREADY_EXISTS]: 'Ressource déjà existante',
  [ERROR_CODES.RESOURCE_CONFLICT]: 'Conflit de ressource',
  
  [ERROR_CODES.SERVER_INTERNAL_ERROR]: 'Erreur interne du serveur',
  [ERROR_CODES.SERVER_DATABASE_UNAVAILABLE]: 'Base de données indisponible',
  [ERROR_CODES.SERVER_EXTERNAL_SERVICE_UNAVAILABLE]: 'Service externe indisponible'
} as const

// Routes de l'API
export const API_ROUTES = {
  // Authentification
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification'
  },
  
  // Utilisateurs
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
    DELETE_ACCOUNT: '/users/delete-account',
    UPLOAD_AVATAR: '/users/avatar'
  },
  
  // Avis/Opinions
  OPINIONS: {
    LIST: '/opinions',
    CREATE: '/opinions',
    GET: '/opinions/:id',
    UPDATE: '/opinions/:id',
    DELETE: '/opinions/:id',
    LIKE: '/opinions/:id/like',
    MY_OPINIONS: '/opinions/my'
  },
  
  // Signalements
  REPORTS: {
    LIST: '/reports',
    CREATE: '/reports',
    GET: '/reports/:id',
    UPDATE: '/reports/:id',
    DELETE: '/reports/:id',
    ASSIGN: '/reports/:id/assign',
    UPDATE_STATUS: '/reports/:id/update',
    MY_REPORTS: '/reports/my',
    ASSIGNED_REPORTS: '/reports/assigned'
  },
  
  // Messages
  MESSAGES: {
    LIST: '/messages',
    CREATE: '/messages',
    GET: '/messages/:id',
    REPLY: '/messages/:id/reply',
    MARK_READ: '/messages/:id/read',
    DELETE: '/messages/:id'
  },
  
  // Commentaires
  COMMENTS: {
    LIST: '/comments',
    CREATE: '/comments',
    UPDATE: '/comments/:id',
    DELETE: '/comments/:id'
  },
  
  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: '/notifications/:id/read',
    MARK_ALL_READ: '/notifications/read-all',
    DELETE: '/notifications/:id',
    PREFERENCES: '/notifications/preferences'
  },
  
  // Géolocalisation
  LOCATIONS: {
    REGIONS: '/locations/regions',
    MUNICIPALITIES: '/locations/municipalities',
    SEARCH: '/locations/search'
  },
  
  // Tags
  TAGS: {
    LIST: '/tags',
    CREATE: '/tags',
    UPDATE: '/tags/:id',
    DELETE: '/tags/:id'
  },
  
  // Statistiques
  STATS: {
    DASHBOARD: '/stats/dashboard',
    PUBLIC: '/stats/public',
    MUNICIPALITY: '/stats/municipality/:id',
    REGION: '/stats/region/:id'
  },
  
  // Recherche
  SEARCH: {
    GLOBAL: '/search',
    OPINIONS: '/search/opinions',
    REPORTS: '/search/reports',
    USERS: '/search/users'
  },
  
  // Health check
  HEALTH: '/health'
} as const

// Types d'événements WebSocket
export const WS_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  NEW_MESSAGE: 'new_message',
  NEW_NOTIFICATION: 'new_notification',
  REPORT_UPDATE: 'report_update',
  OPINION_LIKE: 'opinion_like',
  COMMENT_ADDED: 'comment_added'
} as const

// Rôles et permissions
export const ROLES = {
  CITIZEN: 'CITIZEN',
  OFFICIAL: 'OFFICIAL',
  ADMIN: 'ADMIN'
} as const

export const PERMISSIONS = {
  // Permissions générales
  VIEW_PUBLIC_CONTENT: 'view_public_content',
  CREATE_CONTENT: 'create_content',
  EDIT_OWN_CONTENT: 'edit_own_content',
  DELETE_OWN_CONTENT: 'delete_own_content',
  
  // Permissions de modération
  MODERATE_CONTENT: 'moderate_content',
  EDIT_ANY_CONTENT: 'edit_any_content',
  DELETE_ANY_CONTENT: 'delete_any_content',
  
  // Permissions sur les signalements
  VIEW_ALL_REPORTS: 'view_all_reports',
  ASSIGN_REPORTS: 'assign_reports',
  UPDATE_REPORT_STATUS: 'update_report_status',
  
  // Permissions d'administration
  MANAGE_USERS: 'manage_users',
  MANAGE_SYSTEM: 'manage_system',
  VIEW_ADMIN_PANEL: 'view_admin_panel'
} as const

// Mapping des permissions par rôle
export const ROLE_PERMISSIONS = {
  [ROLES.CITIZEN]: [
    PERMISSIONS.VIEW_PUBLIC_CONTENT,
    PERMISSIONS.CREATE_CONTENT,
    PERMISSIONS.EDIT_OWN_CONTENT,
    PERMISSIONS.DELETE_OWN_CONTENT
  ],
  [ROLES.OFFICIAL]: [
    PERMISSIONS.VIEW_PUBLIC_CONTENT,
    PERMISSIONS.CREATE_CONTENT,
    PERMISSIONS.EDIT_OWN_CONTENT,
    PERMISSIONS.DELETE_OWN_CONTENT,
    PERMISSIONS.MODERATE_CONTENT,
    PERMISSIONS.VIEW_ALL_REPORTS,
    PERMISSIONS.ASSIGN_REPORTS,
    PERMISSIONS.UPDATE_REPORT_STATUS
  ],
  [ROLES.ADMIN]: [
    PERMISSIONS.VIEW_PUBLIC_CONTENT,
    PERMISSIONS.CREATE_CONTENT,
    PERMISSIONS.EDIT_OWN_CONTENT,
    PERMISSIONS.DELETE_OWN_CONTENT,
    PERMISSIONS.MODERATE_CONTENT,
    PERMISSIONS.EDIT_ANY_CONTENT,
    PERMISSIONS.DELETE_ANY_CONTENT,
    PERMISSIONS.VIEW_ALL_REPORTS,
    PERMISSIONS.ASSIGN_REPORTS,
    PERMISSIONS.UPDATE_REPORT_STATUS,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_SYSTEM,
    PERMISSIONS.VIEW_ADMIN_PANEL
  ]
} as const

// Couleurs par statut/type
export const STATUS_COLORS = {
  // Statuts de signalement
  PENDING: '#F59E0B', // Amber
  IN_PROGRESS: '#3B82F6', // Blue
  RESOLVED: '#10B981', // Green
  REJECTED: '#EF4444', // Red
  
  // Types d'avis
  SUPPORT: '#10B981', // Green
  OPPOSE: '#EF4444', // Red
  NEUTRAL: '#6B7280', // Gray
  SUGGESTION: '#3B82F6', // Blue
  
  // Priorités
  PRIORITY_1: '#10B981', // Low - Green
  PRIORITY_2: '#F59E0B', // Medium - Amber
  PRIORITY_3: '#EF4444', // High - Red
  PRIORITY_4: '#DC2626', // Critical - Dark Red
  
  // Rôles
  CITIZEN: '#3B82F6', // Blue
  OFFICIAL: '#10B981', // Green
  ADMIN: '#8B5CF6' // Purple
} as const

// Configuration des couleurs par défaut
export const DEFAULT_COLORS = {
  PRIMARY: '#3B82F6',
  SECONDARY: '#6B7280',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#3B82F6'
} as const
