<template>
  <div
    class="kanban-column"
    :style="{ backgroundColor: color }"
    @drop="onDrop"
    @dragover.prevent
  >
    <div class="column-header">
      <h3>{{ title }}</h3>
      <span class="count">{{ etablissements.length }}</span>
    </div>

    <div class="column-content">
      <KanbanCard
        v-for="etablissement in etablissements"
        :key="etablissement.id"
        :etablissement="etablissement"
        @delete="$emit('delete', $event)"
        @email="$emit('email', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import KanbanCard from "./KanbanCard.vue";

const props = defineProps<{
  title: string;
  status: string;
  etablissements: any[];
  color: string;
}>();

const emit = defineEmits(["drop", "delete", "email"]);

const onDrop = (event: DragEvent) => {
  event.preventDefault();
  const etablissementId = event.dataTransfer?.getData("text/plain");
  if (etablissementId) {
    emit("drop", etablissementId, props.status);
  }
};
</script>

<style scoped>
.kanban-column {
  min-width: 280px;
  max-width: 320px;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
}

.column-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.count {
  background: rgba(255, 255, 255, 0.8);
  color: #374151;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}

.column-content {
  min-height: 400px;
  max-height: 70vh;
  overflow-y: auto;
}

/* Scrollbar styling */
.column-content::-webkit-scrollbar {
  width: 6px;
}

.column-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.column-content::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.column-content::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}
</style>

