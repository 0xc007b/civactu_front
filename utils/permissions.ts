import type { User } from '~/types/user'
import { ROLES, PERMISSIONS, ROLE_PERMISSIONS } from './constants'

// Vérification des rôles
export function hasRole(user: User | null, role: string): boolean {
  return user?.role === role
}

export function hasAnyRole(user: User | null, roles: string[]): boolean {
  return user ? roles.includes(user.role) : false
}

export function isAdmin(user: User | null): boolean {
  return hasRole(user, ROLES.ADMIN)
}

export function isOfficial(user: User | null): boolean {
  return hasRole(user, ROLES.OFFICIAL)
}

export function isCitizen(user: User | null): boolean {
  return hasRole(user, ROLES.CITIZEN)
}

// Vérification des permissions
export function hasPermission(user: User | null, permission: string): boolean {
  if (!user) return false
  
  const userPermissions = ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS] || []
  return userPermissions.includes(permission as any)
}

export function hasAnyPermission(user: User | null, permissions: string[]): boolean {
  return permissions.some(permission => hasPermission(user, permission))
}

export function hasAllPermissions(user: User | null, permissions: string[]): boolean {
  return permissions.every(permission => hasPermission(user, permission))
}

// Permissions spécifiques pour l'interface
export function canViewAdminPanel(user: User | null): boolean {
  return hasPermission(user, PERMISSIONS.VIEW_ADMIN_PANEL)
}

export function canModerateContent(user: User | null): boolean {
  return hasPermission(user, PERMISSIONS.MODERATE_CONTENT)
}

export function canManageUsers(user: User | null): boolean {
  return hasPermission(user, PERMISSIONS.MANAGE_USERS)
}

export function canManageSystem(user: User | null): boolean {
  return hasPermission(user, PERMISSIONS.MANAGE_SYSTEM)
}

export function canViewAllReports(user: User | null): boolean {
  return hasPermission(user, PERMISSIONS.VIEW_ALL_REPORTS)
}

export function canAssignReports(user: User | null): boolean {
  return hasPermission(user, PERMISSIONS.ASSIGN_REPORTS)
}

export function canUpdateReportStatus(user: User | null): boolean {
  return hasPermission(user, PERMISSIONS.UPDATE_REPORT_STATUS)
}

// Permissions sur les ressources spécifiques
export function canEditOpinion(user: User | null, opinionAuthorId: string): boolean {
  if (!user) return false
  
  // L'auteur peut toujours modifier son propre contenu
  if (user.id === opinionAuthorId && hasPermission(user, PERMISSIONS.EDIT_OWN_CONTENT)) {
    return true
  }
  
  // Les modérateurs peuvent modifier tout contenu
  return hasPermission(user, PERMISSIONS.EDIT_ANY_CONTENT)
}

export function canDeleteOpinion(user: User | null, opinionAuthorId: string): boolean {
  if (!user) return false
  
  // L'auteur peut toujours supprimer son propre contenu
  if (user.id === opinionAuthorId && hasPermission(user, PERMISSIONS.DELETE_OWN_CONTENT)) {
    return true
  }
  
  // Les modérateurs peuvent supprimer tout contenu
  return hasPermission(user, PERMISSIONS.DELETE_ANY_CONTENT)
}

export function canEditReport(user: User | null, reporterId: string, assignedToId?: string): boolean {
  if (!user) return false
  
  // L'auteur peut modifier son propre signalement
  if (user.id === reporterId && hasPermission(user, PERMISSIONS.EDIT_OWN_CONTENT)) {
    return true
  }
  
  // L'élu assigné peut modifier le signalement
  if (assignedToId && user.id === assignedToId) {
    return true
  }
  
  // Les modérateurs peuvent modifier tout contenu
  return hasPermission(user, PERMISSIONS.EDIT_ANY_CONTENT)
}

export function canDeleteReport(user: User | null, reporterId: string): boolean {
  if (!user) return false
  
  // L'auteur peut supprimer son propre signalement
  if (user.id === reporterId && hasPermission(user, PERMISSIONS.DELETE_OWN_CONTENT)) {
    return true
  }
  
  // Les modérateurs peuvent supprimer tout contenu
  return hasPermission(user, PERMISSIONS.DELETE_ANY_CONTENT)
}

export function canAssignReport(user: User | null, reportId: string): boolean {
  return canAssignReports(user)
}

export function canUpdateReportStatusForReport(user: User | null, assignedToId?: string): boolean {
  if (!user) return false
  
  // L'élu assigné peut mettre à jour le statut
  if (assignedToId && user.id === assignedToId) {
    return true
  }
  
  // Les administrateurs peuvent toujours mettre à jour
  return isAdmin(user)
}

export function canEditComment(user: User | null, commentAuthorId: string): boolean {
  if (!user) return false
  
  // L'auteur peut modifier son propre commentaire
  if (user.id === commentAuthorId && hasPermission(user, PERMISSIONS.EDIT_OWN_CONTENT)) {
    return true
  }
  
  // Les modérateurs peuvent modifier tout contenu
  return hasPermission(user, PERMISSIONS.EDIT_ANY_CONTENT)
}

export function canDeleteComment(user: User | null, commentAuthorId: string): boolean {
  if (!user) return false
  
  // L'auteur peut supprimer son propre commentaire
  if (user.id === commentAuthorId && hasPermission(user, PERMISSIONS.DELETE_OWN_CONTENT)) {
    return true
  }
  
  // Les modérateurs peuvent supprimer tout contenu
  return hasPermission(user, PERMISSIONS.DELETE_ANY_CONTENT)
}

export function canSendMessage(user: User | null, recipientId: string): boolean {
  if (!user) return false
  
  // Ne peut pas s'envoyer un message à soi-même
  if (user.id === recipientId) return false
  
  // Doit avoir la permission de créer du contenu
  return hasPermission(user, PERMISSIONS.CREATE_CONTENT)
}

export function canReplyToMessage(user: User | null, messageParticipantIds: string[]): boolean {
  if (!user) return false
  
  // Doit être un participant de la conversation
  if (!messageParticipantIds.includes(user.id)) return false
  
  // Doit avoir la permission de créer du contenu
  return hasPermission(user, PERMISSIONS.CREATE_CONTENT)
}

// Permissions pour les tags
export function canCreateTag(user: User | null): boolean {
  return canModerateContent(user)
}

export function canEditTag(user: User | null): boolean {
  return canModerateContent(user)
}

export function canDeleteTag(user: User | null): boolean {
  return canModerateContent(user)
}

// Permissions pour les notifications
export function canManageNotifications(user: User | null): boolean {
  return canManageSystem(user)
}

// Permissions pour les statistiques
export function canViewDetailedStats(user: User | null): boolean {
  return hasAnyRole(user, [ROLES.OFFICIAL, ROLES.ADMIN])
}

export function canViewMunicipalityStats(user: User | null, municipalityId?: string): boolean {
  if (!user) return false
  
  // Les admins peuvent voir toutes les stats
  if (isAdmin(user)) return true
  
  // Les élus peuvent voir les stats de leur municipalité
  if (isOfficial(user) && municipalityId) {
    // TODO: Vérifier si l'élu appartient à cette municipalité
    return user.profile?.municipalityId === municipalityId
  }
  
  return false
}

// Utilitaires de vérification d'état
export function isAccountActive(user: User | null): boolean {
  return user?.status === 'ACTIVE'
}

export function isAccountVerified(user: User | null): boolean {
  return user?.isVerified === true
}

export function canAccessApplication(user: User | null): boolean {
  return user ? isAccountActive(user) && isAccountVerified(user) : false
}

// Utilitaires pour l'interface utilisateur
export function shouldShowModeratorActions(user: User | null): boolean {
  return canModerateContent(user)
}

export function shouldShowAdminMenu(user: User | null): boolean {
  return canViewAdminPanel(user)
}

export function shouldShowOfficialFeatures(user: User | null): boolean {
  return hasAnyRole(user, [ROLES.OFFICIAL, ROLES.ADMIN])
}

export function getAvailableActions(user: User | null, resourceType: string, resourceData: any): string[] {
  const actions: string[] = []
  
  switch (resourceType) {
    case 'opinion':
      if (canEditOpinion(user, resourceData.authorId)) actions.push('edit')
      if (canDeleteOpinion(user, resourceData.authorId)) actions.push('delete')
      if (user && user.id !== resourceData.authorId) actions.push('like')
      actions.push('comment')
      break
      
    case 'report':
      if (canEditReport(user, resourceData.reporterId, resourceData.assignedToId)) actions.push('edit')
      if (canDeleteReport(user, resourceData.reporterId)) actions.push('delete')
      if (canAssignReports(user)) actions.push('assign')
      if (canUpdateReportStatusForReport(user, resourceData.assignedToId)) actions.push('update_status')
      actions.push('comment')
      break
      
    case 'comment':
      if (canEditComment(user, resourceData.authorId)) actions.push('edit')
      if (canDeleteComment(user, resourceData.authorId)) actions.push('delete')
      actions.push('reply')
      break
      
    case 'message':
      if (resourceData.participantIds?.includes(user?.id)) {
        actions.push('reply')
        if (user?.id === resourceData.senderId) actions.push('delete')
      }
      break
  }
  
  return actions
}

// Export des permissions pour utilisation dans les composants
export { PERMISSIONS, ROLES, ROLE_PERMISSIONS }
