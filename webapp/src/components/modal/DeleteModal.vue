<template>
  <BaseModal
    :isVisible="isVisible"
    @close="closeModal"
  >
    <template #header>
      <div class="modal-header-content">
        <i class="fas fa-exclamation-triangle warning-icon"></i>
        <h3>Confirmation de suppression</h3>
      </div>
    </template>
    <template #body>
      <div class="delete-modal-body">
        <slot>
          <p>Êtes-vous sûr de vouloir supprimer cet élément ?</p>
        </slot>
      </div>
    </template>
    <template #footer>
      <div class="modal-actions">
        <button
          class="btn-cancel"
          @click="closeModal"
        >Annuler</button>
        <button
          class="btn-delete"
          @click="confirmDeletion"
        >Supprimer</button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from "./BaseModal.vue";

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close", "confirm"]);

function closeModal() {
  emit("close");
}

function confirmDeletion() {
  emit("confirm");
  closeModal();
}
</script>

<style scoped>
.modal-header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.warning-icon {
  color: #f59e0b;
  font-size: 24px;
}

h3 {
  margin: 0;
  color: #111827;
  font-size: 18px;
  font-weight: 600;
}

.delete-modal-body {
  padding: 8px 0;
}

p {
  margin: 0;
  color: #4b5563;
  font-size: 16px;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  width: 100%;
}

.btn-cancel {
  padding: 8px 16px;
  background-color: #f3f4f6;
  color: #4b5563;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel:hover {
  background-color: #e5e7eb;
}

.btn-delete {
  padding: 8px 16px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-delete:hover {
  background-color: #dc2626;
}

/* Support du mode sombre */
:root.dark-mode .warning-icon {
  color: #fbbf24;
}

:root.dark-mode h3 {
  color: #f9fafb;
}

:root.dark-mode p {
  color: #e5e7eb;
}

:root.dark-mode .btn-cancel {
  background-color: #374151;
  color: #e5e7eb;
  border-color: #4b5563;
}

:root.dark-mode .btn-cancel:hover {
  background-color: #4b5563;
}

:root.dark-mode .btn-delete {
  background-color: #b91c1c;
}

:root.dark-mode .btn-delete:hover {
  background-color: #991b1b;
}
</style>
