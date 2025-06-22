<template>
  <div class="site-creator-view">
    <!-- Étape de sélection d'entreprise -->
    <div
      v-if="!selectedBusiness"
      class="business-selection"
    >
      <h1>Créateur de Site</h1>
      <p class="selection-intro">Sélectionnez une entreprise pour créer un site ou continuez sans entreprise</p>

      <div class="selection-form">
        <div class="form-group">
          <label for="business-select">Entreprise</label>
          <div class="select-wrapper">
            <select
              id="business-select"
              v-model="tempSelectedBusiness"
              class="business-select"
              @focus="loadEtablissements"
            >
              <option value="">-- Sélectionnez une entreprise ou laissez vide --</option>
              <option
                v-for="etablissement in etablissements"
                :key="etablissement.id"
                :value="etablissement"
              >
                {{ etablissement.name }}
              </option>
            </select>
            <div
              v-if="loading"
              class="loading-indicator"
            >
              <div class="spinner-small"></div>
            </div>
          </div>
        </div>

        <div
          class="selection-details"
          v-if="tempSelectedBusiness"
        >
          <h3>Détails de l'entreprise</h3>
          <div class="details-grid">
            <div class="detail-item">
              <span class="detail-label">Nom:</span>
              <span class="detail-value">{{ tempSelectedBusiness.name }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Adresse:</span>
              <span class="detail-value">{{ tempSelectedBusiness.address || 'Non disponible' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Téléphone:</span>
              <span class="detail-value">{{ tempSelectedBusiness.phone || 'Non disponible' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Email:</span>
              <span class="detail-value">{{ tempSelectedBusiness.email || 'Non disponible' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Site web:</span>
              <span class="detail-value">{{ tempSelectedBusiness.website || 'Non disponible' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">SIRET:</span>
              <span class="detail-value">{{ tempSelectedBusiness.siret || 'Non disponible' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">SIREN:</span>
              <span class="detail-value">{{ tempSelectedBusiness.siren || 'Non disponible' }}</span>
            </div>
          </div>
        </div>

        <div class="selection-actions">
          <button
            class="continue-btn"
            @click="continueToCreator"
          >
            Continuer <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Interface de création de site -->
    <div v-else>
      <div class="creator-header">
        <h1>Créateur de Site</h1>
        <div
          class="business-info"
          v-if="selectedBusiness.id"
        >
          <span class="business-badge">
            <i class="fas fa-building"></i> {{ selectedBusiness.name }}
          </span>

        </div>
        <div class="header-actions">
          <button
            class="action-btn prompt-btn"
            @click="showPromptModal = true"
            title="Liste des prompts"
          >
            <i class="fas fa-list-alt"></i>
            <span>Prompts</span>
          </button>
          <button
            class="action-btn back-btn"
            @click="goBack"
            title="Retour à la sélection"
          >
            <i class="fas fa-arrow-left"></i>
            <span>Changer d'entreprise</span>
          </button>
        </div>
      </div>

      <div class="creator-container">
        <div class="card">
          <!-- Iframe de DeepSite V2 -->
          <div class="iframe-container">
            <iframe
              src="https://enzostvs-deepsite.hf.space"
              title="DeepSite V2"
              allow="clipboard-read; clipboard-write"
              frameborder="0"
              width="100%"
              height="800px"
              ref="deepSiteIframe"
            ></iframe>
          </div>
        </div>
      </div>

      <!-- Modal pour les prompts -->
      <div
        v-if="showPromptModal"
        class="modal-overlay"
        @click.self="showPromptModal = false"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h3>Liste des Prompts</h3>
            <button
              class="close-btn"
              @click="showPromptModal = false"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="prompt-list">
              <div
                v-for="(prompt, index) in prompts"
                :key="index"
                class="prompt-item"
              >
                <h4>{{ prompt.title }}</h4>
                <p>{{ prompt.description }}</p>
                <div class="prompt-actions">
                  <button
                    class="copy-prompt-btn"
                    @click="copyPromptToClipboard(prompt)"
                  >
                    <i class="fas fa-copy"></i> Copier le prompt
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Notification de copie -->
      <div
        v-if="showCopyNotification"
        class="copy-notification"
      >
        Prompt copié dans le presse-papiers!
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useEtablissementStore } from "@/stores/etablissement";
import { ApiService } from "@/services/APIService";

// Services
const api = new ApiService("http://localhost:8000/api");
const etablissementStore = useEtablissementStore();

// État pour la sélection d'entreprise
const selectedBusiness = ref(null);
const tempSelectedBusiness = ref(null);
const etablissements = ref([]);
const loading = ref(false);

// État pour la modal des prompts
const showPromptModal = ref(false);
const deepSiteIframe = ref(null);

// Données de démonstration pour les prompts
const prompts = ref([
  {
    id: 1,
    title: "Site vitrine standard",
    description:
      "Crée un site vitrine professionnel avec accueil, services, à propos et contact.",
  },
  {
    id: 2,
    title: "Portfolio créatif",
    description:
      "Design moderne pour portfolio avec galerie de projets et témoignages.",
  },
  {
    id: 3,
    title: "Site e-commerce",
    description:
      "Structure complète pour boutique en ligne avec catalogue et panier.",
  },
]);

// Fonction pour charger les établissements
async function loadEtablissements() {
  if (etablissements.value.length === 0 && !loading.value) {
    loading.value = true;
    try {
      await etablissementStore.fetchEtablissements();
      etablissements.value = etablissementStore.etablissements;
    } catch (error) {
      console.error("Erreur lors de la récupération des entreprises:", error);
    } finally {
      loading.value = false;
    }
  }
}

// Fonction pour continuer vers le créateur de site
function continueToCreator() {
  selectedBusiness.value = tempSelectedBusiness.value || {
    id: null,
    name: "Site personnel",
  };
}

// Fonction pour revenir à la sélection d'entreprise
function goBack() {
  selectedBusiness.value = null;
  tempSelectedBusiness.value = null;
}

const showCopyNotification = ref(false);

// Fonction pour copier le prompt dans le presse-papiers
async function copyPromptToClipboard(prompt: any) {
  // Utiliser uniquement la description du prompt sans ajouter les informations de l'entreprise
  const promptText = prompt.description;

  try {
    // Copier le texte dans le presse-papiers
    await navigator.clipboard.writeText(promptText);

    // Afficher une notification
    showCopyNotification.value = true;
    setTimeout(() => {
      showCopyNotification.value = false;
    }, 2000);

    console.log("Prompt copié dans le presse-papiers");
  } catch (error) {
    console.error("Erreur lors de la copie dans le presse-papiers:", error);
  }
}
</script>

<style scoped>
.site-creator-view {
  width: 100%;
  padding: 20px;
  background: #fff;
}

/* Styles pour la sélection d'entreprise */
.business-selection {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.selection-intro {
  margin-bottom: 24px;
  color: #4b5563;
}

.selection-form {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
}

.select-wrapper {
  position: relative;
}

.business-select {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 16px;
}

.loading-indicator {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(79, 70, 229, 0.2);
  border-radius: 50%;
  border-top-color: #4f46e5;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.selection-details {
  margin-top: 24px;
  padding: 16px;
  background-color: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.selection-details h3 {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 600;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
}

.detail-label {
  font-weight: 500;
  color: #6b7280;
  font-size: 14px;
}

.detail-value {
  font-size: 16px;
  color: #111827;
}

.selection-actions {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

.continue-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.continue-btn:hover {
  background-color: #4338ca;
}

/* Styles pour l'interface de création */
.creator-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.creator-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.business-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 16px;
  flex-grow: 1;
}

.business-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background-color: #f3f4f6;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 500;
  color: #4b5563;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  background-color: #f3f4f6;
  color: #4b5563;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background-color: #e5e7eb;
  color: #111827;
}

.prompt-btn {
  background-color: #4f46e5;
  color: white;
}

.prompt-btn:hover {
  background-color: #4338ca;
}

.back-btn {
  background-color: #f3f4f6;
  color: #4b5563;
}

.back-btn:hover {
  background-color: #e5e7eb;
}

.creator-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 0;
  overflow: hidden;
}

.iframe-container {
  width: 100%;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #6b7280;
}

.modal-body {
  padding: 20px;
}

.prompt-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.prompt-item {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background-color: #f9fafb;
}

.prompt-item h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
}

.prompt-item p {
  margin: 0 0 12px 0;
  color: #4b5563;
  font-size: 14px;
}

.prompt-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.copy-prompt-btn {
  background-color: #f3f4f6;
  color: #4b5563;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.copy-prompt-btn:hover {
  background-color: #e5e7eb;
}

.copy-notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #10b981;
  color: white;
  padding: 12px 20px;
  border-radius: 6px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: fadeIn 0.3s, fadeOut 0.3s 1.7s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(10px);
  }
}

/* Styles pour la grille de détails */
.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
}

.detail-label {
  font-weight: 500;
  color: #6b7280;
  font-size: 14px;
}

.detail-value {
  font-size: 16px;
  color: #111827;
}
</style>
























