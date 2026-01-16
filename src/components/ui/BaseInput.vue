<template>
  <div class="base-input-wrapper">
    <label v-if="label" :for="id" class="input-label">
      {{ label }}
      <span v-if="required" class="required-indicator">*</span>
    </label>

    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :class="['input-field', { 'has-error': error }]"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur')"
    />

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
  type: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'email', 'password', 'tel', 'url', 'number'].includes(value)
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
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

.base-input-wrapper {
  @include form-field;
}

.input-label {
  @include label-base;
}

.input-field {
  @include input-base;
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
}
</style>
