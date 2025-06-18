<template>
  <div
    v-if="isVisible"
    class="modal-overlay"
  >
    <div class="modal-content">
      <div class="modal-header">
        <slot name="header">
          <!-- Default header content if none is provided -->
        </slot>
      </div>
      <div class="modal-body">
        <slot name="body">
          <!-- Default body content if none is provided -->
        </slot>
      </div>
      <div class="modal-footer">
        <slot name="footer">
          <!-- Default footer content if none is provided -->
        </slot>
      </div>
      <!-- Keep the default slot for backward compatibility -->
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close"]);

function emitClose() {
  emit("close");
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  overflow: hidden;
}

.modal-header {
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
