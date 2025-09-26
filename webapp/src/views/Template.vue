<template>
  <div class="template-view">
    <h1>Templates</h1>
    <button class="add-btn" @click="showAddModal = true">
      <i class="fas fa-plus"></i> Ajouter un template
    </button>

    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Chargement des templates...</p>
    </div>

    <table v-else class="templates-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Type</th>
          <th>Contenu</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="template in templateStore.templates" :key="template.id">
          <td>{{ template.id }}</td>
          <td>{{ template.type_template }}</td>
          <td>
            <pre class="template-content">{{ template.content }}</pre>
          </td>
          <td>
            <button class="btn-icon" @click="editTemplate(template)">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-icon delete-btn" @click="deleteTemplate(template.id)">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal ajout/modification -->
    <BaseModal v-if="showAddModal || showEditModal" :isVisible="showAddModal || showEditModal" @close="closeModal">
      <template #header>
        <h3>{{ showEditModal ? 'Modifier' : 'Ajouter' }} un template</h3>
      </template>
      <template #body>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="type_template">Type :</label>
            <select v-model="form.type_template" id="type_template" required>
              <option value="email">Email</option>
              <option value="prompt">Prompt</option>
            </select>
          </div>
          <div class="form-group">
            <label for="body">Corps du mail (Markdown) :</label>
            <textarea
              id="body"
              v-model="form.content"
              rows="8"
              required
            ></textarea>
          </div>
          <div class="form-group">
            <label>Prévisualisation :</label>
            <MarkdownComponent :content="form.content" />
          </div>
        </form>
      </template>
      <template #footer>
        <button class="cancel-btn" @click="closeModal">Annuler</button>
        <button class="submit-btn" @click="submitForm">{{ showEditModal ? 'Modifier' : 'Ajouter' }}</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useTemplateStore } from "@/stores/template";
import BaseModal from "@/components/modal/BaseModal.vue";
import MarkdownComponent from "@/components/markdown/MarkdownComponent.vue";
const templateStore = useTemplateStore();
const loading = ref(false);

const showAddModal = ref(false);
const showEditModal = ref(false);
const editId = ref<number | null>(null);

const form = ref({
  type_template: "email" as "email" | "prompt",
  content: ""
});

onMounted(async () => {
  loading.value = true;
  await templateStore.fetchTemplates();
  loading.value = false;
});

function closeModal() {
  showAddModal.value = false;
  showEditModal.value = false;
  editId.value = null;
  form.value = { type_template: "email", content: "" };
}

function submitForm() {
  if (showEditModal.value && editId.value !== null) {
    templateStore.updateTemplate(editId.value, form.value).then(closeModal);
  } else {
    templateStore.addTemplate(form.value).then(closeModal);
  }
}

function editTemplate(template: any) {
  form.value = {
    type_template: template.type_template,
    content: template.content
  };
  editId.value = template.id;
  showEditModal.value = true;
}

function deleteTemplate(id: number) {
  if (confirm("Supprimer ce template ?")) {
    templateStore.deleteTemplate(id);
  }
}
</script>

<style scoped>
.template-view {
  width: 80%;
  margin: 0 auto;
  padding: 32px 16px;
  background: #fff;
  border-radius: 0;
  box-shadow: none;
}
h1 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #111827;
}
.add-btn {
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 18px;
}
.add-btn i {
  margin-right: 8px;
}
.add-btn:hover {
  background-color: #4338ca;
}
.templates-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
  font-size: 1rem;
}
.templates-table th,
.templates-table td {
  padding: 12px 16px;
  text-align: left;
  font-size: 0.97em;
}
.templates-table th {
  background: #f5f7fa;
  color: #222;
  font-weight: 600;
  border-bottom: 2px solid #e5e7eb;
}
.templates-table tr {
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s;
}
.templates-table tr:hover {
  background: #f8fafc;
}
.template-content {
  white-space: pre-wrap;
  font-family: inherit;
  background: #f3f4f6;
  border-radius: 4px;
  padding: 8px;
  margin: 0;
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
.btn-icon:hover {
  background: #e6f0ff;
  color: #007bff;
}
.cancel-btn {
  background-color: #9ca3af;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  margin-right: 10px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.cancel-btn:hover {
  background-color: #6b7280;
}
.submit-btn {
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.submit-btn:hover {
  background-color: #4338ca;
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #374151;
}
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
}
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4f46e5;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}
</style>