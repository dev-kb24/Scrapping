<template>
  <table class="businesses-table">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Mot-clé</th>
        <th>Ville</th>
        <th>Progression</th>
        <th>
          Actions
          <button
            class="btn-icon select-mode-btn"
            :class="{ active: selectionModeActive }"
            @click="toggleSelectionMode"
            title="Mode sélection multiple"
            type="button"
          >
            <i class="fas fa-check-square"></i>
          </button>
          <button
            v-if="selectionModeActive && selectedCount > 0"
            class="btn-icon delete-multiple-btn"
            @click="$emit('delete-multiple')"
            title="Supprimer la sélection"
            type="button"
          >
            <i class="fas fa-trash"></i>
            <span class="selected-count">{{ selectedCount }}</span>
          </button>
          <button
            v-if="selectionModeActive"
            class="btn-icon select-all-btn"
            @click="toggleSelectAll"
            :title="isAllSelected ? 'Tout désélectionner' : 'Tout sélectionner'"
            type="button"
          >
            <i :class="isAllSelected ? 'fas fa-square-check' : 'far fa-square'"></i>
          </button>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="scrape in scrapes"
        :key="scrape.id"
      >
        <td>{{ scrape.name }}</td>
        <td>{{ scrape.keyword }}</td>
        <td>{{ scrape.city }}</td>
        <td>
          <span :class="['progress-badge', scrape.progress]">{{ scrape.progress }}</span>
        </td>
        <td class="actions-cell">
          <button
            class="btn-icon delete-btn"
            @click="$emit('delete', scrape.id)"
            title="Supprimer"
          >
            <i class="fas fa-trash"></i>
          </button>
          <label
            v-if="selectionModeActive"
            class="checkbox-container"
          >
            <input
              type="checkbox"
              :checked="selectedIds.includes(scrape.id)"
              @change="$emit('toggle-select', scrape.id)"
            />
            <span class="checkmark"></span>
          </label>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
  scrapes: any[];
  selectedIds?: string[];
}>();

const emit = defineEmits([
  "delete",
  "toggle-select",
  "delete-multiple",
  "clear-selection",
  "select-all",
  "deselect-all",
]);

const selectionModeActive = ref(false);

const selectedCount = computed(() => {
  return props.selectedIds?.length || 0;
});

const isAllSelected = computed(() => {
  if (!props.selectedIds || !props.scrapes.length) return false;
  return props.scrapes.every((item) => props.selectedIds?.includes(item.id));
});

function toggleSelectionMode() {
  selectionModeActive.value = !selectionModeActive.value;

  // Si on désactive le mode sélection, on émet un événement pour vider la sélection
  if (!selectionModeActive.value && props.selectedIds?.length) {
    emit("clear-selection");
  }
}

function toggleSelectAll() {
  if (isAllSelected.value) {
    emit(
      "deselect-all",
      props.scrapes.map((item) => item.id)
    );
  } else {
    emit(
      "select-all",
      props.scrapes.map((item) => item.id)
    );
  }
}
</script>

<style scoped>
.progress-badge {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.875em;
  color: #fff;
  text-transform: capitalize;
  font-weight: 500;
  display: inline-block;
  min-width: 80px;
  text-align: center;
}

/* Handle "in progress" with space - use attribute selector */
.progress-badge[class*="in progress"] {
  background: #f59e42;
  color: #fff;
}

.progress-badge.failed {
  background: #ef4444;
  color: #fff;
}

.progress-badge.success {
  background: #22c55e;
  color: #fff;
}

/* Alternative approach using data attribute or specific class */
.progress-badge.in-progress {
  background: #f59e42;
  color: #fff;
}

/* Styles pour la table */
.businesses-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  font-size: 1rem;
}

.businesses-table th,
.businesses-table td {
  padding: 12px 16px;
  text-align: left;
  font-size: 0.97em;
}

.businesses-table th {
  background: #f5f7fa;
  color: #222;
  font-weight: 600;
  border-bottom: 2px solid #e5e7eb;
  white-space: nowrap;
  vertical-align: middle;
  position: relative;
}

.businesses-table tr {
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s;
}

.businesses-table tr:hover {
  background: #f8fafc;
}

.businesses-table tr:last-child {
  border-bottom: none;
}

.businesses-table td {
  vertical-align: middle;
  font-size: 0.9em;
}

/* Styles pour les boutons d'action */
.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  background: none;
  color: #555;
  font-size: 1.1em;
}

.select-mode-btn {
  margin-left: 8px;
  background-color: #f3f4f6;
  color: #6b7280;
  order: 1; /* Définir l'ordre d'affichage */
}

.select-mode-btn.active {
  background-color: #4f46e5;
  color: white;
}

.select-all-btn {
  margin-left: 4px;
  background-color: #f3f4f6;
  color: #6b7280;
  order: 3; /* Définir l'ordre d'affichage - apparaît en dernier */
}

.delete-multiple-btn {
  margin-left: 4px;
  background-color: #fee2e2;
  color: #ef4444;
  position: relative;
  order: 2; /* Définir l'ordre d'affichage */
}

.selected-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #ef4444;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-btn {
  background-color: #fee2e2;
  color: #ef4444;
}

.delete-btn:hover {
  background-color: #fecaca;
}

/* Styles pour les cases à cocher */
.checkbox-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding-left: 25px;
  cursor: pointer;
  user-select: none;
  margin-left: 8px;
  height: 32px;
  width: 32px;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 18px;
  width: 18px;
  background-color: #eee;
  border: 1px solid #ccc;
  border-radius: 3px;
}

.checkbox-container:hover input ~ .checkmark {
  background-color: #ccc;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: #4f46e5;
  border-color: #4f46e5;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.actions-cell {
  display: flex;
  align-items: center;
  justify-content: start; /* Centrer au lieu de flex-end */
  gap: 8px;
  border-bottom: none !important;
  padding-bottom: 12px !important;
}

@media (max-width: 900px) {
  .businesses-table th,
  .businesses-table td {
    padding: 8px 6px;
    font-size: 0.95em;
  }

  .businesses-table th > button.btn-icon {
    margin-left: 4px;
    padding: 2px 4px;
    font-size: 0.95em;
  }
}
</style>
