<template>
  <div class="kanban-view">
    <div
      v-if="loading"
      class="loading"
    >Chargement...</div>
    <div
      v-else-if="etablissements.length === 0"
      class="no-data"
    >
      Aucun établissement trouvé
    </div>

    <KanbanBoard
      v-else
      :etablissements="etablissements"
      @update-status="updateEtablissementStatus"
      @delete="openDeleteModal"
      @email="goToEmailPage"
    />

    <!-- Delete Modal -->
    <DeleteModal
      v-if="showDeleteModal"
      :isVisible="showDeleteModal"
      @close="showDeleteModal = false"
      @confirm="handleDelete"
    >
      <p>
        Êtes-vous sûr de vouloir supprimer
        <strong>{{ etablissementToDelete?.name || 'cet établissement' }}</strong> ?
        Cette action est irréversible.
      </p>
    </DeleteModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useEtablissementStore } from "@/stores/etablissement";
import KanbanBoard from "@/components/kanban/KanbanBoard.vue";
import DeleteModal from "@/components/modal/DeleteModal.vue";
import { ApiService } from "@/services/APIService";
import router from "@/router";

const api = new ApiService("http://localhost:8000/api");
const etablissementStore = useEtablissementStore();
const etablissements = computed(() => etablissementStore.etablissements);
const loading = ref(false);

// Variables pour le DeleteModal
const showDeleteModal = ref(false);
const etablissementToDelete = ref<any>(null);

const updateEtablissementStatus = async (id: string, newStatus: string) => {
  try {
    await api.put(`/etablissements/${id}`, { status: newStatus });
    await etablissementStore.fetchEtablissements();
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour du statut:", error);
    await etablissementStore.fetchEtablissements();
  }
};

const openDeleteModal = (etablissementId: string) => {
  // Trouver l'établissement à supprimer
  etablissementToDelete.value = etablissements.value.find(
    (e) => e.id === etablissementId
  );
  showDeleteModal.value = true;
};

const handleDelete = async () => {
  if (etablissementToDelete.value) {
    try {
      loading.value = true;
      await api.delete(`/etablissements/${etablissementToDelete.value.id}`);

      // Refresh automatique du store
      await etablissementStore.fetchEtablissements();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    } finally {
      loading.value = false;
      showDeleteModal.value = false;
      etablissementToDelete.value = null;
    }
  }
};

const goToEmailPage = (etablissement: any) => {
  router.push({
    path: "/email",
    query: {
      to: etablissement.email,
      subject: `Contact - ${etablissement.name}`,
    },
  });
};

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
</script>

<style scoped>
.kanban-view {
  height: 100%;
  background-color: var(--color-bg-primary);
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 18px;
  color: var(--color-text-secondary);
}

.no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 18px;
  color: var(--color-text-secondary);
  background: var(--color-bg-secondary);
  border-radius: 8px;
  margin: 20px;
}
</style>











