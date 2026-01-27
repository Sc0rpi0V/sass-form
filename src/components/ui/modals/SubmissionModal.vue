<template>
  <teleport to="body">
    <div class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <header class="modal-header">
          <h2>Détails de la soumission</h2>
        </header>

        <div class="modal-body">
          <template v-if="!showArchiveConfirm">
            <div
              v-for="(value, key) in filteredSubmission"
              :key="key"
              class="detail-row"
            >
              <strong>{{ formatLabel(key) }} :</strong>
              <span>{{ formatValue(value, key) }}</span>
            </div>

            <div v-if="isSurvey && submission.answers" class="survey-answers">
              <h3>Réponses au sondage</h3>

              <div
                v-for="(value, key) in submission.answers"
                :key="key"
                class="detail-row"
              >
                <strong>{{ formatSurveyQuestion(key) }} :</strong>

                <!-- Cas particulier : note -->
                <span v-if="key === 'q5'">
                  ⭐ {{ value }} / 5
                </span>

                <span v-else>
                  {{ value }}
                </span>
              </div>
            </div>
          </template>

          <template v-else>
            <p>
              Es-tu sûr de vouloir archiver cette demande ?
              Cette action est définitive.
            </p>
          </template>
        </div>

        <footer class="modal-footer">
          <template v-if="!showArchiveConfirm">
            <BaseButton
              variant="primary"
              @click="answer"
              :disabled="submission.status === 'answered'"
            >
              Répondre
            </BaseButton>

            <BaseButton
              variant="danger"
              @click="showArchiveConfirm = true"
            >
              Archiver
            </BaseButton>

            <BaseButton variant="outline" @click="close">
              Fermer
            </BaseButton>
          </template>

          <template v-else>
            <BaseButton
              variant="outline"
              @click="showArchiveConfirm = false"
            >
              Annuler
            </BaseButton>

            <BaseButton
              variant="danger"
              @click="confirmArchive"
            >
              Confirmer l’archivage
            </BaseButton>
          </template>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, computed } from 'vue';
import BaseButton from '@/components/ui/base/BaseButton.vue';

const showArchiveConfirm = ref(false);

const SENSITIVE_FIELDS = ['password', 'pwd', 'pass'];

const props = defineProps({
  submission: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'answer', 'archive']);

const close = () => emit('close');
const answer = () => emit('answer', props.submission);

const confirmArchive = () => {
  emit('archive', props.submission);
  showArchiveConfirm.value = false;
};

const isSurvey = computed(() => props.submission.formType === 'survey');

const filteredSubmission = computed(() => {
  const { answers, ...rest } = props.submission;
  return rest;
});

const formatLabel = (key) => {
  const labels = {
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'Email',
    formType: 'Type de formulaire',
    paymentMethod: 'Méthode de paiement',
    amount: 'Montant',
    submittedAt: 'Date de soumission',
    status: 'Statut',
    surveyTitle: 'Sondage'
  };

  return labels[key] || key;
};

const formatValue = (value, key) => {
  if (value == null) return '-';

  if (SENSITIVE_FIELDS.includes(key)) {
    return '••••••••';
  }

  if (key === 'submittedAt') {
    return new Date(value).toLocaleString('fr-FR');
  }

  if (key === 'status') {
    return {
      new: 'Nouvelle',
      answered: 'Répondue',
      archived: 'Archivée'
    }[value];
  }

  return value;
};

const formatSurveyQuestion = (key) => {
  const questions = {
    q1: 'Nom',
    q2: 'Prénom',
    q3: 'Email',
    q4: 'Profession',
    q5: 'Note',
    q6: 'Commentaire'
  };

  return questions[key] || key;
};
</script>

<style scoped lang="scss">
@use '@/assets/styles/index' as *;

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
}

.modal-content {
  background: $color-background;
  border-radius: $border-radius-lg;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: $shadow-lg;
}

.modal-header,
.modal-footer {
  padding: $spacing-lg;
  border-bottom: 1px solid $color-border;
}

.modal-footer {
  border-top: 1px solid $color-border;
  border-bottom: none;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

.modal-body {
  padding: $spacing-lg;
}

.detail-row {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: $spacing-md;
  margin-bottom: $spacing-sm;
  font-size: $font-size-sm;
}

.survey-answers {
  margin-top: $spacing-lg;
  padding-top: $spacing-md;
  border-top: 1px solid $color-border;

  h3 {
    margin-bottom: $spacing-md;
    font-size: 1rem;
    font-weight: 600;
  }
}
</style>
