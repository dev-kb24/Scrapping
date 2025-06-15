<template>
  <table class="businesses-table">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Mot-clé</th>
        <th>Ville</th>
        <th>Progression</th>
        <th>Actions</th>
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
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
defineProps<{ scrapes: any[] }>();
defineEmits(["delete"]);
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
</style>