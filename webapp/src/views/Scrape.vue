<template>
  <div class="businesses-view">
    <div class="page-header">
      <h1>Scrapes</h1>
      <button
        class="new-scrape-btn"
        @click="showAddModal = true"
      >
        <i class="fas fa-plus"></i> Ajouter un scrape
      </button>
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
      class="businesses-container"
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
      </div>

      <ScrapeTable
        :scrapes="paginatedScrapes"
        :selectedIds="selectedScrapes"
        @delete="openDeleteModal"
        @toggle-select="toggleSelect"
        @delete-multiple="showDeleteMultipleModal = true"
        @clear-selection="selectedScrapes = []"
        @select-all="selectAll"
        @deselect-all="deselectAll"
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
      :isVisible="showDeleteModal"
      @close="showDeleteModal = false"
      @confirm="handleDelete"
    >
      <p>Voulez-vous supprimer ce scrape ?</p>
    </DeleteModal>

    <!-- Delete Multiple Modal -->
    <DeleteModal
      :isVisible="showDeleteMultipleModal"
      @close="showDeleteMultipleModal = false"
      @confirm="handleDeleteMultiple"
    >
      <p>Voulez-vous supprimer les {{ selectedScrapes.length }} scrapes sélectionnés ?</p>
    </DeleteModal>

    <!-- Add Modal -->
    <BaseModal
      :isVisible="showAddModal"
      @close="showAddModal = false"
    >
      <template #header>
        <h3>Ajouter un nouveau scrape</h3>
      </template>
      <template #body>
        <div class="form-group">
          <label for="name">Nom</label>
          <input
            type="text"
            id="name"
            v-model="newScrape.name"
            placeholder="Nom du scrape"
          />
        </div>
        <div class="form-group">
          <label for="keyword">Mot-clé</label>
          <input
            type="text"
            id="keyword"
            v-model="newScrape.keyword"
            placeholder="Mot-clé à rechercher"
          />
        </div>
        <div class="form-group">
          <label for="city">Ville</label>
          <input
            type="text"
            id="city"
            v-model="newScrape.city"
            placeholder="Ville à rechercher"
          />
        </div>
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
import ScrapeTable from "@/components/Scrape/ScrapeTable.vue";
import DeleteModal from "@/components/modal/DeleteModal.vue";
import BaseModal from "@/components/modal/BaseModal.vue";
import { ApiService } from "@/services/APIService";

const api = new ApiService("http://localhost:4173/api");
const scrapeStore = useScrapeStore();
const loading = ref(false);
const showDeleteModal = ref(false);
const showDeleteMultipleModal = ref(false);
const showAddModal = ref(false);
const scrapeToDelete = ref<string | null>(null);
const selectedScrapes = ref<string[]>([]);
const newScrape = ref({
  name: "",
  keyword: "",
  city: "",
});

// Pagination state
const currentPage = ref(1);
const pageSize = ref(10);

// Computed properties for pagination
const totalPages = computed(() => {
  return Math.ceil(scrapeStore.scrapes.length / pageSize.value) || 1;
});

const paginatedScrapes = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return scrapeStore.scrapes.slice(start, end);
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

async function handleDelete() {
  if (scrapeToDelete.value) {
    await scrapeStore.deleteScrape(scrapeToDelete.value);
    scrapeToDelete.value = null;
  }
  showDeleteModal.value = false;
}

async function handleDeleteMultiple() {
  loading.value = true;
  try {
    for (const id of selectedScrapes.value) {
      await scrapeStore.deleteScrape(id);
    }
    selectedScrapes.value = [];
  } catch (error) {
    console.error("Erreur lors de la suppression multiple:", error);
  } finally {
    loading.value = false;
    showDeleteMultipleModal.value = false;
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

function selectAll(ids: string[]) {
  // Ajouter tous les IDs qui ne sont pas déjà sélectionnés
  ids.forEach((id) => {
    if (!selectedScrapes.value.includes(id)) {
      selectedScrapes.value.push(id);
    }
  });
}

function deselectAll(ids: string[]) {
  // Filtrer les IDs à désélectionner
  selectedScrapes.value = selectedScrapes.value.filter(
    (id) => !ids.includes(id)
  );
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
.businesses-view {
  width: 100%;
  padding: 20px 30px;
}

.table-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
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

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
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

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

.cancel-btn {
  background-color: #9ca3af;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  margin-right: 10px;
  cursor: pointer;
}

.submit-btn {
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #4338ca;
}

.businesses-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
  padding: 0;
  margin: 0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #4f46e5;
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
</style>

