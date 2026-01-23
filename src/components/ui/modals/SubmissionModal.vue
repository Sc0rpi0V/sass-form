<template>
  <teleport to="body">
    <div class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <header class="modal-header">
          <h2>Détails de la soumission</h2>
        </header>

        <div class="modal-body">
        <!-- Vue détails -->
        <template v-if="!showArchiveConfirm">
            <div
            v-for="(value, key) in submission"
            :key="key"
            class="detail-row"
            >
            <strong>{{ formatLabel(key) }} :</strong>
            <span>{{ formatValue(value, key) }}</span>
            </div>
        </template>

        <!-- Vue confirmation archivage -->
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
import BaseButton from '@/components/ui/base/BaseButton.vue';
import { ref } from 'vue';

const showArchiveConfirm = ref(false);

const SENSITIVE_FIELDS = ['password', 'pwd', 'pass'];

const props = defineProps({
  submission: {
    type: Object,
    required: true
  }
});

const confirmArchive = () => {
  emit('archive', props.submission);
  showArchiveConfirm.value = false;
};

const emit = defineEmits(['close', 'answer', 'archive']);

const close = () => emit('close');

const answer = () => emit('answer', props.submission);

const archive = () => emit('archive', props.submission);

const formatLabel = (key) => {
  const labels = {
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'Email',
    password: 'Mot de passe',
    formType: 'Type de formulaire',
    paymentMethod: 'Méthode de paiement',
    amount: 'Montant',
    submittedAt: 'Date de soumission',
    status: 'Statut'
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
</style>
