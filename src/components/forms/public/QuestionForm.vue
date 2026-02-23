<template>
  <form @submit.prevent="onSubmit" class="form-container">
    <h2 class="form-title">Poser une question</h2>

    <p class="form-description">
      Vous avez une question spécifique ? Remplissez ce formulaire et notre équipe vous répondra rapidement.
    </p>

    <BaseInput
      id="name"
      label="Nom"
      :model-value="formData.name"
      placeholder="Votre nom"
      required
      :error="getError('name')"
      @update:model-value="handleInput('name', $event)"
      @blur="handleBlur('name')"
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

    <BaseSelect
      id="category"
      label="Catégorie"
      :model-value="formData.category"
      placeholder="Choisissez une catégorie"
      :options="categoryOptions"
      required
      :error="getError('category')"
      @update:model-value="handleInput('category', $event)"
      @blur="handleBlur('category')"
    />

    <BaseTextarea
      id="question"
      label="Votre question"
      :model-value="formData.question"
      placeholder="Posez votre question ici..."
      required
      :rows="6"
      :error="getError('question')"
      @update:model-value="handleInput('question', $event)"
      @blur="handleBlur('question')"
    />

    <div
      v-for="item in legalItems"
      :key="item.key"
      class="legal-section"
    >
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
      Merci pour votre question ! Nous vous répondrons par email dans les plus brefs délais.
    </div>

    <div class="form-actions">
      <BaseButton type="submit" :loading="isSubmitting">
        Envoyer la question
      </BaseButton>

      <BaseButton type="button" variant="outline" @click="resetForm">
        Réinitialiser
      </BaseButton>
    </div>
  </form>
</template>

<script setup>
import { computed, ref } from 'vue';

import { useForm } from '@/composables/forms/useForm';
import { useSubmissions } from '@/composables/submissions/useSubmissions';
import { validators } from '@/utils/validators';

import BaseInput from '@/components/ui/base/BaseInput.vue';
import BaseSelect from '@/components/ui/base/BaseSelect.vue';
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
    buttonLabel: 'Lire les CGU',
    modal: CGUModal,
    isActive: () => !!activeCGU.value
  },
  cgv: {
    label: "J'ai lu et j'accepte les conditions générales de vente",
    buttonLabel: 'Lire les CGV',
    modal: CGVModal,
    isActive: () => !!activeCGV.value
  },
  policy: {
    label: "J'ai lu et j'accepte la politique de confidentialité",
    buttonLabel: 'Lire la politique de confidentialité',
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

const openModal = (key) => {
  openModalKey.value = key;
};

const closeModal = () => {
  openModalKey.value = null;
};

const activeModalComponent = computed(() => {
  if (!openModalKey.value) return null;
  return legalConfig[openModalKey.value]?.modal ?? null;
});

const categoryOptions = [
  { value: 'technical', label: 'Question technique' },
  { value: 'commercial', label: 'Question commerciale' },
  { value: 'support', label: 'Support' },
  { value: 'other', label: 'Autre' }
];

const initialValues = {
  name: '',
  email: '',
  category: '',
  question: '',
  cgu: false,
  cgv: false,
  policy: false
};

const validationRules = {
  name: [validators.required, validators.minLength(2)],
  email: [validators.required, validators.email],
  category: [validators.required],
  question: [validators.required, validators.minLength(10)],
  cgu: legalConfig.cgu.isActive() ? [validators.required] : [],
  cgv: legalConfig.cgv.isActive() ? [validators.required] : [],
  policy: legalConfig.policy.isActive() ? [validators.required] : []
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
} = useForm(initialValues, validationRules, {
  persistKey: 'question-form'
});

const { addSubmission } = useSubmissions();

const onSubmit = () => {
  handleSubmit(async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    addSubmission('question', data);
    console.log('Question soumise:', data);
  });
};
</script>

<style scoped lang="scss">
@use '@/assets/styles/index' as *;

.form-container {
  @include card;
  max-width: 600px;
  margin: 0 auto;
}

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

.form-actions {
  display: flex;
  gap: $spacing-md;
  margin-top: $spacing-2xl;
  flex-wrap: wrap;

  @include tablet {
    flex-wrap: nowrap;
  }
}

.alert {
  padding: $spacing-md;
  border-radius: $border-radius;
  margin-bottom: $spacing-lg;
  font-size: $font-size-sm;
}

.alert-error {
  background-color: #fef2f2;
  color: #991b1b;
  border: $border-width solid #fecaca;
}

.alert-success {
  background-color: #f0fdf4;
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
}
</style>
