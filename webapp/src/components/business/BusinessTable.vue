<template>
    <table class="businesses-table">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Adresse</th>
          <th>Email</th>
          <th>Téléphone</th>
          <th>Site web</th>
          <th>Siret</th>
          <th>Siren</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="business in filteredEtablissement" :key="business.name">
          <td>{{ business.name }}</td>
          <td>{{ business.address }}</td>
          <td>
            <span v-if="business.email">
              <a :href="`mailto:${business.email}`">{{ business.email }}</a>
            </span>
            <span v-else class="empty-value">Non disponible</span>
          </td>
          <td>
            <span v-if="business.phone">
              <a :href="`tel:${business.phone}`">{{ business.phone }}</a>
            </span>
            <span v-else class="empty-value">Non disponible</span>
          </td>
          <td>
            <span v-if="business.website">
              <a :href="business.website" target="_blank">{{ formatWebsite(business.website) }}</a>
            </span>
            <span v-else class="empty-value">Non disponible</span>
          </td>
          <td>
            <span v-if="business.siret">
              <a :href="business.siret" target="_blank">{{ business.siret }}</a>
            </span>
            <span v-else class="empty-value">Non disponible</span>
          </td>
          <td>
            <span v-if="business.siren">
              <a :href="business.siren" target="_blank">{{ business.siren }}</a>
            </span>
            <span v-else class="empty-value">Non disponible</span>
          </td>
          <!-- <td class="actions-cell">
            <button class="btn-icon view-btn" @click="$emit('view', business._id)" title="Voir les détails">
              <i class="fas fa-eye"></i>
            </button>
            <button class="btn-icon edit-btn" @click="$emit('edit', business._id)" title="Modifier">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-icon delete-btn" @click="$emit('delete', business._id)" title="Supprimer">
              <i class="fas fa-trash"></i>
            </button>
          </td> -->
        </tr>
      </tbody>
    </table>
</template>

<script setup lang="ts">
import { useEtablissementStore } from '@/stores/etablissement';
import { computed, onMounted } from 'vue';
const emit = defineEmits(['view', 'edit', 'delete', 'loading']);

const etablissementStore = useEtablissementStore();

const filteredEtablissement = computed(() => {
  // Ici, on affiche toutes les entreprises sans filtre ni pagination
  return etablissementStore.etablissements;
});

const formatWebsite = (website: string) => {
  return website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
};

onMounted(async () => {
    try{
        await etablissementStore.fetchEtablissements();
    }finally{
        emit('loading', false);
    }
  
});
</script>