<template>
  <div class="dashboard-container">
    <!-- Contenu principal du dashboard -->
    <div class="dashboard-content">
      <!-- En-tête avec barre de recherche et profil -->
      <div class="dashboard-header">
        <h1 class="welcome-title">Bienvenue sur CivActu</h1>
        <div class="user-controls">
          <div class="search-bar">
            <input type="text" placeholder="Rechercher..." />
            <span class="search-icon">🔍</span>
          </div>
          <div class="user-profile">
            <UAvatar 
              :src="user?.avatar" 
              :alt="userFullName"
              size="md"
            />
            <span class="user-name">{{ userFullName }}</span>
          </div>
        </div>
      </div>

      <!-- Statistiques rapides -->
      <div class="stats-container">
        <div class="stats-card">
          <div class="stats-icon opinion-icon">
            <span>📝</span>
          </div>
          <div class="stats-content">
            <h3 class="stats-title">Mes Avis</h3>
            <p class="stats-value">{{ userStats.opinions || 0 }}</p>
          </div>
        </div>
        
        <div class="stats-card">
          <div class="stats-icon report-icon">
            <span>🚨</span>
          </div>
          <div class="stats-content">
            <h3 class="stats-title">Mes Signalements</h3>
            <p class="stats-value">{{ userStats.reports || 0 }}</p>
          </div>
        </div>
        
        <div class="stats-card">
          <div class="stats-icon message-icon">
            <span>✉️</span>
          </div>
          <div class="stats-content">
            <h3 class="stats-title">Messages</h3>
            <p class="stats-value">{{ userStats.messages || 0 }}</p>
            <span v-if="userStats.unreadMessages > 0" class="stats-badge">{{ userStats.unreadMessages }}</span>
          </div>
        </div>
        
        <div class="stats-card">
          <div class="stats-icon notification-icon">
            <span>🔔</span>
          </div>
          <div class="stats-content">
            <h3 class="stats-title">Notifications</h3>
            <p class="stats-value">{{ unreadCount }}</p>
          </div>
        </div>
      </div>

      <!-- Contenu principal -->
      <div class="main-content">
        <!-- Activités récentes -->
        <div class="content-card activities-card">
          <div class="card-header">
            <h2 class="section-title">Activités récentes</h2>
            <NuxtLink to="/activites" class="view-all-btn">Voir tout</NuxtLink>
          </div>
          
          <div class="activities-list">
            <div v-for="(activity, index) in recentActivities" :key="index" class="activity-item">
              <div class="activity-icon" :class="getActivityIconClass(activity.type)">
                <span>{{ getActivityIcon(activity.type) }}</span>
              </div>
              <div class="activity-details">
                <p class="activity-text">{{ activity.description }}</p>
                <span class="activity-time">{{ formatDate(activity.timestamp) }}</span>
              </div>
            </div>
            
            <div v-if="!recentActivities.length" class="empty-state">
              <span class="empty-icon">📅</span>
              <p>Aucune activité récente à afficher</p>
            </div>
          </div>
        </div>

        <!-- Signalements assignés -->
        <div class="content-card reports-card">
          <div class="card-header">
            <h2 class="section-title">Signalements assignés</h2>
            <NuxtLink to="/signalement" class="view-all-btn">Voir tout</NuxtLink>
          </div>
          
          <div class="reports-list">
            <div v-for="(report, index) in assignedReports" :key="index" class="report-item">
              <div class="report-status" :class="getStatusClass(report.status)"></div>
              <div class="report-details">
                <h3 class="report-title">{{ report.title }}</h3>
                <p class="report-description">{{ report.description }}</p>
                <div class="report-meta">
                  <span class="report-location">{{ report.location }}</span>
                  <span class="report-date">{{ formatDate(report.created_at) }}</span>
                </div>
              </div>
              <div class="report-actions">
                <button class="action-btn view-btn">Voir</button>
                <button class="action-btn update-btn" @click="handleReportUpdate(report.id, 'update')">Mettre à jour</button>
              </div>
            </div>
            
            <div v-if="!assignedReports.length" class="empty-state">
              <span class="empty-icon">📝</span>
              <p>Aucun signalement assigné</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth', 'verified'],
  layout: 'dashboard'
})

const { user, userFullName, isOfficial } = useUsers()
const { notifications, unreadCount, markAsRead, fetchNotifications } = useNotifications()
const { get } = useApi()

// Head configuration
useHead({
  title: 'Dashboard - CivActu'
})

// Récupération des données du dashboard
const { data: dashboardData } = await useLazyAsyncData('dashboard', () =>
  get('/api/v1/stats/dashboard'), {
  default: () => ({
    userStats: {
      opinions: 0,
      reports: 0,
      messages: 0,
      unreadMessages: 0
    },
    recentActivities: [],
    assignedReports: []
  })
})

const userStats = computed(() => dashboardData.value?.userStats || {})
const recentActivities = computed(() => dashboardData.value?.recentActivities || [])
const assignedReports = computed(() => dashboardData.value?.assignedReports || [])

// Fonctions utilitaires pour l'affichage
const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

const getActivityIcon = (type) => {
  const icons = {
    'opinion': '📝',
    'report': '🚨',
    'message': '✉️',
    'notification': '🔔',
    'comment': '💬',
    'follow': '👁️',
    'status': '🔄'
  };
  return icons[type] || '📌';
}

const getActivityIconClass = (type) => {
  const classes = {
    'opinion': 'opinion-activity',
    'report': 'report-activity',
    'message': 'message-activity',
    'notification': 'notification-activity',
    'comment': 'comment-activity',
    'follow': 'follow-activity',
    'status': 'status-activity'
  };
  return classes[type] || '';
}

const getStatusClass = (status) => {
  const classes = {
    'new': 'status-new',
    'in-progress': 'status-in-progress',
    'resolved': 'status-resolved',
    'closed': 'status-closed'
  };
  return classes[status] || 'status-new';
}

// Mise à jour des notifications en temps réel
onMounted(async () => {
  try {
    await fetchNotifications({ limit: 10, page: 0})
  } catch (error) {
    // Géré par le composable useApi
  }
})

const handleReportUpdate = async (reportId, update) => {
  try {
    await get(`/reports/${reportId}/update`, update)
    await refreshCookie('dashboard')
  } catch (error) {
    // Géré par le composable useApi
  }
}
</script>

<style scoped>
/* Styles généraux */
.dashboard-container {
  padding: 0;
}

/* Content area styles */
.dashboard-content {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.welcome-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.user-controls {
  display: flex;
  align-items: center;
}

.search-bar {
  position: relative;
  margin-right: 20px;
}

.search-bar input {
  padding: 10px 15px 10px 40px;
  border-radius: 20px;
  border: 1px solid #e0e0e0;
  width: 250px;
  font-size: 14px;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
}

.user-profile {
  display: flex;
  align-items: center;
}

.user-name {
  margin-left: 10px;
  font-weight: 500;
}

/* Stats cards */
.stats-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 25px;
}

.stats-card {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.stats-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-right: 15px;
}

.opinion-icon {
  background-color: rgba(0, 120, 212, 0.1);
  color: #0078d4;
}

.report-icon {
  background-color: rgba(255, 140, 0, 0.1);
  color: #ff8c00;
}

.message-icon {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.notification-icon {
  background-color: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
}

.stats-content {
  flex: 1;
}

.stats-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.stats-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.stats-badge {
  background-color: #ff4d4f;
  color: white;
  border-radius: 10px;
  padding: 2px 8px;
  font-size: 12px;
  position: absolute;
  top: 15px;
  right: 15px;
}

/* Main content */
.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.content-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.view-all-btn {
  color: #0078d4;
  font-size: 13px;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: none;
}

/* Activities list */
.activities-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.activity-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(0, 120, 212, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.opinion-activity {
  background-color: rgba(0, 120, 212, 0.1);
  color: #0078d4;
}

.report-activity {
  background-color: rgba(255, 140, 0, 0.1);
  color: #ff8c00;
}

.message-activity {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.notification-activity {
  background-color: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
}

.comment-activity {
  background-color: rgba(236, 72, 153, 0.1);
  color: #ec4899;
}

.follow-activity {
  background-color: rgba(14, 165, 233, 0.1);
  color: #0ea5e9;
}

.status-activity {
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.activity-details {
  flex: 1;
}

.activity-text {
  font-size: 14px;
  margin-bottom: 5px;
}

.activity-time {
  font-size: 12px;
  color: #999;
}

/* Reports list */
.reports-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.report-item {
  display: flex;
  padding: 15px;
  border-radius: 8px;
  background-color: #f9f9f9;
  position: relative;
}

.report-status {
  width: 4px;
  border-radius: 2px;
  margin-right: 15px;
}

.status-new {
  background-color: #0078d4;
}

.status-in-progress {
  background-color: #ff8c00;
}

.status-resolved {
  background-color: #10b981;
}

.status-closed {
  background-color: #6b7280;
}

.report-details {
  flex: 1;
}

.report-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 5px;
}

.report-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.report-meta {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #999;
}

.report-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: none;
}

.view-btn {
  background-color: rgba(0, 120, 212, 0.1);
  color: #0078d4;
}

.update-btn {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

/* Empty state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  color: #999;
}

.empty-icon {
  font-size: 32px;
  margin-bottom: 10px;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .main-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    flex-direction: column;
  }
  
  .dashboard-sidebar {
    width: 100%;
    padding: 10px 0;
  }
  
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .user-controls {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .search-bar {
    width: 100%;
    margin-right: 0;
  }
  
  .search-bar input {
    width: 100%;
  }
}
</style>
