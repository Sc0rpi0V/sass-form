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

    <BaseCheckbox
      id="terms"
      label="J'accepte les conditions générales d'utilisation"
      :model-value="formData.terms"
      required
      :error="getError('terms')"
      @update:model-value="handleInput('terms', $event)"
      @blur="handleBlur('terms')"
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
import { useForm } from '@/composables/useForm';
import { useSubmissions } from '@/composables/submissions/useSubmissions';
import { validators } from '@/utils/validators';
import BaseInput from '@/components/ui/base/BaseInput.vue';
import BaseCheckbox from '@/components/ui/base/BaseCheckbox.vue';
import BaseButton from '@/components/ui/base/BaseButton.vue';

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  terms: false
};

const validationRules = {
  firstName: [validators.required, validators.minLength(2)],
  lastName: [validators.required, validators.minLength(2)],
  email: [validators.required, validators.email],
  phone: [validators.phone],
  password: [validators.required, validators.minLength(8)],
  terms: [validators.required]
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
} = useForm(initialValues, validationRules, { persistKey: 'registration-form' });

const { addSubmission } = useSubmissions();

const onSubmit = () => {
  handleSubmit(async (data) => {
    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Sauvegarder dans localStorage
    addSubmission('registration', data);

    console.log('Données soumises:', data);
  });
};
</script>

<style scoped>
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
</style>