<template>
  <div class="businesses-view">
    <div class="page-header">
      <h1>Entreprises</h1>
      <!-- <div class="header-actions">
        <button class="btn primary" @click="refreshBusinesses">
          <i class="fas fa-sync-alt"></i> Rafraîchir
        </button>
      </div> -->
    </div>


    <!-- <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Chargement des entreprises...</p>
    </div> -->

    <!-- <div v-else-if="error" class="error-message">
      <i class="fas fa-exclamation-triangle"></i>
      <p>{{ error }}</p>
      <button class="btn secondary" @click="refreshBusinesses">Réessayer</button>
    </div> -->

    <!-- <div v-else-if="filteredBusinesses.length === 0" class="empty-state">
      <i class="fas fa-store-slash"></i>
      <p v-if="hasFilters">Aucune entreprise ne correspond à vos critères de recherche.</p>
      <p v-else>Aucune entreprise n'a été importée. Utilisez l'outil de recherche Google Places pour importer des entreprises.</p>
      <router-link to="/scrapes/google-places" class="btn primary">
        <i class="fas fa-search"></i> Rechercher des entreprises
      </router-link>
    </div> -->

    <div class="businesses-container">
    
      <BusinessTable @loading="loading = $event" />
      <div class="pagination">
        <button 
          class="btn-pagination" 
          @click="goToPage(currentPage - 1)" 
          :disabled="currentPage === 1"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        
        <span class="page-info">
          Page {{ currentPage }} sur {{ totalPages }}
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

    <!-- Modal de confirmation de suppression -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3>Confirmer la suppression</h3>
          <button class="close-btn" @click="showDeleteModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>Êtes-vous sûr de vouloir supprimer cette entreprise ? Cette action est irréversible.</p>
        </div>
        <div class="modal-footer">
          <button class="btn secondary" @click="showDeleteModal = false">Annuler</button>
          <button class="btn danger" @click="deleteBusiness">Supprimer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

import BusinessTable from '@/components/business/BusinessTable.vue';

// Variables d'état
const loading = ref(false);
const error = ref<string | null>(null);
const businesses = ref<any[]>([]); // Remplacez 'any' par le type réel si connu
const currentPage = ref(1);
const pageSize = ref(10);
const showDeleteModal = ref(false);
const businessToDelete = ref<any | null>(null); // Pour stocker l'entreprise à supprimer

// Filtres (exemple)
const searchQuery = ref('');
const hasFilters = computed(() => !!searchQuery.value);

// Pagination
const totalPages = computed(() => {
  return Math.ceil(filteredBusinesses.value.length / pageSize.value) || 1;
});

// Filtrage des entreprises
const filteredBusinesses = computed(() => {
  if (!searchQuery.value) return businesses.value;
  return businesses.value.filter(b =>
    b.name?.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
}

function deleteBusiness() {
  if (!businessToDelete.value) return;
  businesses.value = businesses.value.filter(b => b.id !== businessToDelete.value.id);
  showDeleteModal.value = false;
  businessToDelete.value = null;
}

// Pour ouvrir la modale de suppression
function confirmDelete(business: any) {
  businessToDelete.value = business;
  showDeleteModal.value = true;
}
</script>

<style>
.businesses-view {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
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
