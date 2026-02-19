<template>
  <div class="admin-layout">
    <AdminSidebar />
    <div class="admin-content">
      <!-- Header -->
      <header class="cgv-header">
        <div class="container">
          <div class="header-content">
            <h1 class="page-title">Gestion des CGV</h1>
            <BaseButton
              variant="primary"
              @click="createNewVersion"
            >
              + Nouvelle version
            </BaseButton>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="cgv-main">
        <div class="container">
          <!-- Notification si aucune version active -->
          <div v-if="!activeVersion && versions.length > 0" class="notification warning">
            <strong>Attention :</strong> Aucune version de CGV n'est actuellement active. Les utilisateurs ne pourront pas consulter les CGV sur le formulaire d'inscription.
          </div>

          <!-- Layout deux colonnes -->
          <div class="cgv-layout">
            <!-- Colonne gauche : Liste des versions -->
            <div class="cgv-sidebar">
              <CGVList
                :versions="versions"
                :active-version-id="activeVersionId"
                @select="selectVersion"
                @activate="activateVersion"
                @delete="confirmDelete"
              />
            </div>

            <!-- Colonne droite : Éditeur -->
            <div class="cgv-content">
              <CGVEditor
                :version="selectedVersion"
                :mode="editorMode"
                @save="saveVersion"
                @cancel="cancelEdit"
              />
            </div>
          </div>
        </div>
      </main>

      <!-- Modal de confirmation de suppression -->
      <teleport to="body">
        <div
          v-if="showDeleteConfirm"
          class="modal-overlay"
          @click.self="cancelDelete"
        >
          <div class="modal-content">
            <header class="modal-header">
              <h2>Confirmer la suppression</h2>
              <button
                class="modal-close"
                @click="cancelDelete"
                aria-label="Fermer"
              >
                ×
              </button>
            </header>

            <div class="modal-body">
              <p>Êtes-vous sûr de vouloir supprimer cette version de CGV ?</p>
              <p><strong>Cette action est irréversible.</strong></p>
            </div>

            <footer class="modal-footer">
              <BaseButton
                variant="danger"
                @click="deleteVersion"
              >
                Supprimer
              </BaseButton>
              <BaseButton
                variant="outline"
                @click="cancelDelete"
              >
                Annuler
              </BaseButton>
            </footer>
          </div>
        </div>
      </teleport>

      <!-- Modal d'erreur -->
      <teleport to="body">
        <div
          v-if="errorMessage"
          class="modal-overlay"
          @click.self="clearError"
        >
          <div class="modal-content modal-error">
            <header class="modal-header">
              <h2>Erreur</h2>
              <button
                class="modal-close"
                @click="clearError"
                aria-label="Fermer"
              >
                ×
              </button>
            </header>

            <div class="modal-body">
              <p>{{ errorMessage }}</p>
            </div>

            <footer class="modal-footer">
              <BaseButton
                variant="primary"
                @click="clearError"
              >
                OK
              </BaseButton>
            </footer>
          </div>
        </div>
      </teleport>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCGV } from '@/composables/cgv/useCGV';

import AdminSidebar from '@/components/admin/sidebar/AdminSidebar.vue';
import CGVList from '@/components/admin/cgv/CGVList.vue';
import CGVEditor from '@/components/admin/cgv/CGVEditor.vue';
import BaseButton from '@/components/ui/base/BaseButton.vue';

/* -----------------------
   DATA
----------------------- */
const {
  versions,
  activeVersion,
  getVersionById,
  addVersion,
  updateVersion,
  setActiveVersion,
  deleteVersion: deleteCGVVersion
} = useCGV();

/* -----------------------
   STATE
----------------------- */
const selectedVersion = ref(null);
const editorMode = ref('view'); // 'view' | 'edit' | 'create'
const showDeleteConfirm = ref(false);
const versionToDelete = ref(null);
const errorMessage = ref('');

/* -----------------------
   COMPUTED
----------------------- */
const activeVersionId = computed(() => {
  return activeVersion.value?.id || null;
});

/* -----------------------
   ACTIONS
----------------------- */
const createNewVersion = () => {
  selectedVersion.value = null;
  editorMode.value = 'create';
};

const selectVersion = (version) => {
  selectedVersion.value = version;
  editorMode.value = 'view';
};

const saveVersion = (versionData) => {
  try {
    if (editorMode.value === 'create') {
      // Créer nouvelle version
      const newVersion = addVersion(versionData);
      selectedVersion.value = newVersion;
      editorMode.value = 'view';
    } else if (editorMode.value === 'edit') {
      // Mettre à jour version existante
      updateVersion(selectedVersion.value.id, versionData);
      selectedVersion.value = getVersionById(selectedVersion.value.id);
      editorMode.value = 'view';
    }
  } catch (error) {
    errorMessage.value = error.message;
  }
};

const cancelEdit = () => {
  if (editorMode.value === 'create') {
    selectedVersion.value = null;
    editorMode.value = 'view';
  } else if (editorMode.value === 'edit') {
    editorMode.value = 'view';
  }
};

const activateVersion = (id) => {
  try {
    setActiveVersion(id);
    // Rafraîchir la version sélectionnée si c'est celle activée
    if (selectedVersion.value?.id === id) {
      selectedVersion.value = getVersionById(id);
    }
  } catch (error) {
    errorMessage.value = error.message;
  }
};

const confirmDelete = (id) => {
  versionToDelete.value = id;
  showDeleteConfirm.value = true;
};

const deleteVersion = () => {
  try {
    deleteCGVVersion(versionToDelete.value);

    // Si on supprime la version sélectionnée, réinitialiser l'éditeur
    if (selectedVersion.value?.id === versionToDelete.value) {
      selectedVersion.value = null;
      editorMode.value = 'view';
    }

    showDeleteConfirm.value = false;
    versionToDelete.value = null;
  } catch (error) {
    showDeleteConfirm.value = false;
    versionToDelete.value = null;
    errorMessage.value = error.message;
  }
};

const cancelDelete = () => {
  showDeleteConfirm.value = false;
  versionToDelete.value = null;
};

const clearError = () => {
  errorMessage.value = '';
};

// Gestion ESC pour fermer les modals
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (showDeleteConfirm.value) {
      cancelDelete();
    }
    if (errorMessage.value) {
      clearError();
    }
  }
});
</script>

<style scoped lang="scss">
@use '@/assets/styles/index' as *;

.admin-layout {
  display: flex;
  min-height: 100vh;
}

.admin-content {
  flex: 1;
  margin-left: 250px;
  background: #f3f4f6;

  @include tablet {
    margin-left: 0;
  }
}

.cgv-header {
  background: $color-background;
  border-bottom: 1px solid $color-border;
  padding: $spacing-xl 0;
  box-shadow: $shadow-sm;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: $spacing-lg;
  flex-wrap: wrap;
}

.page-title {
  font-size: $font-size-3xl;
  font-weight: 700;
  color: $color-text;
  margin: 0;

  @include tablet {
    font-size: $font-size-4xl;
  }
}

.cgv-main {
  padding: $spacing-2xl 0;
}

.notification {
  @include card;
  padding: $spacing-lg;
  margin-bottom: $spacing-xl;
  border-left: 4px solid $color-warning;
  background: rgba($color-warning, 0.1);

  strong {
    color: $color-warning;
  }

  &.warning {
    border-left-color: $color-warning;
  }
}

.cgv-layout {
  display: grid;
  gap: $spacing-xl;
  grid-template-columns: 1fr;

  @include tablet {
    grid-template-columns: 1fr 2fr;
  }
}

.cgv-sidebar,
.cgv-content {
  @include card;
  min-height: 400px;
}

/* -----------------------
   MODALS
----------------------- */
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
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-lg;
  border-bottom: 1px solid $color-border;

  h2 {
    font-size: $font-size-xl;
    font-weight: 700;
    color: $color-text;
    margin: 0;
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

  &:hover {
    background: $color-background-hover;
    color: $color-text;
  }
}

.modal-body {
  padding: $spacing-lg;

  p {
    margin: $spacing-sm 0;
    color: $color-text;
  }
}

.modal-footer {
  display: flex;
  gap: $spacing-md;
  padding: $spacing-lg;
  border-top: 1px solid $color-border;
  justify-content: flex-end;
}
</style>
