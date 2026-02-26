<template>
  <teleport to="body">
    <div class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <header class="modal-header">
          <h2>Comment utiliser la recherche</h2>
          <button
            class="modal-close"
            @click="close"
            aria-label="Fermer"
          >
            ×
          </button>
        </header>

        <div class="modal-body">
          <section class="help-section">
            <h3>🔎 Recherche principale</h3>
            <p>
              Saisissez un mot-clé pour rechercher un article, un produit ou un contenu spécifique.
              Des suggestions peuvent apparaître automatiquement pendant la saisie pour vous aider
              à trouver plus rapidement ce que vous cherchez.
            </p>
          </section>

          <section class="help-section">
            <h3>📂 Filtrer par catégorie</h3>
            <p>
              Sélectionnez une catégorie pour limiter les résultats à un domaine précis.
              Cela permet d'affiner la recherche et d'obtenir des résultats plus pertinents.
            </p>
          </section>

          <section class="help-section">
            <h3>⚙️ Filtres avancés</h3>
            <p>
              Activez les filtres avancés pour affiner encore plus vos résultats.
              Selon la catégorie sélectionnée, vous pourrez filtrer par :
            </p>
            <ul>
              <li>Taille</li>
              <li>Couleur</li>
              <li>Auteur</li>
              <li>Date de création</li>
              <li>Ordre de tri</li>
            </ul>
          </section>

          <section class="help-section">
            <h3>👁 Aperçu de la recherche</h3>
            <p>
              Le bouton <strong>Aperçu</strong> permet de visualiser les critères sélectionnés
              avant de lancer la recherche.
            </p>
          </section>

          <section class="help-section">
            <h3>♻️ Réinitialiser le formulaire</h3>
            <p>
              Utilisez le bouton <strong>Réinitialiser</strong> pour effacer tous les champs
              et repartir d'une recherche vide.
            </p>
          </section>
        </div>

        <footer class="modal-footer">
          <BaseButton
            variant="primary"
            @click="close"
          >
            J'ai compris
          </BaseButton>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import BaseButton from '@/components/ui/base/BaseButton.vue';

const emit = defineEmits(['close']);

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
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.help-section {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;

  h3 {
    margin: 0;
    font-size: $font-size-lg;
    color: $color-text;
  }

  p {
    margin: 0;
    font-size: $font-size-sm;
    color: $color-text;
    line-height: 1.6;
  }

  ul {
    margin: 0;
    padding-left: 1.2rem;
    font-size: $font-size-sm;
    color: $color-text;
    line-height: 1.6;
  }
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
