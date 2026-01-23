<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="['base-button', variant, { loading }]"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="spinner"></span>
    <slot v-else />
  </button>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'button'
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline', 'danger'].includes(value)
  },
  disabled: Boolean,
  loading: Boolean
});

defineEmits(['click']);
</script>

<style scoped>
.base-button {
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.5rem;
}

.base-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.base-button.primary {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.base-button.primary:hover:not(:disabled) {
  background-color: #2563eb;
  border-color: #2563eb;
}

.base-button.secondary {
  background-color: #6b7280;
  color: white;
  border-color: #6b7280;
}

.base-button.secondary:hover:not(:disabled) {
  background-color: #4b5563;
  border-color: #4b5563;
}

.base-button.outline {
  background-color: white;
  color: #3b82f6;
  border-color: #3b82f6;
}

.base-button.outline:hover:not(:disabled) {
  background-color: #eff6ff;
}

.base-button.danger {
  background-color: #ef4444;
  color: white;
  border-color: #ef4444;
}

.base-button.danger:hover:not(:disabled) {
  background-color: #dc2626;
  border-color: #dc2626;
}

.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>