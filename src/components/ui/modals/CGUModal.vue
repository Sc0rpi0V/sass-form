<template>
  <teleport to="body">
    <div class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <header class="modal-header">
          <h2>{{ cguTitle }}</h2>
          <button
            class="modal-close"
            @click="close"
            aria-label="Fermer"
          >
            ×
          </button>
        </header>

        <div class="modal-body">
          <!-- Si aucune CGU active -->
          <div v-if="!activeVersion" class="no-cgu">
            <p>Aucune version des CGU n'est actuellement disponible.</p>
          </div>

          <!-- Si CGU active disponible -->
          <div v-else class="cgu-content">
            <!-- Métadonnées -->
            <div class="cgu-metadata">
              <span class="badge">Version {{ activeVersion.version }}</span>
              <span class="metadata-date">
                Dernière modification : {{ formatDate(activeVersion.lastModified) }}
              </span>
            </div>

            <!-- Contenu -->
            <div class="cgu-text">
              {{ activeVersion.content }}
            </div>
          </div>
        </div>

        <footer class="modal-footer">
          <BaseButton
            variant="primary"
            @click="close"
          >
            J'ai lu
          </BaseButton>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue';
import { useCGU } from '@/composables/manager/useCGU';
import BaseButton from '@/components/ui/base/BaseButton.vue';

const emit = defineEmits(['close']);

const { activeVersion } = useCGU();

const cguTitle = computed(() => {
  return activeVersion.value?.title || 'Conditions Générales d\'Utilisation';
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

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
}

.no-cgu {
  text-align: center;
  padding: $spacing-2xl;
  color: $color-text-light;

  p {
    margin: 0;
    font-size: $font-size-base;
  }
}

.cgu-content {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.cgu-metadata {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  flex-wrap: wrap;
  padding-bottom: $spacing-md;
  border-bottom: 1px solid $color-border;
}

.badge {
  display: inline-block;
  padding: $spacing-xs $spacing-sm;
  background: $color-primary;
  color: white;
  border-radius: $border-radius-sm;
  font-size: $font-size-xs;
  font-weight: 600;
  text-transform: uppercase;
}

.metadata-date {
  font-size: $font-size-sm;
  color: $color-text-light;
}

.cgu-text {
  white-space: pre-wrap;
  line-height: 1.6;
  color: $color-text;
  font-size: $font-size-sm;
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
