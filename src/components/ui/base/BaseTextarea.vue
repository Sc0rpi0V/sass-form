<template>
  <div class="base-textarea-wrapper">
    <label v-if="label" :for="id" class="textarea-label">
      {{ label }}
      <span v-if="required" class="required-indicator">*</span>
    </label>

    <textarea
      :id="id"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :rows="rows"
      :class="['textarea-field', { 'has-error': error }]"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur')"
    ></textarea>

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
    type: String,
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
  },
  rows: {
    type: Number,
    default: 4
  }
});

defineEmits(['update:modelValue', 'blur']);
</script>

<style scoped lang="scss">
@use '@/assets/styles/index' as *;

.base-textarea-wrapper {
  @include form-field;
}

.textarea-label {
  @include label-base;
}

.textarea-field {
  @include input-base;
  resize: vertical;
  min-height: 100px;
  font-family: $font-family-base;
  line-height: 1.5;
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
