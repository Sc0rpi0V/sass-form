<template>
  <div class="base-range-input-wrapper">
    <label v-if="label" class="input-label">{{ label }}</label>

    <div class="range-row">
      <span class="range-label">Min</span>
      <input
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="modelValueMin"
        class="range-field"
        @input="$emit('update:modelValueMin', Number($event.target.value))"
      />
      <span class="range-value">{{ modelValueMin }} €</span>
    </div>

    <div class="range-row">
      <span class="range-label">Max</span>
      <input
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="modelValueMax"
        class="range-field"
        @input="$emit('update:modelValueMax', Number($event.target.value))"
      />
      <span class="range-value">{{ modelValueMax }} €</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    default: null
  },
  label: {
    type: String,
    default: null
  },
  modelValueMin: {
    type: Number,
    default: 0
  },
  modelValueMax: {
    type: Number,
    default: 1000
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 1000
  },
  step: {
    type: Number,
    default: 1
  }
});

defineEmits(['update:modelValueMin', 'update:modelValueMax']);
</script>

<style scoped lang="scss">
@use '@/assets/styles/index' as *;

.base-range-input-wrapper {
  @include form-field;
}

.input-label {
  @include label-base;
}

.range-row {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin-top: $spacing-xs;
}

.range-label {
  font-size: $font-size-sm;
  color: $color-text-light;
  width: 2rem;
  flex-shrink: 0;
}

.range-field {
  flex: 1;
  accent-color: $color-primary;
  cursor: pointer;
}

.range-value {
  font-size: $font-size-sm;
  color: $color-text;
  width: 4rem;
  text-align: right;
  flex-shrink: 0;
}
</style>
