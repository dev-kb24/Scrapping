<template>
  <BaseModal :isVisible="isVisible" @close="closeModal">
    <slot name="header">
      <h3>Confirm Deletion</h3>
    </slot>
    <slot name="body">
      <p>Are you sure you want to delete this item?</p>
    </slot>
    <slot name="footer">
      <button @click="closeModal">Cancel</button>
      <button @click="confirmDeletion">Delete</button>
    </slot>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from './BaseModal.vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['close', 'confirm']);

function closeModal() {
  emit('close');
}

function confirmDeletion() {
  emit('confirm');
  closeModal();
}
</script>

<style scoped>
/* Add any specific styles for DeleteModal here */
</style>