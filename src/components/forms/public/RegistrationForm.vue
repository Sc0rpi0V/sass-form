<template>
  <form @submit.prevent="onSubmit" class="form-container">
    <h2 class="form-title">Inscription</h2>

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
      id="lastName"
      label="Nom"
      :model-value="formData.lastName"
      placeholder="Votre nom"
      required
      :error="getError('lastName')"
      @update:model-value="handleInput('lastName', $event)"
      @blur="handleBlur('lastName')"
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

    <BaseInput
      id="phone"
      type="tel"
      label="Téléphone"
      :model-value="formData.phone"
      placeholder="06 12 34 56 78"
      required
      :error="getError('phone')"
      @update:model-value="handleInput('phone', $event)"
      @blur="handleBlur('phone')"
    />

    <BaseInput
      id="password"
      type="password"
      label="Mot de passe"
      :model-value="formData.password"
      placeholder="••••••••"
      required
      :error="getError('password')"
      @update:model-value="handleInput('password', $event)"
      @blur="handleBlur('password')"
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
      Inscription réussie ! Vous allez recevoir un email de confirmation.
    </div>

    <div class="form-actions">
      <BaseButton type="submit" :loading="isSubmitting">
        S'inscrire
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
import BaseCheckbox from '@/components/ui/base/BaseCheckbox.vue';
import BaseButton from '@/components/ui/base/BaseButton.vue';

import CGUModal from '@/components/ui/modals/CGUModal.vue';
import CGVModal from '@/components/ui/modals/CGVModal.vue';
import PolicyModal from '@/components/ui/modals/PolicyModal.vue';

import { useCGV } from '@/composables/cgv/useCGV';
import { useCGU } from '@/composables/cgu/useCGU';
import { usePolicy } from '@/composables/policy/usePolicy';

const { activeVersion: activeCGV } = useCGV();
const { activeVersion: activeCGU } = useCGU();
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

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  cgu: false,
  cgv: false,
  policy: false
};

const validationRules = {
  firstName: [validators.required, validators.minLength(2)],
  lastName: [validators.required, validators.minLength(2)],
  email: [validators.required, validators.email],
  phone: [validators.phone],
  password: [validators.required, validators.minLength(8)],
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
  persistKey: 'registration-form'
});

const { addSubmission } = useSubmissions();

const onSubmit = () => {
  handleSubmit(async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    addSubmission('registration', data);
    console.log('Données soumises:', data);
  });
};
</script>

<style scoped lang="scss">
@use '@/assets/styles/index' as *;

.form-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.alert {
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.alert-error {
  background-color: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.alert-success {
  background-color: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
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
