<template>
  <div class="autocomplete">
    <BaseInput
      :id="id"
      :label="label"
      :model-value="modelValue"
      :placeholder="placeholder"
      @update:model-value="onInput"
    />

    <ul v-if="suggestions.length" class="suggestions">
      <li
        v-for="item in suggestions"
        :key="item.id"
        @click="select(item)"
      >
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import BaseInput from '@/components/ui/base/BaseInput.vue';

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  modelValue: String,
  label: String,
  placeholder: String,
  suggestions: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:model-value', 'search']);

const onInput = (value) => {
  emit('update:model-value', value);
  emit('search', value);
};

const select = (item) => {
  emit('update:model-value', item.label);
};
</script>
