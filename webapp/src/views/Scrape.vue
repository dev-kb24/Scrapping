<template>
  <div class="scrapes-view">
    <div class="page-header">
      <h1>Scrapes</h1>
      <div class="header-actions">
        <button
          v-if="selectionMode && selectedScrapes.length > 0"
          class="delete-selected-btn"
          @click="openDeleteMultipleModal"
        >
          <i class="fas fa-trash"></i> Supprimer ({{ selectedScrapes.length }})
        </button>
        <button
          class="new-scrape-btn"
          @click="showAddModal = true"
        >
          <i class="fas fa-plus"></i> Ajouter un scrape
        </button>
      </div>
    </div>

    <div
      v-if="loading"
      class="loading-container"
    >
      <div class="spinner"></div>
      <p>Chargement des scrapes...</p>
    </div>

    <div
      v-else
      class="scrapes-container"
    >
      <!-- Quantity selector -->
      <div class="table-controls">
        <div class="quantity-selector">
          <label for="pageSize">Afficher :</label>
          <select
            id="pageSize"
            v-model="pageSize"
            @change="currentPage = 1"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span>éléments par page</span>
        </div>
        <div class="table-actions">
          <button
            class="selection-mode-btn"
            :class="{ active: selectionMode }"
            @click="toggleSelectionMode"
            title="Mode sélection"
          >
            <i class="fas fa-check-square"></i>
          </button>
        </div>
      </div>

      <!-- Utilisation du composant ScrapeTable avec les nouvelles props -->
      <ScrapeTable
        :scrapes="paginatedScrapes"
        :selection-mode="selectionMode"
        :selected-items="selectedScrapes"
        :all-selected="isAllSelected"
        @delete="openDeleteModal"
        @toggle-select="toggleSelect"
        @toggle-all="toggleSelectAll"
      />

      <!-- Pagination controls -->
      <div class="pagination">
        <button
          class="btn-pagination"
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
        >
          <i class="fas fa-chevron-left"></i>
        </button>

        <span class="page-info">
          Page {{ currentPage }} sur {{ totalPages }} ({{ scrapeStore.scrapes.length }} éléments au total)
        </span>

        <button
          class="btn-pagination"
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- Delete Modal -->
    <DeleteModal
      v-if="showDeleteModal"
      :isVisible="showDeleteModal"
      title="Supprimer le scrape"
      @close="showDeleteModal = false"
      @confirm="handleDelete"
    >
      <p>Êtes-vous sûr de vouloir supprimer ce scrape ? Cette action est irréversible.</p>
    </DeleteModal>

    <!-- Delete Multiple Modal -->
    <DeleteModal
      v-if="showDeleteMultipleModal"
      :isVisible="showDeleteMultipleModal"
      title="Supprimer les scrapes sélectionnés"
      @close="showDeleteMultipleModal = false"
      @confirm="handleDeleteMultiple"
    >
      <p>Êtes-vous sûr de vouloir supprimer les {{ selectedScrapes.length }} scrapes sélectionnés ? Cette action est irréversible.</p>
    </DeleteModal>

    <!-- Add Modal -->
    <BaseModal
      v-if="showAddModal"
      :isVisible="showAddModal"
      title="Ajouter un scrape"
      @close="showAddModal = false"
    >
      <template #body>
        <form @submit.prevent="handleAddScrape">
          <div class="form-group">
            <label for="name">Nom:</label>
            <input
              type="text"
              v-model="newScrape.name"
              id="name"
              required
            />
          </div>
          <div class="form-group">
            <label for="keyword">Mot-clé:</label>
            <input
              type="text"
              v-model="newScrape.keyword"
              id="keyword"
              required
            />
          </div>
          <div class="form-group">
            <label for="city">Ville:</label>
            <input
              type="text"
              v-model="newScrape.city"
              id="city"
              required
            />
          </div>
        </form>
      </template>
      <template #footer>
        <button
          class="cancel-btn"
          @click="showAddModal = false"
        >Annuler</button>
        <button
          class="submit-btn"
          @click="handleAddScrape"
        >Lancer le scrape</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useScrapeStore } from "@/stores/scrape";
import DeleteModal from "@/components/modal/DeleteModal.vue";
import BaseModal from "@/components/modal/BaseModal.vue";
import ScrapeTable from "@/components/Scrape/ScrapeTable.vue";
import { ApiService } from "@/services/APIService";

const api = new ApiService("http://localhost:8000/api");
const scrapeStore = useScrapeStore();
const loading = ref(false);
const showDeleteModal = ref(false);
const showAddModal = ref(false);
const showDeleteMultipleModal = ref(false);
const scrapeToDelete = ref<string | null>(null);
const newScrape = ref({
  name: "",
  keyword: "",
  city: "",
});

// Pagination state
const currentPage = ref(1);
const pageSize = ref(10);

// Selection mode
const selectionMode = ref(false);
const selectedScrapes = ref<string[]>([]);

// Computed properties for pagination
const totalPages = computed(() => {
  return Math.ceil(scrapeStore.scrapes.length / pageSize.value) || 1;
});

const paginatedScrapes = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return scrapeStore.scrapes.slice(start, end);
});

const isAllSelected = computed(() => {
  return (
    paginatedScrapes.value.length > 0 &&
    paginatedScrapes.value.every((scrape) =>
      selectedScrapes.value.includes(scrape.id)
    )
  );
});

onMounted(async () => {
  loading.value = true;
  await scrapeStore.fetchScrapes();
  loading.value = false;
});

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
}

function openDeleteModal(id: string) {
  scrapeToDelete.value = id;
  showDeleteModal.value = true;
}

function openDeleteMultipleModal() {
  if (selectedScrapes.value.length > 0) {
    showDeleteMultipleModal.value = true;
  }
}

function toggleSelectionMode() {
  selectionMode.value = !selectionMode.value;
  if (!selectionMode.value) {
    selectedScrapes.value = [];
  }
}

function toggleSelect(id: string) {
  const index = selectedScrapes.value.indexOf(id);
  if (index === -1) {
    selectedScrapes.value.push(id);
  } else {
    selectedScrapes.value.splice(index, 1);
  }
}

function toggleSelectAll() {
  if (isAllSelected.value) {
    selectedScrapes.value = selectedScrapes.value.filter(
      (id) => !paginatedScrapes.value.some((scrape) => scrape.id === id)
    );
  } else {
    paginatedScrapes.value.forEach((scrape) => {
      if (!selectedScrapes.value.includes(scrape.id)) {
        selectedScrapes.value.push(scrape.id);
      }
    });
  }
}

async function handleDelete() {
  if (scrapeToDelete.value) {
    try {
      await api.delete(`/scrape/${scrapeToDelete.value}`);
      // Mettre à jour le store après la suppression
      await scrapeStore.fetchScrapes();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  }
  showDeleteModal.value = false;
  scrapeToDelete.value = null;
}

async function handleDeleteMultiple() {
  loading.value = true;
  try {
    // Utiliser directement l'ApiService pour chaque suppression
    for (const id of selectedScrapes.value) {
      await api.delete(`/scrape/${id}`);
    }
    // Rafraîchir la liste après les suppressions
    await scrapeStore.fetchScrapes();
    selectedScrapes.value = [];
  } catch (error) {
    console.error("Erreur lors de la suppression multiple:", error);
  } finally {
    loading.value = false;
    showDeleteMultipleModal.value = false;
    selectedScrapes.value = null;
  }
}

async function handleAddScrape() {
  try {
    // Fermer le modal immédiatement
    showAddModal.value = false;

    // Lancer le batch en arrière-plan
    api
      .post("/batch", newScrape.value)
      .then(() => {
        // Rafraîchir la liste des scrapes après un court délai
        setTimeout(() => {
          scrapeStore.fetchScrapes();
        }, 1000);
      })
      .catch((error) => {
        console.error("Erreur lors du lancement du scrape:", error);
      });

    // Réinitialiser le formulaire
    resetForm();
  } catch (error) {
    console.error("Erreur lors du lancement du scrape:", error);
  }
}

function resetForm() {
  newScrape.value = {
    name: "",
    keyword: "",
    city: "",
  };
}
</script>

<style scoped>
.scrapes-view {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.new-scrape-btn {
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.new-scrape-btn i {
  margin-right: 8px;
}

.new-scrape-btn:hover {
  background-color: #4338ca;
}

.delete-selected-btn {
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.delete-selected-btn i {
  margin-right: 8px;
}

.delete-selected-btn:hover {
  background-color: #dc2626;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.scrapes-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
}

.table-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.table-actions {
  display: flex;
  gap: 8px;
}

.selection-mode-btn {
  background-color: #f3f4f6;
  color: #6b7280;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.selection-mode-btn.active {
  background-color: #4f46e5;
  color: white;
  border-color: #4f46e5;
}

.selection-mode-btn:hover:not(.active) {
  background-color: #e5e7eb;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #1f2937;
  font-weight: 500;
}

.quantity-selector label {
  font-weight: 600;
  color: #374151;
}

.quantity-selector select {
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  color: #1f2937;
  cursor: pointer;
  font-weight: 500;
}

.quantity-selector select:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
}

.quantity-selector span {
  color: #374151;
  font-weight: 500;
}

/* Nouveau conteneur pour positionner correctement le tableau et l'overlay */
.table-container {
  position: relative;
  width: 100%;
}

.selection-overlay,
.selection-header,
.selection-item,
.table-container {
  /* Ces styles ne sont plus nécessaires */
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  gap: 16px;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.btn-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background-color: white;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-pagination:hover:not(:disabled) {
  background-color: #f9fafb;
  border-color: #9ca3af;
}

.btn-pagination:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #4b5563;
  font-weight: 500;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #374151;
}

.form-group input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
}

.cancel-btn {
  background-color: #9ca3af;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  margin-right: 10px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-btn:hover {
  background-color: #6b7280;
}

.submit-btn {
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover {
  background-color: #4338ca;
}

.selection-column {
  width: 48px;
  text-align: center;
  padding: 0;
}

.select-all-checkbox,
.select-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}
</style>

