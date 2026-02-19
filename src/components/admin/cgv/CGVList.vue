<template>
  <div class="cgv-list">
    <div class="list-header">
      <h2>Versions CGV</h2>
      <p class="version-count">{{ versions.length }} version(s)</p>
    </div>

    <div v-if="versions.length === 0" class="empty-state">
      <p>Aucune version de CGV.</p>
      <p>Créez la première version pour commencer.</p>
    </div>

    <div v-else class="versions-grid">
      <div
        v-for="version in sortedVersions"
        :key="version.id"
        class="version-card"
        :class="{ 'is-active': version.isActive }"
      >
        <div class="card-header">
          <h3 class="version-title">{{ version.title }}</h3>
          <span
            v-if="version.isActive"
            class="badge badge-active"
          >
            Active
          </span>
        </div>

        <div class="card-body">
          <p class="version-number">Version {{ version.version }}</p>
          <p class="version-date">
            Créée le {{ formatDate(version.createdAt) }}
          </p>
          <p v-if="version.lastModified !== version.createdAt" class="version-modified">
            Modifiée le {{ formatDate(version.lastModified) }}
          </p>
        </div>

        <div class="card-actions">
          <BaseButton
            variant="primary"
            size="sm"
            @click="$emit('select', version)"
          >
            Voir / Éditer
          </BaseButton>

          <BaseButton
            v-if="!version.isActive"
            variant="success"
            size="sm"
            @click="$emit('activate', version.id)"
          >
            Activer
          </BaseButton>

          <BaseButton
            variant="danger"
            size="sm"
            @click="$emit('delete', version.id)"
            :disabled="version.isActive"
            :title="version.isActive ? 'Impossible de supprimer la version active' : 'Supprimer cette version'"
          >
            Supprimer
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import BaseButton from '@/components/ui/base/BaseButton.vue';

const props = defineProps({
  versions: {
    type: Array,
    required: true
  },
  activeVersionId: {
    type: String,
    default: null
  }
});

defineEmits(['select', 'activate', 'delete']);

const sortedVersions = computed(() => {
  return [...props.versions].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>

<style scoped lang="scss">
@use '@/assets/styles/index' as *;

.cgv-list {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.list-header {
  margin-bottom: $spacing-lg;

  h2 {
    font-size: $font-size-xl;
    font-weight: 700;
    color: $color-text;
    margin: 0 0 $spacing-xs 0;
  }

  .version-count {
    font-size: $font-size-sm;
    color: $color-text-light;
    margin: 0;
  }
}

.empty-state {
  text-align: center;
  padding: $spacing-2xl;
  color: $color-text-light;

  p {
    margin: $spacing-sm 0;
  }
}

.versions-grid {
  display: grid;
  gap: $spacing-lg;
  grid-template-columns: 1fr;

  @include tablet {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

.version-card {
  @include card;
  border: 2px solid $color-border;
  transition: all 0.2s ease;

  &.is-active {
    border-color: $color-primary;
    background: rgba($color-primary, 0.05);
  }

  &:hover {
    box-shadow: $shadow-md;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: $spacing-md;
  margin-bottom: $spacing-md;

  .version-title {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $color-text;
    margin: 0;
    flex: 1;
  }
}

.badge {
  display: inline-block;
  padding: $spacing-xs $spacing-sm;
  border-radius: $border-radius-sm;
  font-size: $font-size-xs;
  font-weight: 600;
  text-transform: uppercase;

  &.badge-active {
    background: $color-primary;
    color: white;
  }
}

.card-body {
  margin-bottom: $spacing-lg;

  p {
    margin: $spacing-xs 0;
    font-size: $font-size-sm;
    color: $color-text-light;
  }

  .version-number {
    font-weight: 600;
    color: $color-text;
  }
}

.card-actions {
  display: flex;
  gap: $spacing-sm;
  flex-wrap: wrap;
}
</style>
