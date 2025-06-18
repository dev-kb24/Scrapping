<template>
  <div class="email-view">
    <h1>Envoyer un email</h1>
    <form @submit.prevent="sendEmail" class="email-form">
      <div class="form-group">
        <label for="from">De :</label>
        <input id="from" v-model="from" type="email" required />
      </div>
      <div class="form-group">
        <label for="to">À :</label>
        <input id="to" v-model="to" type="email" required />
      </div>
      <div class="form-group">
        <label for="subject">Sujet :</label>
        <input id="subject" v-model="subject" type="text" required />
      </div>
      <div class="form-group">
        <label for="body">Corps du mail (Markdown) :</label>
        <textarea id="body" v-model="markdown" rows="8" required></textarea>
      </div>
      <div class="form-group">
        <label>Prévisualisation :</label>
        <MarkdownComponent :content="markdown" />
      </div>
      <div class="form-actions">
        <button class="submit-btn" type="submit" :disabled="loading">Envoyer</button>
      </div>
      <div v-if="success" class="success-msg">Email envoyé !</div>
      <div v-if="error" class="error-msg">{{ error }}</div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import MarkdownComponent from "@/components/markdown/MarkdownComponent.vue";
import { ApiService } from "@/services/APIService";

const route = useRoute();
const from = ref("");
const to = ref((route.query.to as string) || "");
const subject = ref("");
const markdown = ref("");
const loading = ref(false);
const success = ref(false);
const error = ref("");

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
</script>

<style scoped>
.email-view {
  width: 80%;
  max-width: none;
  margin: 0 auto;
  padding: 32px 16px;
  background: #fff;
  border-radius: 0;
  box-shadow: none;
}

.email-view h1 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #111827;
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
.email-form textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
  background: #fafbfc;
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

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.submit-btn:hover:not(:disabled) {
  background-color: #4338ca;
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
</style>