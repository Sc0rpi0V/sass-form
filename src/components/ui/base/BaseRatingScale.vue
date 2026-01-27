<template>
  <div class="rating-scale">
    <label :for="id" class="rating-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>

    <div class="rating-items" role="radiogroup">
      <button
        v-for="value in scale"
        :key="value"
        type="button"
        class="rating-item"
        :class="{ 'is-active': modelValue === value }"
        :aria-checked="modelValue === value"
        role="radio"
        @click="select(value)"
      >
        {{ value }}
      </button>
    </div>

    <p v-if="error" class="rating-error">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  modelValue: {
    type: Number,
    default: null
  },
  scale: {
    type: Number,
    default: 5
  },
  required: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

const select = (value) => {
  emit('update:modelValue', value);
};
</script>

<style scoped lang="scss">
@use '@/assets/styles/index' as *;

.rating-scale {
  display: flex;
  flex-direction: column;
}

.rating-label {
  font-size: $font-size-sm;
  font-weight: 500;
  color: $color-text;
  margin-bottom: $spacing-sm;
}

.required {
  color: #991b1b;
  margin-left: 2px;
}

.rating-items {
  display: flex;
  gap: $spacing-sm;
}

.rating-item {
  width: 40px;
  height: 40px;
  border-radius: $border-radius;
  border: $border-width solid $color-border;
  background-color: #ffffff;
  color: $color-text;
  font-size: $font-size-sm;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #f9fafb;
  }

  &.is-active {
    background-color: $color-primary;
    border-color: $color-primary;
    color: #fff;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px rgba($color-primary, 0.4);
  }
}

.rating-error {
  margin-top: $spacing-xs;
  font-size: $font-size-xs;
  color: #991b1b;
}
</style>
