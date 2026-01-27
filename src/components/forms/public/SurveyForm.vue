<template>
  <form @submit.prevent="onSubmit" class="form-container">
    <h2 class="form-title">{{ title }}</h2>
    <p v-if="description" class="form-description">
      {{ description }}
    </p>

    <template v-for="question in visibleQuestions" :key="question.id">
      <BaseInput
        v-if="question.type === 'text'"
        :id="question.id"
        :label="question.label"
        :required="question.required"
        :model-value="formData[question.id]"
        :error="getError(question.id)"
        @update:model-value="handleInput(question.id, $event)"
        @blur="handleBlur(question.id)"
      />

      <BaseInput
        v-if="question.type === 'email'"
        :id="question.id"
        :label="question.label"
        :required="question.required"
        :model-value="formData[question.id]"
        :error="getError(question.id)"
        @update:model-value="handleInput(question.id, $event)"
        @blur="handleBlur(question.id)"
      />

      <BaseTextarea
        v-else-if="question.type === 'textarea'"
        :id="question.id"
        :label="question.label"
        :required="question.required"
        :rows="question.rows || 4"
        :model-value="formData[question.id]"
        :error="getError(question.id)"
        @update:model-value="handleInput(question.id, $event)"
        @blur="handleBlur(question.id)"
      />

      <BaseSelect
        v-else-if="question.type === 'select'"
        :id="question.id"
        :label="question.label"
        :required="question.required"
        :options="question.options"
        :model-value="formData[question.id]"
        :error="getError(question.id)"
        @update:model-value="handleInput(question.id, $event)"
        @blur="handleBlur(question.id)"
      />

      <RatingScale
        v-else-if="question.type === 'rating'"
        :id="question.id"
        :label="question.label"
        :scale="question.scale || 5"
        :required="question.required"
        :model-value="formData[question.id]"
        :error="getError(question.id)"
        @update:model-value="handleInput(question.id, $event)"
      />
    </template>

    <div v-if="submitError" class="alert alert-error">
      {{ submitError }}
    </div>

    <div v-if="submitSuccess" class="alert alert-success">
      Merci pour votre participation.
    </div>

    <div class="form-actions">
      <BaseButton type="submit" :loading="isSubmitting">
        Envoyer
      </BaseButton>
    </div>
  </form>
</template>

<script setup>
import { computed } from 'vue';
import { useForm } from '@/composables/forms/useForm';
import { validators } from '@/utils/validators';
import { useSubmissions } from '@/composables/submissions/useSubmissions';

import BaseInput from '@/components/ui/base/BaseInput.vue';
import BaseTextarea from '@/components/ui/base/BaseTextarea.vue';
import BaseSelect from '@/components/ui/base/BaseSelect.vue';
import BaseButton from '@/components/ui/base/BaseButton.vue';
import RatingScale from '@/components/ui/base/BaseRatingScale.vue';

const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  questions: { type: Array, required: true }
});

const initialValues = Object.fromEntries(
  props.questions.map(q => [q.id, q.default ?? ''])
);

const validationRules = Object.fromEntries(
  props.questions.map(q => [
    q.id,
    q.required ? [validators.required] : []
  ])
);

const { addSubmission } = useSubmissions();

const {
  formData,
  isSubmitting,
  submitError,
  submitSuccess,
  handleInput,
  handleBlur,
  handleSubmit,
  getError
} = useForm(initialValues, validationRules);

const visibleQuestions = computed(() => {
  return props.questions.filter(q => {
    if (!q.conditions) return true;

    const value = formData[q.conditions.field];
    return value === q.conditions.equals;
  });
});

const onSubmit = () => {
  handleSubmit(async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    addSubmission('survey', {
      firstName: data.q2 ?? '',
      lastName: data.q1 ?? '',
      email: data.q3 ?? '',

      answers: data,
      surveyTitle: props.title
    });

    console.log('Résultats du sondage:', data);
  });
};
</script>

<style scoped lang="scss">
@use '@/assets/styles/index' as *;

.form-container {
  @include card;
  max-width: 640px;
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

:deep(.base-input),
:deep(.base-textarea),
:deep(.base-select),
:deep(.rating-scale) {
  margin-bottom: $spacing-xl;
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
