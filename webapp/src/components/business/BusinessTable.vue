<template>
    <table class="businesses-table">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Adresse</th>
          <th>Email
            <button
            class="btn-icon"
            :class="{ active: sortEmailActive }"
            @click="sortEmailActive = !sortEmailActive"
            title="Trier par email renseigné"
            style="margin-left: 6px;"
          >
            <i class="fas fa-filter"></i>
          </button>
          </th>
          <th>Téléphone</th>
          <th>Site web</th>
          <th>Siret</th>
          <th>Siren</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="business in displayedEtablissements" :key="business.id">
          <td>
            <div v-if="!updatingInProgress[business.id]">
              <span v-if="business.name">
                {{ business.name }}
              </span>
              <span v-else class="empty-value">Non disponible</span>
            </div>
            <input
              v-else
              type="name"
              v-model="business.name"
              class="business-input"
              placeholder="nom"
            >
          </td>

          <td>
            <div v-if="!updatingInProgress[business.id]">
              <span v-if="business.address">
                {{ business.address }}
              </span>
              <span v-else class="empty-value">Non disponible</span>
            </div>
            <input
              v-else
              type="address"
              v-model="business.address"
              class="business-input"
              placeholder="address"
            >
          </td>
          <td>
            <div v-if="!updatingInProgress[business.id]">
              <span v-if="business.email">
                <a :href="`mailto:${business.email}`">{{ business.email }}</a>
              </span>
              <span v-else class="empty-value">Non disponible</span>
            </div>
            <input
              v-else
              type="email"
              v-model="business.email"
              class="business-input"
              placeholder="Email"
            >
          </td>
          <td>
             <div v-if="!updatingInProgress[business.id]">
              <span v-if="business.phone">
                <a :href="`tel:${business.phone}`">{{ business.phone }}</a>
              </span>
              <span v-else class="empty-value">Non disponible</span>
             </div>
            <input
              v-else
              type="text"
              v-model="business.phone"
              class="business-input"
              placeholder="Téléphone"
            >
          </td>
          <td>
            <div v-if="!updatingInProgress[business.id]">
              <span v-if="business.website">
                <a :href="business.website" target="_blank">{{ formatWebsite(business.website) }}</a>
              </span>
              <span v-else class="empty-value">Non disponible</span>
            </div>
            <input
              v-else
              type="text"
              v-model="business.website"
              class="business-input"
              placeholder="Site web"
            >
          </td>
          <td>
            <div v-if="!updatingInProgress[business.id]">
              <span v-if="business.siret">
                <a :href="business.siret" target="_blank">{{ business.siret }}</a>
              </span>
              <span v-else class="empty-value">Non disponible</span>
            </div>
            <input
              v-else
              type="text"
              v-model="business.siret"
              class="business-input"
              placeholder="Siret"
            >
          </td>
          <td>
            <div v-if="!updatingInProgress[business.id]">
              <span v-if="business.siren">
                <a :href="business.siren" target="_blank">{{ business.siren }}</a>
              </span>
              <span v-else class="empty-value">Non disponible</span>
            </div>
            <input
              v-else
              type="text"
              v-model="business.siren"
              class="business-input"
              placeholder="Siren"
            >
          </td>
          <td class="actions-cell">
            <!-- <button class="btn-icon view-btn" @click="$emit('view', business._id)" title="Voir les détails">
              <i class="fas fa-eye"></i>
            </button> -->
            <button v-if="!updatingInProgress[business.id]" class="btn-icon edit-btn" @click="openUpdatingEtablissement(business.id)" title="Modifier">
              <i class="fas fa-edit"></i>
            </button>

             <button v-if="updatingInProgress[business.id]" class="btn-icon edit-btn" @click="closeUpdatingEtablissement(business.id)" title="Valider">
              <i class="fas fa-square-check"></i>
            </button>
            
            <button class="btn-icon delete-btn" @click="$emit('delete', business.id)" title="Supprimer">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
</template>

<script setup lang="ts">

import { computed, ref } from 'vue';
import { useEtablissementStore } from '@/stores/etablissement';
import type { Ref } from 'vue';
const emit = defineEmits(['edit', 'delete', 'loading']);
const etablissementStore = useEtablissementStore();
const sortEmailActive = ref(false);

const updatingInProgress: Ref<Record<string, boolean>> = ref({});

computed(() => {
  etablissementStore.etablissements.forEach((etablissement) => {
    updatingInProgress.value[etablissement.id] = false;
  })
  return etablissementStore.etablissements;
});

const displayedEtablissements = computed(() => {
  const list = [...etablissementStore.etablissements];
  if (sortEmailActive.value) {
    return list.sort((a, b) => {
      if (a.email && !b.email) return -1;
      if (!a.email && b.email) return 1;
      return 0;
    });
  }
  return list;
});

function openUpdatingEtablissement(id: string){
  if(!id){
    return false;
  }
  updatingInProgress.value[id] = true;
}

async function closeUpdatingEtablissement(id: string){
  if(!id){
    return false;
  }
   updatingInProgress.value[id] = false;
   await etablissementStore.updateEtablissement(id);
}

const formatWebsite = (website: string) => {
  return website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
};

</script>
<style scoped>
  .business-input {
    padding: 6px 10px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 1rem;
    background: #fafbfc;
    color: #222;
    transition: border 0.2s;
    width: 100%;
    box-sizing: border-box;
  }

  .business-input:focus {
    border-color: #007bff;
    outline: none;
    background: #fff;
  }
  .businesses-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
  font-size: 1rem;
}

.businesses-table th,
.businesses-table td {
  padding: 12px 16px;
  text-align: left;
  font-size: 0.97em; /* Modifié pour un texte moins gros */
}

.businesses-table th > button.btn-icon {
  display: inline-flex;
  align-items: center;
  margin-left: 8px;
  vertical-align: middle;
  padding: 4px 6px;
  font-size: 1em;
  position: relative;
  top: -1px; /* Ajuste verticalement si besoin */
}

.businesses-table th > i,
.businesses-table th > .btn-icon > i {
  margin: 0;
  padding: 0;
  vertical-align: middle;
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
  font-size: 0.90em; /* Plus petit dans les cellules */
}

.empty-value {
  color: #b0b0b0;
  font-style: italic;
}

.business-input {
  padding: 7px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
  background: #f9fafb;
  color: #222;
  transition: border 0.2s, box-shadow 0.2s;
  width: 100%;
  box-sizing: border-box;
}

.business-input:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 2px #007bff22;
  background: #fff;
  outline: none;
}

.actions-cell {
  display: flex;
  gap: 8px;
  align-items: center;
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

.btn-icon.edit-btn:hover {
  background: #e6f0ff;
  color: #007bff;
}

.btn-icon.delete-btn:hover {
  background: #ffeaea;
  color: #e53935;
}

.btn-icon:focus {
  outline: 2px solid #007bff55;
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