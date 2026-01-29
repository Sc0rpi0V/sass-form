<template>
  <div class="home-view">
    <div class="hero-section">
      <h1 class="hero-title">Forms Starter Pack</h1>
      <p class="hero-subtitle">
        Collection de formulaires prêts à l'emploi avec validation complète et sauvegarde automatique
      </p>
    </div>

    <div class="forms-grid">
      <RouterLink to="/inscription" class="form-card">
        <div class="card-icon">📝</div>
        <h3 class="card-title">Inscription</h3>
        <p class="card-description">
          Formulaire d'inscription utilisateur complet avec validation des champs et gestion des erreurs
        </p>
        <span class="card-link">Accéder au formulaire →</span>
      </RouterLink>

      <RouterLink to="/contact" class="form-card">
        <div class="card-icon">📧</div>
        <h3 class="card-title">Contact</h3>
        <p class="card-description">
          Formulaire de demande de renseignement avec champs sujet et message
        </p>
        <span class="card-link">Accéder au formulaire →</span>
      </RouterLink>

      <RouterLink to="/newsletter" class="form-card">
        <div class="card-icon">📬</div>
        <h3 class="card-title">Newsletter</h3>
        <p class="card-description">
          Inscription rapide à la newsletter avec consentement RGPD
        </p>
        <span class="card-link">Accéder au formulaire →</span>
      </RouterLink>

      <RouterLink to="/question" class="form-card">
        <div class="card-icon">❓</div>
        <h3 class="card-title">Poser une question</h3>
        <p class="card-description">
          Formulaire de questions avec catégorisation pour un support efficace
        </p>
        <span class="card-link">Accéder au formulaire →</span>
      </RouterLink>

      <RouterLink to="/projet" class="form-card">
        <div class="card-icon">🚀</div>
        <h3 class="card-title">Demande de projet</h3>
        <p class="card-description">
          Formulaire détaillé pour une demande de projet avec budget et timeline
        </p>
        <span class="card-link">Accéder au formulaire →</span>
      </RouterLink>

      <RouterLink to="/paiement" class="form-card">
        <div class="card-icon">💳</div>
        <h3 class="card-title">Paiement</h3>
        <p class="card-description">
          Formulaire détaillé pour une demande de paiement
        </p>
        <span class="card-link">Accéder au formulaire →</span>
      </RouterLink>

      <RouterLink to="/sondage" class="form-card">
        <div class="card-icon">📊</div>
        <h3 class="card-title">Sondage</h3>
        <p class="card-description">
          Formulaire de sondage avec échelle d'évaluation et questions ouvertes
        </p>
        <span class="card-link">Accéder au formulaire →</span>
      </RouterLink>

      <RouterLink to="/recherche" class="form-card">
        <div class="card-icon">📊</div>
        <h3 class="card-title">Recherche</h3>
        <p class="card-description">
          Formulaire de recherche avancée avec suggestions et filtres
        </p>
        <span class="card-link">Accéder au formulaire →</span>
      </RouterLink>
    </div>

    <div class="features-section">
      <h2 class="features-title">Fonctionnalités incluses</h2>
      <div class="features-grid">
        <div class="feature-item">
          <div class="feature-icon">✓</div>
          <h4>Validation en temps réel</h4>
          <p>Validation progressive des champs avec messages d'erreur clairs</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">💾</div>
          <h4>Sauvegarde automatique</h4>
          <p>LocalStorage persistence pour éviter la perte de données</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">🎨</div>
          <h4>Design responsive</h4>
          <p>S'adapte parfaitement à tous les écrans (mobile, tablette, desktop)</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">⚡</div>
          <h4>Composants réutilisables</h4>
          <p>BaseInput, BaseTextarea, BaseSelect, BaseCheckbox prêts à l'emploi</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>

<style scoped lang="scss">
@use '@/assets/styles/index' as *;

.home-view {
  padding: $spacing-2xl 0;
}

.hero-section {
  text-align: center;
  margin-bottom: $spacing-3xl;
  padding: $spacing-2xl 0;
}

.hero-title {
  font-size: $font-size-4xl;
  font-weight: 700;
  color: $color-text;
  margin-bottom: $spacing-lg;

  @include tablet {
    font-size: 3rem;
  }
}

.hero-subtitle {
  font-size: $font-size-lg;
  color: $color-text-light;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}

.forms-grid {
  display: grid;
  gap: $spacing-xl;
  margin-bottom: $spacing-3xl;

  @include tablet {
    grid-template-columns: repeat(2, 1fr);
  }

  @include desktop {
    grid-template-columns: repeat(3, 1fr);
  }
}

.form-card {
  @include card;
  display: flex;
  flex-direction: column;
  transition: all $transition-speed $transition-timing;
  text-decoration: none;
  color: inherit;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-lg;
    border-color: $color-primary;

    .card-link {
      color: $color-primary;
    }
  }

  &:focus {
    outline: 2px solid $color-primary;
    outline-offset: 2px;
  }
}

.card-icon {
  font-size: 3rem;
  margin-bottom: $spacing-lg;
}

.card-title {
  font-size: $font-size-xl;
  font-weight: 600;
  color: $color-text;
  margin-bottom: $spacing-sm;
}

.card-description {
  font-size: $font-size-sm;
  color: $color-text-light;
  line-height: 1.6;
  margin-bottom: $spacing-lg;
  flex: 1;
}

.card-link {
  font-size: $font-size-sm;
  font-weight: 500;
  color: $color-text-light;
  transition: color $transition-speed $transition-timing;
}

.features-section {
  margin-top: $spacing-3xl;
  padding-top: $spacing-3xl;
  border-top: 1px solid $color-border;
}

.features-title {
  font-size: $font-size-2xl;
  font-weight: 600;
  color: $color-text;
  text-align: center;
  margin-bottom: $spacing-2xl;
}

.features-grid {
  display: grid;
  gap: $spacing-xl;

  @include tablet {
    grid-template-columns: repeat(2, 1fr);
  }

  @include desktop {
    grid-template-columns: repeat(4, 1fr);
  }
}

.feature-item {
  text-align: center;
  padding: $spacing-xl;
}

.feature-icon {
  font-size: 2rem;
  color: $color-primary;
  margin-bottom: $spacing-md;
  font-weight: 700;
}

.feature-item h4 {
  font-size: $font-size-lg;
  font-weight: 600;
  color: $color-text;
  margin-bottom: $spacing-sm;
}

.feature-item p {
  font-size: $font-size-sm;
  color: $color-text-light;
  line-height: 1.5;
}
</style>
