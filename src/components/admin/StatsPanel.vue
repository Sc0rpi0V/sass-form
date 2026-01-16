<template>
  <div class="stats-panel">
    <div class="stat-card">
      <div class="stat-icon">📧</div>
      <div class="stat-value">{{ stats.total }}</div>
      <div class="stat-label">Total soumissions</div>
    </div>

    <div class="stat-card">
      <div class="stat-icon">📝</div>
      <div class="stat-value">{{ stats.byType.contact || 0 }}</div>
      <div class="stat-label">{{ (stats.byType.contact || 0) > 1 ? 'Contacts' : 'Contact' }}</div>
    </div>

    <div class="stat-card">
      <div class="stat-icon">👤</div>
      <div class="stat-value">{{ stats.byType.registration || 0 }}</div>
      <div class="stat-label">{{ (stats.byType.registration || 0) > 1 ? 'Inscriptions' : 'Inscription' }}</div>
    </div>

    <div class="stat-card">
      <div class="stat-icon">📬</div>
      <div class="stat-value">{{ stats.byType.newsletter || 0 }}</div>
      <div class="stat-label">{{ (stats.byType.newsletter || 0) > 1 ? 'Newsletter' : 'Newsletter' }}</div>
    </div>

    <div class="stat-card">
      <div class="stat-icon">❓</div>
      <div class="stat-value">{{ stats.byType.question || 0 }}</div>
      <div class="stat-label">{{ (stats.byType.question || 0) > 1 ? 'Questions' : 'Question' }}</div>
    </div>

    <div class="stat-card">
      <div class="stat-icon">🚀</div>
      <div class="stat-value">{{ stats.byType.project || 0 }}</div>
      <div class="stat-label">{{ (stats.byType.project || 0) > 1 ? 'Projets' : 'Projet' }}</div>
    </div>

    <div class="stat-card">
      <div class="stat-icon">💳</div>
      <div class="stat-value">{{ stats.byType.payment || 0 }}</div>
      <div class="stat-label">{{ (stats.byType.payment || 0) > 1 ? 'Paiements' : 'Paiement' }}</div>
    </div>

    <div class="stat-card stat-card-highlight">
      <div class="stat-icon">📅</div>
      <div class="stat-value">{{ stats.thisMonth }}</div>
      <div class="stat-label">Ce mois-ci</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stats: {
    type: Object,
    required: true,
    default: () => ({
      total: 0,
      thisMonth: 0,
      byType: {}
    })
  }
});
</script>

<style scoped lang="scss">
@use '@/assets/styles/index' as *;

.stats-panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: $spacing-lg;
  margin-bottom: $spacing-2xl;

  @include tablet {
    grid-template-columns: repeat(3, 1fr);
  }

  @include desktop {
    grid-template-columns: repeat(4, 1fr);
  }
}

.stat-card {
  background: $color-background;
  border-radius: $border-radius-lg;
  padding: $spacing-xl;
  box-shadow: $shadow-sm;
  text-align: center;
  transition: transform $transition-speed $transition-timing, box-shadow $transition-speed $transition-timing;

  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-md;
  }
}

.stat-card-highlight {
  background: linear-gradient(135deg, $color-primary 0%, #2563eb 100%);
  color: white;

  .stat-label {
    color: rgba(255, 255, 255, 0.9);
  }
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: $spacing-sm;
}

.stat-value {
  font-size: $font-size-4xl;
  font-weight: 700;
  color: $color-text;
  margin-bottom: $spacing-xs;

  .stat-card-highlight & {
    color: white;
  }
}

.stat-label {
  font-size: $font-size-sm;
  color: $color-text-light;
  font-weight: 500;
}
</style>
