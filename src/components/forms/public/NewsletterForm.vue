<template>
  <form @submit.prevent="onSubmit" class="form-container">
    <h2 class="form-title">Inscription à la newsletter</h2>
    <p class="form-description">
      Restez informé de nos dernières actualités et offres exclusives
    </p>

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

    <BaseCheckbox
      id="consent"
      label="J'accepte de recevoir des emails et je confirme avoir lu la politique de confidentialité"
      :model-value="formData.consent"
      required
      :error="getError('consent')"
      @update:model-value="handleInput('consent', $event)"
      @blur="handleBlur('consent')"
    />

    <div v-if="submitError" class="alert alert-error">
      {{ submitError }}
    </div>

    <div v-if="submitSuccess" class="alert alert-success">
      Merci pour votre inscription ! Vous allez recevoir un email de confirmation.
    </div>

    <div class="form-actions">
      <BaseButton type="submit" :loading="isSubmitting">
        S'inscrire à la newsletter
      </BaseButton>
      <BaseButton type="button" variant="outline" @click="resetForm">
        Réinitialiser
      </BaseButton>
    </div>
  </form>
</template>

<script setup>
import { useForm } from '@/composables/forms/useForm';
import { useSubmissions } from '@/composables/submissions/useSubmissions';
import { validators } from '@/utils/validators';
import BaseInput from '@/components/ui/base/BaseInput.vue';
import BaseCheckbox from '@/components/ui/base/BaseCheckbox.vue';
import BaseButton from '@/components/ui/base/BaseButton.vue';

const initialValues = {
  email: '',
  firstName: '',
  lastName: '',
  consent: false
};

const validationRules = {
  email: [validators.required, validators.email],
  firstName: [validators.required, validators.minLength(2)],
  consent: [validators.required]
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
    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Sauvegarder dans localStorage
    addSubmission('newsletter', data);

    console.log('Données newsletter soumises:', data);
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
</style>
