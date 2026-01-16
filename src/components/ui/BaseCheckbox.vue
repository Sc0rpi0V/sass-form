<template>
  <div class="base-checkbox-wrapper">
    <div class="checkbox-container">
      <input
        :id="id"
        type="checkbox"
        :checked="modelValue"
        :disabled="disabled"
        :required="required"
        class="checkbox-input"
        @change="$emit('update:modelValue', $event.target.checked)"
        @blur="$emit('blur')"
      />
      <label :for="id" class="checkbox-label">
        {{ label }}
        <span v-if="required" class="required-indicator">*</span>
      </label>
    </div>

    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  modelValue: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  }
});

defineEmits(['update:modelValue', 'blur']);
</script>

<style scoped lang="scss">
@use '@/assets/styles/index' as *;

.base-checkbox-wrapper {
  @include form-field;
}

.checkbox-container {
  display: flex;
  align-items: flex-start;
  gap: $spacing-md;
}

.checkbox-input {
  width: 1.125rem;
  height: 1.125rem;
  margin-top: 0.125rem;
  border: $border-width solid $color-border;
  border-radius: $border-radius-sm;
  cursor: pointer;
  transition: all $transition-speed $transition-timing;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    border-color: $color-primary;
  }

  &:focus {
    outline: none;
    border-color: $color-primary;
    box-shadow: 0 0 0 3px rgba($color-primary, 0.1);
  }

  &:checked {
    background-color: $color-primary;
    border-color: $color-primary;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}

.checkbox-label {
  font-size: $font-size-sm;
  color: $color-text;
  cursor: pointer;
  user-select: none;
  line-height: 1.5;
  flex: 1;

  input:disabled + & {
    cursor: not-allowed;
    opacity: 0.6;
  }
}

.required-indicator {
  color: $color-error;
  margin-left: $spacing-xs;
}

.error-message {
  display: block;
  margin-top: $spacing-sm;
  font-size: $font-size-sm;
  color: $color-error;
  margin-left: calc(1.125rem + #{$spacing-md});
}
</style>
