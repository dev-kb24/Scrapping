<template>
  <div class="kanban-board">
    <div class="kanban-columns">
      <KanbanColumn
        v-for="status in statuses"
        :key="status.id"
        :title="status.title"
        :status="status.id"
        :etablissements="getEtablissementsByStatus(status.id)"
        :color="status.color"
        @drop="handleDrop"
        @delete="$emit('delete', $event)"
        @email="$emit('email', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import KanbanColumn from "./KanbanColumn.vue";

const props = defineProps<{
  etablissements: any[];
}>();

const emit = defineEmits(["update-status", "delete", "email"]);

const statuses = [
  { id: "prospect", title: "Prospects", color: "#e3f2fd" },
  { id: "contacted", title: "Contactés", color: "#fff3e0" },
  { id: "negotiation", title: "Négociation", color: "#f3e5f5" },
  { id: "client", title: "Clients", color: "#e8f5e8" },
  { id: "inactive", title: "Inactifs", color: "#ffebee" },
];

const getEtablissementsByStatus = (status: string) => {
  return props.etablissements.filter((e) => e.status === status);
};

const handleDrop = (etablissementId: string, newStatus: string) => {
  emit("update-status", etablissementId, newStatus);
};
</script>

<style scoped>
.kanban-board {
  padding: 20px;
  height: 100%;
  overflow-x: auto;
}

.kanban-columns {
  display: flex;
  gap: 20px;
  min-height: 70vh;
  align-items: flex-start;
}
</style>
