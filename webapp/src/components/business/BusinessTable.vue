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
        v-for="business in displayedEtablissements"
        :key="business.id"
      >
        <td>
          <div v-if="!updatingInProgress[business.id]">
            <span v-if="business.name">
              {{ business.name }}
            </span>
            <span
              v-else
              class="empty-value"
            >Non disponible</span>
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
            <span
              v-else
              class="empty-value"
            >Non disponible</span>
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
            <span
              v-else
              class="empty-value"
            >Non disponible</span>
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
            <span
              v-else
              class="empty-value"
            >Non disponible</span>
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
              <a
                :href="business.website"
                target="_blank"
              >{{ formatWebsite(business.website) }}</a>
            </span>
            <span
              v-else
              class="empty-value"
            >Non disponible</span>
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
              <a
                :href="business.siret"
                target="_blank"
              >{{ business.siret }}</a>
            </span>
            <span
              v-else
              class="empty-value"
            >Non disponible</span>
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
              <a
                :href="business.siren"
                target="_blank"
              >{{ business.siren }}</a>
            </span>
            <span
              v-else
              class="empty-value"
            >Non disponible</span>
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
          <button
            v-if="!updatingInProgress[business.id]"
            class="btn-icon edit-btn"
            @click="openUpdatingEtablissement(business.id)"
            title="Modifier"
          >
            <i class="fas fa-edit"></i>
          </button>

          <button
            v-if="updatingInProgress[business.id]"
            class="btn-icon edit-btn"
            @click="closeUpdatingEtablissement(business.id)"
            title="Valider"
          >
            <i class="fas fa-square-check"></i>
          </button>

          <button
            class="btn-icon delete-btn"
            @click="$emit('delete', business.id)"
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
              :checked="selectedIds.includes(business.id)"
              @change="$emit('toggle-select', business.id)"
            />
            <span class="checkmark"></span>
          </label>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue";
import { useEtablissementStore } from "@/stores/etablissement";
import type { Ref } from "vue";
import { Etablissement } from "@/models/Etablissement";

// Props
const props = defineProps<{
  etablissements: Etablissement[];
  selectedIds?: string[];
}>();

const emit = defineEmits([
  "edit",
  "delete",
  "loading",
  "toggle-select",
  "delete-multiple",
  "clear-selection",
  "select-all",
  "deselect-all",
]);
const etablissementStore = useEtablissementStore();
const sortEmailActive = ref(false);
const selectionModeActive = ref(false);

const updatingInProgress: Ref<Record<string, boolean>> = ref({});

// Initialiser updatingInProgress pour chaque établissement
onMounted(() => {
  props.etablissements.forEach((etablissement) => {
    updatingInProgress.value[etablissement.id] = false;
  });
});

// Mettre à jour updatingInProgress quand les établissements changent
watch(
  () => props.etablissements,
  (newEtablissements) => {
    newEtablissements.forEach((etablissement) => {
      if (updatingInProgress.value[etablissement.id] === undefined) {
        updatingInProgress.value[etablissement.id] = false;
      }
    });
  },
  { deep: true }
);

const displayedEtablissements = computed(() => {
  const list = [...props.etablissements];
  if (sortEmailActive.value) {
    return list.sort((a, b) => {
      if (a.email && !b.email) return -1;
      if (!a.email && b.email) return 1;
      return 0;
    });
  }
  return list;
});

const selectedCount = computed(() => {
  return props.selectedIds?.length || 0;
});

const isAllSelected = computed(() => {
  if (!props.selectedIds || !props.etablissements.length) return false;
  return props.etablissements.every((item) =>
    props.selectedIds?.includes(item.id)
  );
});

function toggleSelectionMode() {
  console.log("Mode sélection toggled:", !selectionModeActive.value);
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
      props.etablissements.map((item) => item.id)
    );
  } else {
    emit(
      "select-all",
      props.etablissements.map((item) => item.id)
    );
  }
}

function openUpdatingEtablissement(id: string) {
  if (!id) {
    return false;
  }
  updatingInProgress.value[id] = true;
}

async function closeUpdatingEtablissement(id: string) {
  if (!id) {
    return false;
  }
  updatingInProgress.value[id] = false;
  await etablissementStore.updateEtablissement(id);
}

const formatWebsite = (website: string) => {
  return website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
};
</script>
<style scoped>
.select-mode-btn {
  margin-left: 8px;
  background-color: #f3f4f6;
  color: #6b7280;
}

.select-mode-btn.active {
  background-color: #4f46e5;
  color: white;
}

.select-all-btn {
  margin-left: 4px;
  background-color: #f3f4f6;
  color: #6b7280;
}

.delete-multiple-btn {
  margin-left: 4px;
  background-color: #fee2e2;
  color: #ef4444;
  position: relative;
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
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
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
  font-size: 0.9em; /* Plus petit dans les cellules */
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
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  border-bottom: none !important;
  padding-bottom: 12px !important; /* Maintenir un padding cohérent */
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

/* Styles pour les lignes du tableau */
.businesses-table tr:last-child {
  border-bottom: none;
}

/* Styles pour les médias queries */
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
