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
      <tr v-for="scrape in scrapes" :key="scrape.id">
        <td>{{ scrape.name }}</td>
        <td>{{ scrape.keyword }}</td>
        <td>{{ scrape.city }}</td>
        <td>
          <span :class="['progress-badge', scrape.progress]">{{ scrape.progress }}</span>
        </td>
        <td class="actions-cell">
          <button class="btn-icon delete-btn" @click="$emit('delete', scrape.id)" title="Supprimer">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
defineProps<{ scrapes: any[] }>();
defineEmits(['delete']);
</script>

<style scoped>
.progress-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.95em;
  color: #fff;
  text-transform: capitalize;
}
.progress-badge.in\ progress { background: #f59e42; }
.progress-badge.failed { background: #ef4444; }
.progress-badge.success { background: #22c55e; }
</style>