<template>
  <form @submit.prevent="onSubmit" class="form-container">
    <h2 class="form-title">Nous contacter</h2>
    <p class="form-description">
      Vous avez une question ? N'hésitez pas à nous contacter, nous vous répondrons dans les plus brefs délais.
    </p>

    <BaseInput
      id="name"
      label="Nom complet"
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

    <BaseInput
      id="phone"
      type="tel"
      label="Téléphone"
      :model-value="formData.phone"
      placeholder="06 12 34 56 78 (optionnel)"
      :error="getError('phone')"
      @update:model-value="handleInput('phone', $event)"
      @blur="handleBlur('phone')"
    />

    <BaseInput
      id="subject"
      label="Sujet"
      :model-value="formData.subject"
      placeholder="Objet de votre message"
      required
      :error="getError('subject')"
      @update:model-value="handleInput('subject', $event)"
      @blur="handleBlur('subject')"
    />

    <BaseTextarea
      id="message"
      label="Message"
      :model-value="formData.message"
      placeholder="Votre message..."
      required
      :rows="6"
      :error="getError('message')"
      @update:model-value="handleInput('message', $event)"
      @blur="handleBlur('message')"
    />

    <div v-if="submitError" class="alert alert-error">
      {{ submitError }}
    </div>

    <div v-if="submitSuccess" class="alert alert-success">
      Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.
    </div>

    <div class="form-actions">
      <BaseButton type="submit" :loading="isSubmitting">
        Envoyer le message
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
import BaseTextarea from '@/components/ui/base/BaseTextarea.vue';
import BaseButton from '@/components/ui/base/BaseButton.vue';

const initialValues = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
};

const validationRules = {
  name: [validators.required, validators.minLength(2)],
  email: [validators.required, validators.email],
  phone: [validators.phone],
  subject: [validators.required, validators.minLength(3)],
  message: [validators.required, validators.minLength(20)]
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
} = useForm(initialValues, validationRules, { persistKey: 'contact-form' });

const { addSubmission } = useSubmissions();

const onSubmit = () => {
  handleSubmit(async (data) => {
    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Sauvegarder dans localStorage
    addSubmission('contact', data);

    console.log('Données contact soumises:', data);
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
</style>
