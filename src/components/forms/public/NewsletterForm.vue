<template>
  <form @submit.prevent="onSubmit" class="form-container">
    <h2 class="form-title">Inscription à la newsletter</h2>
    <p class="form-description">Restez informé de nos dernières actualités et offres exclusives</p>

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
      placeholder="Votre nom (optionnel)"
      :error="getError('lastName')"
      @update:model-value="handleInput('lastName', $event)"
      @blur="handleBlur('lastName')"
    />

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
      <BaseButton type="button" variant="outline" @click="openModal(item.key)">
        {{ item.buttonLabel }}
      </BaseButton>
    </div>

    <component :is="activeModalComponent" v-if="activeModalComponent" @close="closeModal" />

    <div v-if="submitError" class="alert alert-error">
      {{ submitError }}
    </div>

    <div v-if="submitSuccess" class="alert alert-success">
      Merci pour votre inscription ! Vous allez recevoir un email de confirmation.
    </div>

    <div class="form-actions">
      <BaseButton type="submit" :loading="isSubmitting">S'inscrire à la newsletter</BaseButton>
      <BaseButton type="button" variant="outline" @click="resetForm">Réinitialiser</BaseButton>
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
import { useCGU } from '@/composables/manager/useCGU';
import { useCGV } from '@/composables/manager/useCGV';
import { usePolicy } from '@/composables/manager/usePolicy';

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
  Object.entries(legalConfig).filter(([, cfg]) => cfg.isActive()).map(([key, cfg]) => ({ key, ...cfg }))
);

const openModalKey = ref(null);
const openModal = (key) => { openModalKey.value = key; };
const closeModal = () => { openModalKey.value = null; };
const activeModalComponent = computed(() => openModalKey.value ? legalConfig[openModalKey.value]?.modal ?? null : null);

const initialValues = { 
  email: '', 
  firstName: '', 
  lastName: '', 
  cgu: false, 
  cgv: false, 
  policy: false 
};
const validationRules = { 
  email: [validators.required, validators.email], 
  firstName: [validators.required, validators.minLength(2)], 
  lastName: [validators.required, validators.minLength(2)],
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
} = useForm(initialValues, validationRules, { persistKey: 'newsletter-form' });
const { addSubmission } = useSubmissions();

const onSubmit = () => {
  handleSubmit(async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    addSubmission('newsletter', data);
    console.log('Newsletter soumise:', data);
  });
};
</script>

<style scoped lang="scss">
@use '@/assets/styles/index' as *;

.form-container {
  @include card;
  max-width: 500px;
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
