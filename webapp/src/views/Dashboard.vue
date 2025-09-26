<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Dashboard CRM</h1>
      <div class="welcome-text">
        Bienvenue ! Voici un aperçu de votre activité commerciale
      </div>
      <div></div>
    </div>

    <!-- Métriques Clés -->
    <div class="stats-grid">
      <div class="stats-card">
        <div class="stats-content">
          <div class="stats-header">
            <h3>Total Entreprises</h3>
            <div class="stats-icon companies-icon">
              <i class="fas fa-building"></i>
            </div>
          </div>
          <div class="stats-value">{{ dashboardStats.totalCompanies }}</div>
          <div class="stats-trend up">
            <i class="fas fa-arrow-up"></i>
            <span>+{{ dashboardStats.newCompaniesThisWeek }} cette semaine</span>
          </div>
        </div>
      </div>

      <div class="stats-card">
        <div class="stats-content">
          <div class="stats-header">
            <h3>Prospects Actifs</h3>
            <div class="stats-icon prospects-icon">
              <i class="fas fa-user-clock"></i>
            </div>
          </div>
          <div class="stats-value">{{ dashboardStats.activeProspects }}</div>
          <div class="stats-trend up">
            <i class="fas fa-arrow-up"></i>
            <span>{{ dashboardStats.conversionRate }}% taux conversion</span>
          </div>
        </div>
      </div>

      <div class="stats-card">
        <div class="stats-content">
          <div class="stats-header">
            <h3>Sites Générés</h3>
            <div class="stats-icon sites-icon">
              <i class="fas fa-globe"></i>
            </div>
          </div>
          <div class="stats-value">{{ dashboardStats.sitesCreated }}</div>
          <div class="stats-trend up">
            <i class="fas fa-arrow-up"></i>
            <span>+{{ dashboardStats.sitesThisMonth }} ce mois</span>
          </div>
        </div>
      </div>

      <div class="stats-card">
        <div class="stats-content">
          <div class="stats-header">
            <h3>Emails Envoyés</h3>
            <div class="stats-icon emails-icon">
              <i class="fas fa-envelope"></i>
            </div>
          </div>
          <div class="stats-value">{{ dashboardStats.emailsSent }}</div>
          <div class="stats-trend up">
            <i class="fas fa-arrow-up"></i>
            <span>{{ dashboardStats.emailOpenRate }}% taux ouverture</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Graphiques et Activité -->
    <div class="charts-section">
      <!-- Répartition par Statut -->
      <div class="chart-card">
        <div class="card-header">
          <h2>Répartition par Statut</h2>
        </div>
        <div class="status-chart">
          <div
            class="status-item"
            v-for="status in statusDistribution"
            :key="status.name"
          >
            <div class="status-bar">
              <div
                class="status-fill"
                :class="status.class"
                :style="{ width: status.percentage + '%' }"
              ></div>
            </div>
            <div class="status-info">
              <span class="status-name">{{ status.name }}</span>
              <span class="status-count">{{ status.count }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Activité Récente -->
      <div class="activity-card">
        <div class="card-header">
          <h2>Activité Récente</h2>
        </div>
        <div class="activity-list">
          <div
            class="activity-item"
            v-for="activity in recentActivities"
            :key="activity.id"
          >
            <div
              class="activity-icon"
              :class="activity.iconClass"
            >
              <i :class="activity.icon"></i>
            </div>
            <div class="activity-content">
              <h4>{{ activity.title }}</h4>
              <p>{{ activity.description }}</p>
              <span class="activity-time">{{ activity.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions Rapides -->
    <div class="quick-actions">
      <h2>Actions Rapides</h2>
      <div class="actions-grid">
        <router-link
          to="/scrape"
          class="action-card"
        >
          <i class="fas fa-search"></i>
          <span>Nouveau Scrape</span>
        </router-link>
        <router-link
          to="/entreprises"
          class="action-card"
        >
          <i class="fas fa-plus"></i>
          <span>Ajouter Entreprise</span>
        </router-link>
        <router-link
          to="/email"
          class="action-card"
        >
          <i class="fas fa-envelope-bulk"></i>
          <span>Email de Masse</span>
        </router-link>
        <router-link
          to="/site-creator"
          class="action-card"
        >
          <i class="fas fa-code"></i>
          <span>Créer un Site</span>
        </router-link>
      </div>
    </div>

    <!-- Entreprises à Traiter -->
    <div class="priority-section">
      <div class="priority-card">
        <div class="card-header">
          <h2>Prospects Chauds</h2>
          <span class="priority-badge hot">{{ hotProspects.length }}</span>
        </div>
        <div class="company-list">
          <div
            class="company-item"
            v-for="company in hotProspects"
            :key="company.id"
          >
            <div class="company-info">
              <h4>{{ company.name }}</h4>
              <p>{{ company.address }}</p>
            </div>
            <div class="company-actions">
              <button class="action-btn contact-btn">
                <i class="fas fa-phone"></i>
              </button>
              <button class="action-btn email-btn">
                <i class="fas fa-envelope"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="priority-card">
        <div class="card-header">
          <h2>Relances à Faire</h2>
          <span class="priority-badge warning">{{ followUps.length }}</span>
        </div>
        <div class="company-list">
          <div
            class="company-item"
            v-for="company in followUps"
            :key="company.id"
          >
            <div class="company-info">
              <h4>{{ company.name }}</h4>
              <p>Dernière interaction : {{ company.lastContact }}</p>
            </div>
            <div class="company-actions">
              <button class="action-btn contact-btn">
                <i class="fas fa-phone"></i>
              </button>
              <button class="action-btn email-btn">
                <i class="fas fa-envelope"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scrapes Récents (vraies données) -->
    <div class="recent-scrapes-section">
      <div class="card-header">
        <h2>Scrapes Récents</h2>
        <router-link
          to="/scrapes"
          class="view-all"
        >Voir Tout</router-link>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Mot-clé</th>
            <th>Ville</th>
            <th>Statut</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="scrape in recentScrapes"
            :key="scrape.id"
          >
            <td>{{ scrape.name }}</td>
            <td>{{ scrape.keyword }}</td>
            <td>{{ scrape.city }}</td>
            <td>
              <span
                class="status"
                :class="getStatusClass(scrape.progress)"
              >
                {{ getStatusText(scrape.progress) }}
              </span>
            </td>
            <td>{{ formatDate(scrape.createdAt) }}</td>
            <td class="actions">
              <router-link
                :to="`/scrapes/view/${scrape.id}`"
                class="action-btn"
              >
                <i class="fas fa-eye"></i>
              </router-link>
              <button
                class="action-btn delete-btn"
                @click="deleteScrape(scrape.id)"
              >
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useScrapeStore } from "@/stores/scrape";
import { useEtablissementStore } from "@/stores/etablissement";
import { ApiService } from "@/services/APIService";

const api = new ApiService("http://localhost:8000/api");
const scrapeStore = useScrapeStore();
const etablissementStore = useEtablissementStore();

// État
const isLoading = ref(true);
const recentScrapes = ref([]);

// Fausses données pour le visuel
const dashboardStats = ref({
  totalCompanies: 1247,
  newCompaniesThisWeek: 23,
  activeProspects: 342,
  conversionRate: 18,
  sitesCreated: 89,
  sitesThisMonth: 12,
  emailsSent: 2456,
  emailOpenRate: 24,
});

const statusDistribution = ref([
  { name: "Prospects", count: 342, percentage: 45, class: "prospect" },
  { name: "Contactés", count: 189, percentage: 25, class: "contacted" },
  { name: "Négociation", count: 76, percentage: 10, class: "negotiation" },
  { name: "Clients", count: 234, percentage: 15, class: "client" },
  { name: "Inactifs", count: 38, percentage: 5, class: "inactive" },
]);

const recentActivities = ref([
  {
    id: 1,
    title: "Nouveau scrape terminé",
    description: 'Scrape "Restaurants Paris" - 45 entreprises trouvées',
    time: "Il y a 2h",
    icon: "fas fa-search",
    iconClass: "scrape-icon",
  },
  {
    id: 2,
    title: "Email envoyé",
    description: 'Campagne "Offre spéciale" envoyée à 156 prospects',
    time: "Il y a 4h",
    icon: "fas fa-envelope",
    iconClass: "email-icon",
  },
  {
    id: 3,
    title: "Nouveau client",
    description: 'TechSolutions est passé en statut "Client"',
    time: "Il y a 6h",
    icon: "fas fa-user-check",
    iconClass: "client-icon",
  },
  {
    id: 4,
    title: "Site créé",
    description: "Site web généré pour GlobalTech",
    time: "Hier",
    icon: "fas fa-globe",
    iconClass: "site-icon",
  },
]);

const hotProspects = ref([
  { id: 1, name: "TechInnovate", address: "Paris 8ème" },
  { id: 2, name: "DigitalCorp", address: "Lyon 3ème" },
  { id: 3, name: "WebSolutions", address: "Marseille 2ème" },
]);

const followUps = ref([
  { id: 1, name: "GlobalTech", lastContact: "Il y a 5 jours" },
  { id: 2, name: "InnovateLab", lastContact: "Il y a 1 semaine" },
  { id: 3, name: "StartupXYZ", lastContact: "Il y a 10 jours" },
]);

// Méthodes
const fetchDashboardData = async () => {
  try {
    isLoading.value = true;

    // Récupérer les vrais scrapes
    const scrapesResponse = await api.get("/scrape");
    recentScrapes.value = scrapesResponse.data.slice(0, 5);

    // TODO: Récupérer les vraies entreprises quand l'API sera prête
    // const companiesResponse = await api.get("/etablissements");

    isLoading.value = false;
  } catch (error) {
    console.error("Erreur lors du chargement des données:", error);
    isLoading.value = false;
  }
};

const getStatusClass = (progress: string) => {
  switch (progress) {
    case "in progress":
      return "in-progress";
    case "success":
      return "completed";
    case "failed":
      return "failed";
    default:
      return "pending";
  }
};

const getStatusText = (progress: string) => {
  switch (progress) {
    case "in progress":
      return "En cours";
    case "success":
      return "Terminé";
    case "failed":
      return "Échoué";
    default:
      return "En attente";
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("fr-FR");
};

const deleteScrape = async (id: number) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce scrape ?")) {
    try {
      await axios.delete(`/api/scrapes/${id}`);
      await fetchDashboardData();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  }
};

// Lifecycle
onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped>
.dashboard {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.dashboard-header h1 {
  margin: 0;
  color: #1f2937;
  font-size: 28px;
}

.welcome-text {
  color: #6b7280;
  font-size: 16px;
  margin: 8px 0;
}

.new-scrape-btn {
  background-color: #4f46e5;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.new-scrape-btn:hover {
  background-color: #4338ca;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stats-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.stats-header h3 {
  font-size: 16px;
  font-weight: 500;
  color: #6b7280;
  margin: 0;
}

.stats-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.companies-icon {
  background-color: #e0e7ff;
  color: #4f46e5;
}

.prospects-icon {
  background-color: #dcfce7;
  color: #10b981;
}

.sites-icon {
  background-color: #dbeafe;
  color: #3b82f6;
}

.emails-icon {
  background-color: #fef3c7;
  color: #f59e0b;
}

.stats-value {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1f2937;
}

.stats-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #10b981;
}

/* Charts Section */
.charts-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.chart-card,
.activity-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h2 {
  margin: 0;
  font-size: 20px;
  color: #1f2937;
}

/* Status Chart */
.status-chart {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-bar {
  flex: 1;
  height: 8px;
  background-color: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
}

.status-fill {
  height: 100%;
  border-radius: 4px;
}

.status-fill.prospect {
  background-color: #3b82f6;
}
.status-fill.contacted {
  background-color: #10b981;
}
.status-fill.negotiation {
  background-color: #f59e0b;
}
.status-fill.client {
  background-color: #8b5cf6;
}
.status-fill.inactive {
  background-color: #6b7280;
}

.status-info {
  display: flex;
  flex-direction: column;
  min-width: 80px;
}

.status-name {
  font-size: 14px;
  color: #6b7280;
}

.status-count {
  font-weight: 600;
  color: #1f2937;
}

/* Activity List */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  gap: 12px;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.scrape-icon {
  background-color: #e0e7ff;
  color: #4f46e5;
}
.email-icon {
  background-color: #fef3c7;
  color: #f59e0b;
}
.client-icon {
  background-color: #dcfce7;
  color: #10b981;
}
.site-icon {
  background-color: #dbeafe;
  color: #3b82f6;
}

.activity-content h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #1f2937;
}

.activity-content p {
  margin: 0 0 4px 0;
  font-size: 13px;
  color: #6b7280;
}

.activity-time {
  font-size: 12px;
  color: #9ca3af;
}

/* Quick Actions */
.quick-actions {
  margin-bottom: 30px;
}

.quick-actions h2 {
  margin-bottom: 16px;
  color: #1f2937;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.action-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.action-card:hover {
  border-color: #4f46e5;
  color: #4f46e5;
  transform: translateY(-2px);
}

.action-card i {
  font-size: 24px;
}

/* Priority Section */
.priority-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.priority-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.priority-badge {
  background-color: #ef4444;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.priority-badge.hot {
  background-color: #ef4444;
}

.priority-badge.warning {
  background-color: #f59e0b;
}

.company-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.company-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: #f9fafb;
  border-radius: 8px;
}

.company-info h4 {
  margin: 0 0 4px 0;
  color: #1f2937;
}

.company-info p {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
}

.company-actions {
  display: flex;
  gap: 8px;
}

.contact-btn {
  background-color: #10b981;
  color: white;
}

.email-btn {
  background-color: #3b82f6;
  color: white;
}

/* Recent Scrapes */
.recent-scrapes-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
}

.data-table th {
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 500;
  color: #6b7280;
}

.data-table td {
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.status {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status.in-progress {
  background-color: #dbeafe;
  color: #3b82f6;
}

.status.completed {
  background-color: #d1fae5;
  color: #059669;
}

.status.failed {
  background-color: #fee2e2;
  color: #ef4444;
}

.actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: none;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 6px 8px;
  cursor: pointer;
  color: #6b7280;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background-color: #f3f4f6;
}

.delete-btn:hover {
  background-color: #fee2e2;
  border-color: #ef4444;
  color: #ef4444;
}

.view-all {
  color: #4f46e5;
  text-decoration: none;
  font-size: 14px;
}

.view-all:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 1200px) {
  .charts-section,
  .priority-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
