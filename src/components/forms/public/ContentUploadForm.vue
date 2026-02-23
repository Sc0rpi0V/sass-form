<template>
  <form @submit.prevent="onSubmit" class="form-container">
    <h2 class="form-title">Soumettre du contenu</h2>
    <p class="form-description">
      Envoyez un fichier ou du contenu. Notre équipe traitera votre demande rapidement.
    </p>

    <BaseInput
      id="lastName"
      label="Nom complet"
      :model-value="formData.lastName"
      placeholder="Votre nom"
      required
      :error="getError('lastName')"
      @update:model-value="handleInput('lastName', $event)"
      @blur="handleBlur('lastName')"
    />

    <BaseInput
      id="firstName"
      label="Prénom"
      :model-value="formData.firstName"
      placeholder="Votre prénom"
      required
      :error="getError('firstName')"
      @update:model-value="handleInput('firstName', $event)"
      @blur="handleBlur('firstName')"
    />

    <BaseInput
      id="email"
      type="email"
      label="Email"
      :model-value="formData.email"
      placeholder="votre@email.com"
      required
      :error="getError('email')"
      @update:model-value="handleInput('email', $event)"
      @blur="handleBlur('email')"
    />

    <div class="field">
      <label class="field-label">Type de soumission</label>
      <select
        class="field-control"
        :value="formData.category"
        @change="handleInput('category', $event.target.value)"
        @blur="handleBlur('category')"
      >
        <option value="">Choisir...</option>
        <option value="cv">Dépôt de CV</option>
        <option value="image">Upload image</option>
        <option value="document">Document</option>
        <option value="ticket">Ticket avec capture</option>
        <option value="ugc">Contenu utilisateur</option>
      </select>
      <span class="field-error">{{ getError('category') }}</span>
    </div>

    <BaseInput
      id="title"
      label="Titre"
      :model-value="formData.title"
      placeholder="Titre de la soumission"
      required
      :error="getError('title')"
      @update:model-value="handleInput('title', $event)"
      @blur="handleBlur('title')"
    />

    <BaseTextarea
      id="description"
      label="Description"
      :model-value="formData.description"
      placeholder="Décrivez votre soumission..."
      :rows="5"
      required
      :error="getError('description')"
      @update:model-value="handleInput('description', $event)"
      @blur="handleBlur('description')"
    />

    <div class="field">
      <label class="field-label">Fichier(s)</label>
      <input
        type="file"
        multiple
        class="field-control"
        @change="handleFileChange"
        @blur="handleBlur('files')"
      />
      <span class="field-help">
        Formats acceptés : PDF, JPG, PNG, DOCX (max 5MB par fichier)
      </span>
      <span class="field-error">{{ getError('files') }}</span>

      <ul v-if="formData.files.length" class="file-list">
        <li v-for="file in formData.files" :key="file.name">
          {{ file.name }} ({{ formatSize(file.size) }})
        </li>
      </ul>
    </div>

    <div v-for="item in legalItems" :key="item.key" class="legal-section">
      <BaseCheckbox
        :id="item.key"
        :label="item.label"
        :model-value="formData[item.key]"
        required
        :error="getError(item.key)"
        @update:model-value="handleInput(item.key, $event)"
        @blur="handleBlur(item.key)"
      />
      <BaseButton
        type="button"
        variant="outline"
        @click="openModal(item.key)"
      >
        {{ item.buttonLabel }}
      </BaseButton>
    </div>

    <component
      :is="activeModalComponent"
      v-if="activeModalComponent"
      @close="closeModal"
    />

    <div v-if="submitError" class="alert alert-error">
      {{ submitError }}
    </div>

    <div v-if="submitSuccess" class="alert alert-success">
      Votre contenu a bien été envoyé.
    </div>

    <div class="form-actions">
      <BaseButton type="submit" :loading="isSubmitting">
        Envoyer
      </BaseButton>

      <BaseButton type="button" variant="outline" @click="resetForm">
        Réinitialiser
      </BaseButton>
    </div>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useForm } from '@/composables/forms/useForm';
import { useSubmissions } from '@/composables/submissions/useSubmissions';
import { validators } from '@/utils/validators';

import BaseInput from '@/components/ui/base/BaseInput.vue';
import BaseTextarea from '@/components/ui/base/BaseTextarea.vue';
import BaseButton from '@/components/ui/base/BaseButton.vue';
import BaseCheckbox from '@/components/ui/base/BaseCheckbox.vue';

import CGUModal from '@/components/ui/modals/CGUModal.vue';
import CGVModal from '@/components/ui/modals/CGVModal.vue';
import PolicyModal from '@/components/ui/modals/PolicyModal.vue';

import { useCGU } from '@/composables/cgu/useCGU';
import { useCGV } from '@/composables/cgv/useCGV';
import { usePolicy } from '@/composables/policy/usePolicy';

const { activeVersion: activeCGU } = useCGU();
const { activeVersion: activeCGV } = useCGV();
const { activeVersion: activePolicy } = usePolicy();

const legalConfig = {
  cgu: {
    label: "J'accepte les conditions générales d'utilisation",
    buttonLabel: "Lire les CGU",
    modal: CGUModal,
    isActive: () => !!activeCGU.value
  },
  cgv: {
    label: "J'ai lu et j'accepte les conditions générales de vente",
    buttonLabel: "Lire les CGV",
    modal: CGVModal,
    isActive: () => !!activeCGV.value
  },
  policy: {
    label: "J'ai lu et j'accepte la politique de confidentialité",
    buttonLabel: "Lire la politique de confidentialité",
    modal: PolicyModal,
    isActive: () => !!activePolicy.value
  }
};

const legalItems = computed(() =>
  Object.entries(legalConfig)
    .filter(([, cfg]) => cfg.isActive())
    .map(([key, cfg]) => ({ key, ...cfg }))
);

const openModalKey = ref(null);
const openModal = (key) => (openModalKey.value = key);
const closeModal = () => (openModalKey.value = null);

const activeModalComponent = computed(() => {
  if (!openModalKey.value) return null;
  return legalConfig[openModalKey.value]?.modal ?? null;
});

const initialValues = {
  lastName: '',
  firstName: '',
  email: '',
  category: '',
  title: '',
  description: '',
  files: [],
  cgu: false,
  cgv: false,
  policy: false
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const fileValidator = (files) => {
  if (!files || !files.length) return 'Au moins un fichier est requis';
  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) return `Le fichier ${file.name} dépasse 5MB`;
  }
  return true;
};

const validationRules = {
  lastName: [validators.required, validators.minLength(2)],
  firstName: [validators.required, validators.minLength(2)],
  email: [validators.required, validators.email],
  category: [validators.required],
  title: [validators.required, validators.minLength(3)],
  description: [validators.required, validators.minLength(10)],
  files: [fileValidator],
  cgu: [validators.required],
  cgv: activeCGV.value ? [validators.required] : [],
  policy: activePolicy.value ? [validators.required] : []
};

const {
  formData,
  isSubmitting,
  submitError,
  submitSuccess,
  handleInput,
  handleBlur,
  handleSubmit,
  resetForm,
  getError
} = useForm(initialValues, validationRules, { persistKey: 'contentUploadForm' });

const { addSubmission } = useSubmissions();

const handleFileChange = (event) => {
  const files = Array.from(event.target.files);
  handleInput('files', files);
};

const formatSize = (bytes) => (bytes / 1024 / 1024).toFixed(2) + ' MB';

const fileToBase64 = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });

const onSubmit = () => {
  handleSubmit(async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const serializedFiles = await Promise.all(
      data.files.map(async file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        dataUrl: await fileToBase64(file)
      }))
    );

    addSubmission('contentUpload', {
      ...data,
      files: serializedFiles
    });
  });
};
</script>

<style scoped lang="scss">
@use '@/assets/styles/index' as *;

.form-container {
  @include card;
  max-width: 650px;
  margin: 0 auto;
}

.form-title {
  font-size: $font-size-2xl;
  font-weight: 600;
  margin-bottom: $spacing-sm;
}

.form-description {
  font-size: $font-size-sm;
  color: $color-text-light;
  margin-bottom: $spacing-2xl;
}

.field {
  margin-bottom: $spacing-lg;
}

.field-label {
  display: block;
  font-weight: 500;
  margin-bottom: $spacing-xs;
}

.field-control {
  width: 100%;
}

.field-help {
  font-size: $font-size-xs;
  color: $color-text-light;
}

.field-error {
  display: block;
  color: #991b1b;
  font-size: $font-size-xs;
}

.file-list {
  margin-top: $spacing-sm;
  padding-left: $spacing-md;
}

.form-actions {
  display: flex;
  gap: $spacing-md;
  margin-top: $spacing-2xl;
}

.alert {
  padding: $spacing-md;
  border-radius: $border-radius;
  margin-bottom: $spacing-lg;
  font-size: $font-size-sm;
}

.alert-error {
  background: #fef2f2;
  color: #991b1b;
  border: $border-width solid #fecaca;
}

.alert-success {
  background: #f0fdf4;
  color: #166534;
  border: $border-width solid #bbf7d0;
}

.legal-section {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;

  @include tablet {
    flex-direction: row;
    align-items: flex-start;
    gap: $spacing-md;
  }

  .view-cgu-btn {
    font-size: $font-size-sm;
    width: 100%;

    @include tablet {
      width: auto;
      margin-top: $spacing-xs;
    }
  }
}
</style>