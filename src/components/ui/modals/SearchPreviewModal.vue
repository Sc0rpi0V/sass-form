<template>
  <teleport to="body">
    <div class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <header class="modal-header">
          <h2>Aperçu des résultats</h2>
          <button
            class="modal-close"
            @click="close"
            aria-label="Fermer"
          >
            ×
          </button>
        </header>

        <div class="modal-body">
          <div v-if="isLoadingPreview" class="loading">
            Chargement...
          </div>

          <template v-else>
            <div class="preview-section">
              <h3>Produits</h3>
              <ul v-if="previewResults.products.length" class="preview-list">
                <li
                  v-for="product in previewResults.products"
                  :key="product.id"
                  class="preview-item"
                >
                  <span class="preview-item-name">{{ product.nom }}</span>
                  <span class="preview-item-meta">{{ product.prix }} € · {{ product.marque }}</span>
                </li>
              </ul>
              <p v-else class="no-results">Aucun produit trouvé.</p>
            </div>

            <div class="preview-section">
              <h3>Articles</h3>
              <ul v-if="previewResults.articles.length" class="preview-list">
                <li
                  v-for="article in previewResults.articles"
                  :key="article.id"
                  class="preview-item"
                >
                  <span class="preview-item-name">{{ article.titre }}</span>
                  <span class="preview-item-meta">{{ article.auteur }}</span>
                </li>
              </ul>
              <p v-else class="no-results">Aucun article trouvé.</p>
            </div>
          </template>
        </div>

        <footer class="modal-footer">
          <BaseButton variant="primary" @click="close">
            Fermer
          </BaseButton>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useSearchApi } from '@/composables/forms/useSearchApi';
import BaseButton from '@/components/ui/base/BaseButton.vue';

const props = defineProps({
  formData: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close']);

const { previewResults, isLoadingPreview, searchPreview } = useSearchApi();

const close = () => {
  emit('close');
};

const handleKeydown = (e) => {
  if (e.key === 'Escape') {
    close();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
  document.body.style.overflow = 'hidden';
  searchPreview(props.formData);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  document.body.style.overflow = '';
});
</script>

<style scoped lang="scss">
@use '@/assets/styles/index' as *;

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  padding: $spacing-lg;
}

.modal-content {
  background: $color-background;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-lg;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-lg;
  border-bottom: 1px solid $color-border;
  flex-shrink: 0;

  h2 {
    font-size: $font-size-xl;
    font-weight: 700;
    color: $color-text;
    margin: 0;
    padding-right: $spacing-md;
  }
}

.modal-close {
  background: none;
  border: none;
  font-size: 2rem;
  color: $color-text-light;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $border-radius-sm;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: $color-background-hover;
    color: $color-text;
  }
}

.modal-body {
  padding: $spacing-lg;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.loading {
  text-align: center;
  padding: $spacing-2xl;
  color: $color-text-light;
}

.preview-section {
  h3 {
    font-size: $font-size-base;
    font-weight: 600;
    color: $color-text;
    margin: 0 0 $spacing-sm;
  }
}

.preview-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.preview-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-sm $spacing-md;
  background: $color-background-hover;
  border-radius: $border-radius-sm;
  gap: $spacing-md;
}

.preview-item-name {
  font-size: $font-size-sm;
  color: $color-text;
  font-weight: 500;
}

.preview-item-meta {
  font-size: $font-size-sm;
  color: $color-text-light;
  flex-shrink: 0;
}

.no-results {
  font-size: $font-size-sm;
  color: $color-text-light;
  margin: 0;
  padding: $spacing-sm 0;
}

.modal-footer {
  display: flex;
  gap: $spacing-md;
  padding: $spacing-lg;
  border-top: 1px solid $color-border;
  justify-content: flex-end;
  flex-shrink: 0;
}
</style>
