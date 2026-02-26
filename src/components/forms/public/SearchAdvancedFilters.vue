<template>
  <div class="advanced-filters">
    <template v-if="formData.category === 'produit'">
      <BaseRangeInput
        id="price-range"
        label="Prix"
        :model-value-min="formData.priceMin ?? 0"
        :model-value-max="formData.priceMax ?? 1000"
        :min="0"
        :max="1000"
        :step="1"
        @update:model-value-min="update('priceMin', $event)"
        @update:model-value-max="update('priceMax', $event)"
      />

      <BaseSelect
        id="size"
        label="Taille"
        :options="sizes"
        :model-value="formData.size"
        @update:model-value="update('size', $event)"
      />

      <BaseSelect
        id="color"
        label="Couleur"
        :options="colors"
        :model-value="formData.color"
        @update:model-value="update('color', $event)"
      />
    </template>

    <template v-else-if="formData.category === 'article'">
      <BaseSelect
        id="author"
        label="Auteur"
        :options="authors"
        :model-value="formData.author"
        @update:model-value="update('author', $event)"
      />

      <BaseInput
        id="dateCreation"
        type="date"
        label="Date de création"
        :model-value="formData.dateCreation"
        @update:model-value="update('dateCreation', $event)"
      />
    </template>

    <BaseSelect
      v-if="formData.category"
      id="orderBy"
      label="Trier par"
      :options="orderOptions"
      :model-value="formData.orderBy"
      @update:model-value="update('orderBy', $event)"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import BaseInput from '@/components/ui/base/BaseInput.vue';
import BaseSelect from '@/components/ui/base/BaseSelect.vue';
import BaseRangeInput from '@/components/ui/base/BaseRangeInput.vue';

const props = defineProps({
  formData: {
    type: Object,
    required: true
  },
  sizes: {
    type: Array,
    default: () => []
  },
  colors: {
    type: Array,
    default: () => []
  },
  authors: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update']);

const update = (field, value) => {
  emit('update', field, value);
};

const orderOptions = computed(() => {
  if (props.formData.category === 'produit') {
    return [
      { label: 'Date', value: 'date' },
      { label: 'Prix', value: 'prix' },
      { label: 'Taille', value: 'taille' },
      { label: 'Couleur', value: 'couleur' }
    ];
  }
  if (props.formData.category === 'article') {
    return [
      { label: 'Date de création', value: 'date_creation' },
      { label: 'Date de modification', value: 'date_modification' },
      { label: 'Auteur', value: 'auteur' }
    ];
  }
  return [];
});
</script>
