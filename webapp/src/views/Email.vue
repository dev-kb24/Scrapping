<template>
  <div class="email-view">
    <h1>Envoyer un email</h1>
    <div class="email-container">
      <!-- Colonne gauche avec les cards -->
      <div class="left-column">
        <!-- Card de sélection de template -->
        <div class="card template-card">
          <div class="card-header">
            <h3>Sélectionner un template</h3>
            <button
              class="add-btn"
              @click="showAddTemplateModal = true"
            >
              <i class="fas fa-plus"></i> Ajouter
            </button>
          </div>
          <select class="template-select">
            <option value="">-- Choisir un template --</option>
            <option value="template1">Template 1</option>
            <option value="template2">Template 2</option>
            <option value="template3">Template 3</option>
          </select>
        </div>

        <!-- Card de recherche d'établissement -->
        <div class="card search-card">
          <h3>Rechercher un établissement</h3>
          <div class="search-input">
            <input
              type="text"
              placeholder="Rechercher un établissement..."
            />
            <button class="search-btn"><i class="fas fa-search"></i></button>
          </div>
        </div>
      </div>

      <!-- Colonne droite avec le formulaire existant -->
      <div class="right-column">
        <form
          @submit.prevent="sendEmail"
          class="email-form"
        >
          <div class="form-group">
            <label for="from">De :</label>
            <input
              id="from"
              v-model="from"
              type="email"
              required
            />
          </div>
          <div class="form-group">
            <label for="to">À :</label>
            <input
              id="to"
              v-model="to"
              type="email"
              required
            />
          </div>
          <div class="form-group">
            <label for="subject">Sujet :</label>
            <input
              id="subject"
              v-model="subject"
              type="text"
              required
            />
          </div>
          <div class="form-group">
            <label for="body">Corps du mail (Markdown) :</label>
            <textarea
              id="body"
              v-model="markdown"
              rows="8"
              required
            ></textarea>
          </div>
          <div class="form-group">
            <label>Prévisualisation :</label>
            <MarkdownComponent :content="markdown" />
          </div>
          <div class="form-actions">
            <button
              class="submit-btn"
              type="submit"
              :disabled="loading"
            >Envoyer</button>
          </div>
          <div
            v-if="success"
            class="success-msg"
          >Email envoyé !</div>
          <div
            v-if="error"
            class="error-msg"
          >{{ error }}</div>
        </form>
      </div>
    </div>

    <!-- Modal pour ajouter un template -->
    <BaseModal
      v-if="showAddTemplateModal"
      :isVisible="showAddTemplateModal"
      @close="showAddTemplateModal = false"
    >
      <template #header>
        <h3>Ajouter un template</h3>
      </template>
      <template #body>
        <form @submit.prevent="addTemplate">
          <div class="form-group">
            <label for="templateName">Nom du template:</label>
            <input
              id="templateName"
              v-model="newTemplate.name"
              type="text"
              required
            />
          </div>
          <div class="form-group">
            <label for="templateSubject">Sujet:</label>
            <input
              id="templateSubject"
              v-model="newTemplate.subject"
              type="text"
              required
            />
          </div>
          <div class="form-group">
            <label for="templateBody">Corps du mail (Markdown):</label>
            <textarea
              id="templateBody"
              v-model="newTemplate.body"
              rows="8"
              required
            ></textarea>
          </div>
        </form>
      </template>
      <template #footer>
        <div class="modal-actions">
          <button
            class="cancel-btn"
            @click="showAddTemplateModal = false"
          >Annuler</button>
          <button
            class="submit-btn"
            @click="addTemplate"
          >Ajouter</button>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import MarkdownComponent from "@/components/markdown/MarkdownComponent.vue";
import { ApiService } from "@/services/APIService";
import BaseModal from "@/components/modal/BaseModal.vue";

const route = useRoute();
const from = ref("");
const to = ref((route.query.to as string) || "");
const subject = ref("");
const markdown = ref("");
const loading = ref(false);
const success = ref(false);
const error = ref("");

// Ajout pour le modal de template
const showAddTemplateModal = ref(false);
const newTemplate = ref({
  name: "",
  subject: "",
  body: "",
});

const api = new ApiService("http://localhost:8000/api");

async function sendEmail() {
  loading.value = true;
  success.value = false;
  error.value = "";
  try {
    await api.post("/send-email", {
      from: from.value,
      to: to.value,
      subject: subject.value,
      text: markdown.value,
    });
    success.value = true;
    from.value = "";
    to.value = "";
    subject.value = "";
    markdown.value = "";
  } catch (e: any) {
    error.value = e?.response?.data?.message || "Erreur lors de l'envoi";
  } finally {
    loading.value = false;
  }
}

function addTemplate() {
  // Fonction pour ajouter un template (à implémenter plus tard)
  console.log("Template à ajouter:", newTemplate.value);
  // Réinitialiser le formulaire
  newTemplate.value = {
    name: "",
    subject: "",
    body: "",
  };
  // Fermer le modal
  showAddTemplateModal.value = false;
}
</script>

<style scoped>
.email-view {
  width: 100%;
  max-width: none;
  margin: 0 auto;
  padding: 32px 16px;
  background: #fff;
}

.email-view h1 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #111827;
}

.email-container {
  display: flex;
  gap: 24px;
}

.left-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.right-column {
  flex: 1;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.template-card h3,
.search-card h3 {
  font-size: 18px;
  color: #374151;
  margin: 0;
}

.add-btn {
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.add-btn:hover {
  background-color: #4338ca;
}

.template-select {
  width: 100%;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: #fafbfc;
}

.search-input {
  display: flex;
  gap: 8px;
}

.search-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: #fafbfc;
}

.search-btn {
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px;
  cursor: pointer;
}

.email-form .form-group {
  margin-bottom: 18px;
}

.email-form label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #374151;
}

.email-form input,
.email-form textarea,
.template-select,
.search-input input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
  background: #fafbfc;
  color: #111827;
}

.email-form input:focus,
.email-form textarea:focus {
  outline: none;
  border-color: #4f46e5;
  background: #fff;
}

.form-actions {
  margin-top: 18px;
  display: flex;
  justify-content: flex-end;
}

.submit-btn {
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-btn {
  background-color: #9ca3af;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  margin-right: 10px;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.submit-btn:hover:not(:disabled) {
  background-color: #4338ca;
}

.cancel-btn:hover {
  background-color: #6b7280;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Assurer que les inputs dans le modal sont en pleine largeur */
:deep(.modal-body) .form-group {
  margin-bottom: 16px;
  width: 100%;
}

:deep(.modal-body) label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #374151;
}

:deep(.modal-body) input,
:deep(.modal-body) textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  background: #fafbfc;
  color: #111827;
  box-sizing: border-box;
}

:deep(.modal-body) input:focus,
:deep(.modal-body) textarea:focus {
  outline: none;
  border-color: #4f46e5;
  background: #fff;
}

.success-msg {
  color: #22c55e;
  margin-top: 16px;
  font-weight: 500;
}

.error-msg {
  color: #ef4444;
  margin-top: 16px;
  font-weight: 500;
}

/* Responsive design */
@media (max-width: 768px) {
  .email-container {
    flex-direction: column;
  }
}
</style>
