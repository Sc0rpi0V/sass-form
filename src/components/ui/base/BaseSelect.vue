<template>
  <div class="base-select-wrapper">
    <label v-if="label" :for="id" class="select-label">
      {{ label }}
      <span v-if="required" class="required-indicator">*</span>
    </label>

    <select
      :id="id"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      :class="['select-field', { 'has-error': error }]"
      @change="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur')"
    >
      <option value="" disabled>{{ placeholder || 'Sélectionnez une option' }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>

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
    type: [String, Number],
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(option =>
        typeof option === 'object' &&
        'value' in option &&
        'label' in option
      );
    }
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

.base-select-wrapper {
  @include form-field;
}

.select-label {
  @include label-base;
}

.select-field {
  @include input-base;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right $spacing-md center;
  padding-right: $spacing-3xl;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
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
}
</style>
