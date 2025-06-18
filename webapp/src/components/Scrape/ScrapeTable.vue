<template>
  <table class="businesses-table">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Mot-clé</th>
        <th>Ville</th>
        <th>Progression</th>
        <th>Actions</th>
        <th
          v-if="selectionMode"
          class="selection-column"
        >
          <input
            type="checkbox"
            :checked="allSelected"
            @change="$emit('toggle-all')"
            class="select-all-checkbox"
          />
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
        </td>
        <td
          v-if="selectionMode"
          class="selection-column"
        >
          <input
            type="checkbox"
            :checked="selectedItems.includes(scrape.id)"
            @change="$emit('toggle-select', scrape.id)"
            class="select-checkbox"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
defineProps<{
  scrapes: any[];
  selectionMode?: boolean;
  selectedItems?: string[];
  allSelected?: boolean;
}>();

defineEmits(["delete", "toggle-select", "toggle-all"]);
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

.businesses-table td {
  vertical-align: middle;
  font-size: 0.9em;
}

.actions-cell {
  display: flex;
  gap: 8px;
  align-items: start;
  justify-content: start;
}

.btn-icon {
  background: none;
  border: none;
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
  color: #555;
  transition: background 0.15s, color 0.15s;
  font-size: 1.1em;
}

.btn-icon.delete-btn:hover {
  background: #ffeaea;
  color: #e53935;
}

.btn-icon:focus {
  outline: 2px solid #007bff55;
}

.selection-column {
  width: 48px;
  text-align: center;
  padding: 0 8px;
}

.select-all-checkbox,
.select-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}
</style>
