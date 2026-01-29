<template>
  <form @submit.prevent="onSubmit" class="search-form">
    <AutocompleteInput
      id="search"
      label="Recherche"
      placeholder="Rechercher un article, produit..."
      :model-value="formData.search"
      :suggestions="suggestions"
      @update:model-value="handleInput('search', $event)"
      @search="fetchSuggestions"
    />

    <BaseSelect
      id="category"
      label="Catégorie"
      :options="categories"
      :model-value="formData.category"
      @update:model-value="handleInput('category', $event)"
    />

    <SearchAdvancedFilters
      v-if="showAdvanced"
      :form-data="formData"
      @update="handleInput"
    />

    <div class="actions">
      <BaseButton type="submit">
        Rechercher
      </BaseButton>

      <BaseButton
        type="button"
        variant="outline"
        @click="toggleAdvanced"
      >
        Filtres avancés
      </BaseButton>

      <BaseButton 
        type="button" 
        variant="outline" 
        @click="resetForm"
      >
        Réinitialiser
      </BaseButton>
    </div>
  </form>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useSearchForm } from '@/composables/forms/useSearchForm';
import { useSearchApi } from '@/composables/forms/useSearchApi';

import BaseButton from '@/components/ui/base/BaseButton.vue';
import BaseSelect from '@/components/ui/base/BaseSelect.vue';
import AutocompleteInput from './AutocompleteInput.vue';
import SearchAdvancedFilters from './SearchAdvancedFilters.vue';

const emit = defineEmits(['search']);
const showAdvanced = ref(false);

const toggleAdvanced = () => {
  showAdvanced.value = !showAdvanced.value;
};

const { formData, handleInput, resetForm } = useSearchForm();
const {
  suggestions,
  categories,
  fetchSuggestions,
  fetchCategories
} = useSearchApi();

onMounted(() => {
  fetchCategories();
});

const onSubmit = () => {
  emit('search', { ...formData });
};
</script>


<style scoped>
.search-form {
  display: grid;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 0.5rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
</style>