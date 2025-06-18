<template>
  <div class="businesses-view">
    <div class="page-header">
      <h1>Entreprises</h1>
      <div class="header-actions">
        <button
          v-if="selectionMode && selectedEtablissements.length > 0"
          class="delete-selected-btn"
          @click="openDeleteMultipleModal"
        >
          <i class="fas fa-trash"></i> Supprimer ({{ selectedEtablissements.length }})
        </button>
        <button
          class="new-etablissement-btn"
          @click="showAddModal = true"
        >
          <i class="fas fa-plus"></i> Ajouter
        </button>
      </div>
    </div>

    <div
      v-if="loading"
      class="loading-container"
    >
      <div class="spinner"></div>
      <p>Chargement des entreprises...</p>
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

      <BusinessTable
        :etablissements="paginatedEtablissements"
        :selection-mode="selectionMode"
        :selected-items="selectedEtablissements"
        :all-selected="isAllSelected"
        @loading="loading = $event"
        @delete="openDeleteModal($event)"
        @email="goToEmailPage"
        @toggle-select="toggleSelect"
        @toggle-all="toggleSelectAll"
      />

      <div class="pagination">
        <button
          class="btn-pagination"
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
        >
          <i class="fas fa-chevron-left"></i>
        </button>

        <span class="page-info">
          Page {{ currentPage }} sur {{ totalPages }} ({{ etablissementStore.etablissements.length }} éléments au total)
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
      title="Supprimer l'entreprise"
      @close="showDeleteModal = false"
      @confirm="handleDelete"
    >
      <p>Êtes-vous sûr de vouloir supprimer {{ etablissementToDelete?.name || 'cette entreprise' }} ? Cette action est irréversible.</p>
    </DeleteModal>

    <!-- Delete Multiple Modal -->
    <DeleteModal
      v-if="showDeleteMultipleModal"
      :isVisible="showDeleteMultipleModal"
      title="Supprimer les entreprises sélectionnées"
      @close="showDeleteMultipleModal = false"
      @confirm="handleDeleteMultiple"
    >
      <p>Êtes-vous sûr de vouloir supprimer les {{ selectedEtablissements.length }} entreprises sélectionnées ? Cette action est irréversible.</p>
    </DeleteModal>

    <!-- Add Modal -->
    <BaseModal
      v-if="showAddModal"
      :isVisible="showAddModal"
      title="Ajouter une entreprise"
      @close="showAddModal = false"
    >
      <template #body>
        <form @submit.prevent="handleAddEtablissement">
          <div class="form-group">
            <label for="name">Nom:</label>
            <input
              type="text"
              v-model="newEtablissement.name"
              id="name"
              required
            />
          </div>
          <div class="form-group">
            <label for="address">Adresse:</label>
            <input
              type="text"
              v-model="newEtablissement.address"
              id="address"
              required
            />
          </div>
          <div class="form-group">
            <label for="phone">Téléphone:</label>
            <input
              type="text"
              v-model="newEtablissement.phone"
              id="phone"
            />
          </div>
          <div class="form-group">
            <label for="website">Site web:</label>
            <input
              type="url"
              v-model="newEtablissement.website"
              id="website"
            />
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input
              type="email"
              v-model="newEtablissement.email"
              id="email"
            />
          </div>
          <div class="form-group">
            <label for="siret">SIRET:</label>
            <input
              type="text"
              v-model="newEtablissement.siret"
              id="siret"
            />
          </div>
          <div class="form-group">
            <label for="siren">SIREN:</label>
            <input
              type="text"
              v-model="newEtablissement.siren"
              id="siren"
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
          @click="handleAddEtablissement"
        >Ajouter</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useEtablissementStore } from "@/stores/etablissement";
import BusinessTable from "@/components/business/BusinessTable.vue";
import DeleteModal from "@/components/modal/DeleteModal.vue";
import BaseModal from "@/components/modal/BaseModal.vue";
import { Etablissement } from "@/models/Etablissement";
import router from "@/router";
import { ApiService } from "@/services/APIService";

// Services
const api = new ApiService("http://localhost:4173/api");

// Variables d'état
const etablissementStore = useEtablissementStore();
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const etablissementToDelete = ref<Etablissement>();
const showDeleteModal = ref(false);
const showAddModal = ref(false);
const showDeleteMultipleModal = ref(false);
const newEtablissement = ref({
  name: "",
  address: "",
  phone: "",
  website: "",
  email: "",
  siret: "",
  siren: "",
});

// Selection mode
const selectionMode = ref(false);
const selectedEtablissements = ref<string[]>([]);

// Computed properties
const totalPages = computed(() => {
  return (
    Math.ceil(etablissementStore.etablissements.length / pageSize.value) || 1
  );
});

const paginatedEtablissements = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return etablissementStore.etablissements.slice(start, end);
});

const isAllSelected = computed(() => {
  return (
    paginatedEtablissements.value.length > 0 &&
    paginatedEtablissements.value.every((etablissement) =>
      selectedEtablissements.value.includes(etablissement.id)
    )
  );
});

onMounted(async () => {
  loading.value = true;
  try {
    await etablissementStore.fetchEtablissements();
  } catch (error) {
    console.error("Erreur lors de la récupération des entreprises:", error);
  } finally {
    loading.value = false;
  }
});

function goToEmailPage(email: string) {
  console.log("ici");
  router.push({ name: "email", query: { to: email } });
}

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
}

function openDeleteModal(id: string) {
  const found = etablissementStore.findEtablissement(id);
  etablissementToDelete.value = found === null ? undefined : found;
  showDeleteModal.value = true;
}

function openDeleteMultipleModal() {
  if (selectedEtablissements.value.length > 0) {
    showDeleteMultipleModal.value = true;
  }
}

function toggleSelectionMode() {
  selectionMode.value = !selectionMode.value;
  if (!selectionMode.value) {
    selectedEtablissements.value = [];
  }
}

function toggleSelect(id: string) {
  const index = selectedEtablissements.value.indexOf(id);
  if (index === -1) {
    selectedEtablissements.value.push(id);
  } else {
    selectedEtablissements.value.splice(index, 1);
  }
}

function toggleSelectAll() {
  if (isAllSelected.value) {
    selectedEtablissements.value = selectedEtablissements.value.filter(
      (id) =>
        !paginatedEtablissements.value.some(
          (etablissement) => etablissement.id === id
        )
    );
  } else {
    paginatedEtablissements.value.forEach((etablissement) => {
      if (!selectedEtablissements.value.includes(etablissement.id)) {
        selectedEtablissements.value.push(etablissement.id);
      }
    });
  }
}

async function handleDelete() {
  if (etablissementToDelete.value) {
    try {
      await api.delete(`/etablissements/${etablissementToDelete.value.id}`);
      // Mettre à jour le store après la suppression
      await etablissementStore.fetchEtablissements();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  }
  showDeleteModal.value = false;
}

async function handleDeleteMultiple() {
  loading.value = true;
  try {
    // Utiliser directement l'ApiService pour chaque suppression
    for (const id of selectedEtablissements.value) {
      await api.delete(`/etablissements/${id}`);
    }
    // Rafraîchir la liste après les suppressions
    await etablissementStore.fetchEtablissements();
    selectedEtablissements.value = [];
  } catch (error) {
    console.error("Erreur lors de la suppression multiple:", error);
  } finally {
    loading.value = false;
    showDeleteMultipleModal.value = false;
  }
}

async function handleAddEtablissement() {
  try {
    await etablissementStore.addEtablissement({
      ...newEtablissement.value,
    });
    resetForm();
    showAddModal.value = false;
  } catch (error) {
    console.error("Error adding etablissement:", error);
  }
}

function resetForm() {
  newEtablissement.value = {
    name: "",
    address: "",
    phone: "",
    website: "",
    email: "",
    siret: "",
    siren: "",
  };
}
</script>

<style scoped>
.businesses-view {
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

.filters-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
  background-color: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.search-box input {
  width: 100%;
  padding: 10px 16px 10px 40px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.search-box i {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 180px;
}

.filter-group label {
  font-size: 12px;
  font-weight: 500;
  color: #4b5563;
}

.filter-group select {
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
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

.error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  background-color: #fee2e2;
  border-radius: 8px;
  color: #b91c1c;
  text-align: center;
}

.error-message i {
  font-size: 24px;
  margin-bottom: 12px;
}

.error-message button {
  margin-top: 16px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.empty-state i {
  font-size: 48px;
  color: #9ca3af;
  margin-bottom: 16px;
}

.empty-state p {
  color: #4b5563;
  margin-bottom: 24px;
}

.businesses-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.businesses-table {
  width: 100%;
  border-collapse: collapse;
}

.businesses-table th,
.businesses-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.businesses-table th {
  background-color: #f9fafb;
  font-weight: 500;
  color: #4b5563;
  cursor: pointer;
  user-select: none;
  position: relative;
}

.businesses-table th.active {
  color: #4f46e5;
}

.businesses-table th i {
  margin-left: 4px;
  font-size: 12px;
}

.businesses-table tbody tr:hover {
  background-color: #f9fafb;
}

.empty-value {
  color: #9ca3af;
  font-style: italic;
}

.actions-cell {
  display: flex;
  gap: 8px;
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.view-btn {
  background-color: #e0f2fe;
  color: #0ea5e9;
}

.view-btn:hover {
  background-color: #bae6fd;
}

.edit-btn {
  background-color: #e0f7fa;
  color: #06b6d4;
}

.edit-btn:hover {
  background-color: #b2ebf2;
}

.delete-btn {
  background-color: #fee2e2;
  color: #ef4444;
}

.delete-btn:hover {
  background-color: #fecaca;
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

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  gap: 16px;
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

.new-etablissement-btn {
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

.new-etablissement-btn i {
  margin-right: 8px;
}

.new-etablissement-btn:hover {
  background-color: #4338ca;
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

.btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s;
}

.btn.primary {
  background-color: #4f46e5;
  color: white;
}

.btn.primary:hover {
  background-color: #4338ca;
}

.btn.secondary {
  background-color: #e5e7eb;
  color: #374151;
}

.btn.secondary:hover {
  background-color: #d1d5db;
}

.btn.danger {
  background-color: #ef4444;
  color: white;
}

.btn.danger:hover {
  background-color: #dc2626;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #6b7280;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
}
</style>
