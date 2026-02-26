<template>
  <form @submit.prevent="onSubmit" class="search-form">
    <h2 class="form-title">Formulaire de recherche</h2>
    <p class="form-description">Utilisez les champs ci-dessous pour affiner votre recherche <br>
      <strong>Astuce :</strong> Cliquez sur "Comment ça marche ?" pour obtenir des conseils sur l'utilisation du formulaire.<br>
      <strong>Note :</strong> Plus vous fournissez de critères, plus les résultats seront précis.
    </p>
    <p class="form-description">
      <strong>Exemples de recherches :</strong><br>
      - Rechercher un article sur la technologie : "Intelligence Artificielle"<br>
      - Trouver un produit spécifique : "Smartphone Samsung Galaxy S21"<br>
      - Chercher des articles d'un auteur : "Articles de John Doe"
    </p>

    <div class="actions">
      <BaseButton
        v-for="(action, index) in actions"
        :key="index"
        type="button"
        variant="outline"
        @click="action.onClick"
      >
        {{ action.label }}
      </BaseButton>
    </div>

    <SearchHelpModal
      v-if="showHelpModal"
      @close="closeModal"
    />

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
      :error="getError('category')"
      @update:model-value="handleInput('category', $event)"
      @blur="handleBlur('category')"
    />

    <SearchAdvancedFilters
      v-if="showAdvanced"
      :form-data="formData"
      :sizes="sizes"
      :colors="colors"
      :authors="authors"
      @update="handleInput"
    />

    <div class="actions">
      <BaseButton
        v-for="(action, index) in actionsSearch"
        :key="index"
        :type="action.type || 'button'"
        :variant="action.variant"
        @click="action.onClick"
      >
        {{ action.label }}
      </BaseButton>
    </div>

    <SearchPreviewModal
      v-if="showPreviewModal"
      :form-data="formData"
      @close="showPreviewModal = false"
    />
  </form>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useSearchForm } from '@/composables/forms/useSearchForm';
import { useSearchApi } from '@/composables/forms/useSearchApi';

import BaseButton from '@/components/ui/base/BaseButton.vue';
import BaseSelect from '@/components/ui/base/BaseSelect.vue';
import AutocompleteInput from './AutocompleteInput.vue';
import SearchAdvancedFilters from './SearchAdvancedFilters.vue';
import SearchPreviewModal from '@/components/ui/modals/SearchPreviewModal.vue';
import SearchHelpModal from '@/components/ui/modals/SearchHelpModal.vue';

const actions = [
  {
    label: 'Comment ça marche ?',
    onClick: () => openModal()
  },
  {
    label: 'Recherche possible',
    onClick: () => showPreviewModal.value = true
  }
];

const toggleAdvanced = () => {
  handleBlur('category');

  if (getError('category')) {
    return;
  }

  showAdvanced.value = !showAdvanced.value;
};

const {
  formData,
  handleInput,
  handleBlur,
  resetForm,
  getError
} = useSearchForm();

const actionsSearch = [
  {
    label: 'Rechercher',
    type: 'submit'
  },
  {
    label: 'Filtres avancés',
    type: 'button',
    variant: 'outline',
    onClick: toggleAdvanced
  },
  {
    label: 'Réinitialiser',
    type: 'button',
    variant: 'outline',
    onClick: resetForm
  }
];

const emit = defineEmits(['search']);
const showAdvanced = ref(false);
const showPreviewModal = ref(false);

const {
  suggestions,
  categories,
  sizes,
  colors,
  authors,
  fetchSuggestions,
  fetchCategories,
  fetchFilterOptions
} = useSearchApi();

watch(() => formData.category, (newCat) => {
  fetchFilterOptions(newCat);
  ['size', 'color', 'author', 'dateCreation', 'orderBy'].forEach(f => handleInput(f, null));
});

onMounted(() => {
  fetchCategories();
});

const onSubmit = () => {
  emit('search', { ...formData });
};

const openModal = () => {
  showHelpModal.value = true;
};

const closeModal = () => {
  showHelpModal.value = false;
};

const showHelpModal = ref(false);
</script>


<style scoped lang="scss">
@use '@/assets/styles/index' as *;

.form-title {
  font-size: $font-size-2xl;
  font-weight: 600;
  color: $color-text;
  margin-bottom: $spacing-sm;
}

.form-description {
  font-size: $font-size-sm;
  color: $color-text-light;
  margin-bottom: $spacing-2xl;
}

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
