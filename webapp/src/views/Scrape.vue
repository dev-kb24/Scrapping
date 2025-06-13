<template>
  <div class="businesses-view">
    <div class="page-header">
      <h1>Scrapes</h1>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Chargement des scrapes...</p>
    </div>

    <div v-else class="businesses-container">
      <ScrapeTable :scrapes="scrapeStore.scrapes" @delete="openDeleteModal" />
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useScrapeStore } from '@/stores/scrape';
import ScrapeTable from '@/components/scrape/ScrapeTable.vue';
import DeleteModal from '@/components/modal/DeleteModal.vue';

const scrapeStore = useScrapeStore();
const loading = ref(false);
const showDeleteModal = ref(false);
const scrapeToDelete = ref<string | null>(null);

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
</script>