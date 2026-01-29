<template>
  <div class="advanced-filters">
    <BaseInput
      id="priceMin"
      type="number"
      label="Prix min"
      :model-value="formData.priceMin"
      @update:model-value="update('priceMin', $event)"
    />

    <BaseInput
      id="priceMax"
      type="number"
      label="Prix max"
      :model-value="formData.priceMax"
      @update:model-value="update('priceMax', $event)"
    />

    <BaseSelect
      id="orderBy"
      label="Trier par"
      :options="orderOptions"
      :model-value="formData.orderBy"
      @update:model-value="update('orderBy', $event)"
    />
  </div>
</template>

<script setup>
import BaseInput from '@/components/ui/base/BaseInput.vue';
import BaseSelect from '@/components/ui/base/BaseSelect.vue';

defineProps({
  formData: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update']);

const update = (field, value) => {
  emit('update', field, value);
};

const orderOptions = [
  { label: 'Date', value: 'date' },
  { label: 'Popularité', value: 'popularity' },
  { label: 'Prix', value: 'price' }
];
</script>
