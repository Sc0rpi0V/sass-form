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
import { useForm } from '@/composables/useForm';
import { useSubmissions } from '@/composables/submissions/useSubmissions';
import { validators } from '@/utils/validators';
import BaseInput from '@/components/ui/base/BaseInput.vue';
import BaseSelect from '@/components/ui/base/BaseSelect.vue';
import BaseTextarea from '@/components/ui/base/BaseTextarea.vue';
import BaseButton from '@/components/ui/base/BaseButton.vue';

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
  question: ''
};

const validationRules = {
  name: [validators.required, validators.minLength(2)],
  email: [validators.required, validators.email],
  category: [validators.required],
  question: [validators.required, validators.minLength(10)]
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
} = useForm(initialValues, validationRules, { persistKey: 'question-form' });

const { addSubmission } = useSubmissions();

const onSubmit = () => {
  handleSubmit(async (data) => {
    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Sauvegarder dans localStorage
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
</style>
