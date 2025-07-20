<template>
  <div
    class="kanban-card"
    draggable="true"
    @dragstart="onDragStart"
  >
    <div class="card-header">
      <h4 class="card-title">{{ etablissement.name }}</h4>
      <div class="card-actions">
        <button
          class="action-btn email-btn"
          @click="$emit('email', etablissement)"
          title="Envoyer un email"
        >
          <i class="fas fa-envelope"></i>
        </button>
        <button
          class="action-btn delete-btn"
          @click="$emit('delete', etablissement.id)"
          title="Supprimer"
        >
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>

    <div class="card-content">
      <div
        v-if="etablissement.address"
        class="card-info"
      >
        <i class="fas fa-map-marker-alt"></i>
        <span>{{ etablissement.address }}</span>
      </div>

      <div
        v-if="etablissement.phone"
        class="card-info"
      >
        <i class="fas fa-phone"></i>
        <span>{{ etablissement.phone }}</span>
      </div>

      <div
        v-if="etablissement.email"
        class="card-info"
      >
        <i class="fas fa-envelope"></i>
        <span>{{ etablissement.email }}</span>
      </div>

      <div
        v-if="etablissement.website"
        class="card-info"
      >
        <i class="fas fa-globe"></i>
        <a
          :href="etablissement.website"
          target="_blank"
        >Site web</a>
      </div>
    </div>

    <div
      v-if="etablissement.siret"
      class="card-footer"
    >
      <small>SIRET: {{ etablissement.siret }}</small>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  etablissement: any;
}>();

const emit = defineEmits(["delete", "email"]);

const onDragStart = (event: DragEvent) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData("text/plain", props.etablissement.id);
    event.dataTransfer.effectAllowed = "move";
  }
};
</script>

<style scoped>
.kanban-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  cursor: grab;
  transition: all 0.2s ease;
}

.kanban-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.kanban-card:active {
  cursor: grabbing;
  transform: scale(0.98);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  flex: 1;
  margin-right: 8px;
  line-height: 1.3;
}

.card-actions {
  display: flex;
  gap: 4px;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.kanban-card:hover .card-actions {
  opacity: 1;
}

.action-btn {
  background: none;
  border: none;
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.email-btn {
  color: #3b82f6;
}

.email-btn:hover {
  background: #dbeafe;
  color: #1d4ed8;
}

.delete-btn {
  color: #ef4444;
}

.delete-btn:hover {
  background: #fee2e2;
  color: #dc2626;
}

.card-content {
  margin-bottom: 8px;
}

.card-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
}

.card-info i {
  width: 12px;
  font-size: 10px;
  flex-shrink: 0;
}

.card-info span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-info a {
  color: #3b82f6;
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-info a:hover {
  text-decoration: underline;
  color: #1d4ed8;
}

.card-footer {
  padding-top: 8px;
  border-top: 1px solid #f3f4f6;
  color: #9ca3af;
  font-size: 11px;
}
</style>


