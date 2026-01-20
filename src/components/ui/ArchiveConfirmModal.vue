<template>
  <teleport to="body">
    <div class="modal-overlay" @click.self="cancel">
      <div class="modal-content">
        <header class="modal-header">
          <h2>Archiver la demande</h2>
        </header>

        <div class="modal-body">
          <p>
            Es-tu sûr de vouloir archiver cette demande ?
            Cette action est définitive.
          </p>
        </div>

        <footer class="modal-footer">
          <BaseButton variant="outline" @click="cancel">
            Annuler
          </BaseButton>
          <BaseButton variant="danger" @click="confirm">
            Confirmer l’archivage
          </BaseButton>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import BaseButton from '@/components/ui/BaseButton.vue';

const emit = defineEmits(['confirm', 'cancel']);

const confirm = () => emit('confirm');
const cancel = () => emit('cancel');
</script>
