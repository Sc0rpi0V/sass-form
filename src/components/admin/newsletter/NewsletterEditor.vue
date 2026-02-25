<template>
  <div class="newsletter-editor">
    <div class="editor-header">
      <h2>
        {{ mode === 'create' ? 'Nouvelle version de la newsletter' : mode === 'edit' ? 'Éditer la version de la newsletter' : 'Détails de la version de la newsletter' }}
      </h2>
    </div>

    <div v-if="!version && mode !== 'create'" class="empty-state">
      <p>Sélectionnez une version pour la consulter ou l'éditer,</p>
      <p>ou créez une nouvelle version.</p>
    </div>

    <form v-else @submit.prevent="handleSave" class="editor-form">
      <div class="form-group">
        <BaseInput
          id="title"
          label="Titre (optionnel)"
          v-model="formData.title"
          placeholder="Newsletter"
          :disabled="mode === 'view'"
        />
        <p class="field-hint">Par défaut : "Newsletter"</p>
      </div>

      <div class="form-group">
        <BaseInput
          id="version"
          label="Version *"
          v-model="formData.version"
          placeholder="1.0"
          :error="errors.version"
          :disabled="mode === 'view'"
          required
        />
        <p class="field-hint">Format sémantique recommandé (ex: 1.0, 1.1, 2.0)</p>
      </div>

      <div class="form-group">
        <label for="content" class="form-label">
          Contenu *
          <span class="char-count" :class="{ 'is-valid': charCount >= 100 }">
            {{ charCount }} / 100 caractères minimum
          </span>
        </label>

        <div v-if="mode === 'view'" class="content-preview">
          <div class="preview-text">{{ formData.content }}</div>
        </div>

        <BaseTextarea
          v-else
          id="content"
          v-model="formData.content"
          :rows="25"
          placeholder="Saisissez le contenu de la newsletter..."
          :error="errors.content"
          required
        />
      </div>

      <!-- Toggle Preview en mode édition -->
      <div v-if="mode !== 'view' && formData.content" class="preview-toggle">
        <BaseButton
          type="button"
          variant="outline"
          @click="showPreview = !showPreview"
        >
          {{ showPreview ? 'Masquer l\'aperçu' : 'Aperçu du rendu' }}
        </BaseButton>
      </div>

      <div v-if="showPreview && mode !== 'view'" class="content-preview">
        <h3>Aperçu</h3>
        <div class="preview-text">{{ formData.content }}</div>
      </div>

      <div class="form-actions">
        <BaseButton
          v-if="mode !== 'view'"
          type="submit"
          variant="primary"
          :disabled="!isValid"
        >
          {{ mode === 'create' ? 'Créer la version' : 'Enregistrer les modifications' }}
        </BaseButton>

        <BaseButton
          type="button"
          variant="outline"
          @click="handleCancel"
        >
          {{ mode === 'view' ? 'Fermer' : 'Annuler' }}
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import BaseInput from '@/components/ui/base/BaseInput.vue';
import BaseTextarea from '@/components/ui/base/BaseTextarea.vue';
import BaseButton from '@/components/ui/base/BaseButton.vue';

const props = defineProps({
  version: {
    type: Object,
    default: null
  },
  mode: {
    type: String,
    default: 'view',
    validator: (value) => ['create', 'edit', 'view'].includes(value)
  }
});

const emit = defineEmits(['save', 'cancel']);

const formData = ref({
  title: '',
  version: '',
  content: ''
});

const errors = ref({
  version: '',
  content: ''
});

const showPreview = ref(false);

// Initialiser le formulaire quand la version change
watch(() => props.version, (newVersion) => {
  if (newVersion) {
    formData.value = {
      title: newVersion.title || '',
      version: newVersion.version || '',
      content: newVersion.content || ''
    };
  } else {
    formData.value = {
      title: '',
      version: '',
      content: ''
    };
  }
  errors.value = {
    version: '',
    content: ''
  };
  showPreview.value = false;
}, { immediate: true });

// Compteur de caractères
const charCount = computed(() => {
  return formData.value.content.length;
});

// Validation
const isValid = computed(() => {
  return formData.value.version.trim() !== '' && charCount.value >= 100;
});

const validate = () => {
  let valid = true;
  errors.value = {
    version: '',
    content: ''
  };

  if (!formData.value.version.trim()) {
    errors.value.version = 'La version est requise';
    valid = false;
  }

  if (charCount.value < 100) {
    errors.value.content = 'Le contenu doit contenir au moins 100 caractères';
    valid = false;
  }

  return valid;
};

const handleSave = () => {
  if (!validate()) {
    return;
  }

  emit('save', {
    title: formData.value.title.trim() || 'Newsletter',
    version: formData.value.version.trim(),
    content: formData.value.content.trim()
  });
};

const handleCancel = () => {
  emit('cancel');
};
</script>

<style scoped lang="scss">
@use '@/assets/styles/index' as *;

.newsletter-editor {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.editor-header {
  margin-bottom: $spacing-lg;

  h2 {
    font-size: $font-size-xl;
    font-weight: 700;
    color: $color-text;
    margin: 0;
  }
}

.empty-state {
  text-align: center;
  padding: $spacing-2xl;
  color: $color-text-light;

  p {
    margin: $spacing-sm 0;
  }
}

.editor-form {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.form-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: $font-size-sm;
  font-weight: 600;
  color: $color-text;
  margin-bottom: $spacing-xs;
}

.char-count {
  font-size: $font-size-xs;
  color: $color-danger;
  font-weight: 500;

  &.is-valid {
    color: $color-success;
  }
}

.field-hint {
  font-size: $font-size-xs;
  color: $color-text-light;
  margin: 0;
}

.preview-toggle {
  margin: $spacing-md 0;
}

.content-preview {
  @include card;
  background: $color-background-hover;
  max-height: 400px;
  overflow-y: auto;

  h3 {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $color-text;
    margin: 0 0 $spacing-md 0;
  }

  .preview-text {
    white-space: pre-wrap;
    line-height: 1.6;
    color: $color-text;
    font-size: $font-size-sm;
  }
}

.form-actions {
  display: flex;
  gap: $spacing-md;
  padding-top: $spacing-lg;
  border-top: 1px solid $color-border;
}
</style>
