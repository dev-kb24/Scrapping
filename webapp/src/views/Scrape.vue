<template>
  <div class="businesses-view">
    <div class="page-header">
      <h1>Scrapes</h1>
      <button
        class="new-scrape-btn"
        @click="showAddModal = true"
      >
        <i class="fas fa-plus"></i>
        Ajouter
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
      <ScrapeTable
        :scrapes="scrapeStore.scrapes"
        @delete="openDeleteModal"
      />
    </div>

    <!-- Delete Modal -->
    <DeleteModal
      :isVisible="showDeleteModal"
      @close="showDeleteModal = false"
      @confirm="handleDelete"
    >
      <template #body>
        <p>Voulez-vous supprimer ce scrape ?</p>
      </template>
    </DeleteModal>

    <!-- Add Scrape Modal -->
    <BaseModal
      :isVisible="showAddModal"
      @close="showAddModal = false"
    >
      <template #header>
        <h3>Ajouter un nouveau scrape</h3>
      </template>
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
        >Ajouter</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useScrapeStore } from "@/stores/scrape";
import ScrapeTable from "@/components/Scrape/ScrapeTable.vue";
import DeleteModal from "@/components/modal/DeleteModal.vue";
import BaseModal from "@/components/modal/BaseModal.vue";

const scrapeStore = useScrapeStore();
const loading = ref(false);
const showDeleteModal = ref(false);
const showAddModal = ref(false);
const scrapeToDelete = ref<string | null>(null);
const newScrape = ref({
  name: "",
  keyword: "",
  city: "",
});

onMounted(async () => {
  loading.value = true;
  await scrapeStore.fetchScrapes();
  loading.value = false;
});

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

async function handleAddScrape() {
  try {
    await scrapeStore.addScrape({
      ...newScrape.value,
      progress: "in progress",
    });
    resetForm();
    showAddModal.value = false;
  } catch (error) {
    console.error("Error adding scrape:", error);
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
</style>

