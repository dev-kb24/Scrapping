<template>
  <BaseModal :visible="isVisible" @close="closeModal">
    <template #header>
      <h3>Add New Item</h3>
    </template>
    <template #body>
      <form @submit.prevent="submitForm">
        <div>
          <label for="itemName">Item Name:</label>
          <input type="text" v-model="itemName" id="itemName" required />
        </div>
        <div>
          <label for="itemDescription">Description:</label>
          <textarea v-model="itemDescription" id="itemDescription" required></textarea>
        </div>
      </form>
    </template>
    <template #footer>
      <button @click="submitForm">Add Item</button>
      <button @click="closeModal">Cancel</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from './BaseModal.vue';

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close']);
const isVisible = ref(props.visible);
const itemName = ref('');
const itemDescription = ref('');

function closeModal() {
  emit('close');
  resetForm();
}

function submitForm() {
  emit('add', { name: itemName.value, description: itemDescription.value });
  closeModal();
}

function resetForm() {
  itemName.value = '';
  itemDescription.value = '';
}
</script>

<style scoped>
/* Add any specific styles for AddModal here */
</style>