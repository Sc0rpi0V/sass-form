<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const isHomePage = computed(() => route.path === '/');
</script>

<template>
  <div id="app">
    <header class="app-header">
      <div class="container">
        <RouterLink to="/" class="logo-link">
          <h1 class="app-title">Forms Starter Pack</h1>
        </RouterLink>
        <p class="app-subtitle">Starter Pack</p>
      </div>
    </header>

    <nav v-if="!isHomePage" class="app-nav">
      <div class="container">
        <RouterLink to="/" class="nav-back">← Retour à l'accueil</RouterLink>
      </div>
    </nav>

    <main class="app-main">
      <div class="container">
        <RouterView />
      </div>
    </main>

    <footer class="app-footer">
      <div class="container">
        <p class="footer-text">
          © 2025 Forms Starter Pack -
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/index' as *;
@use 'sass:color';

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(135deg, $color-primary 0%, color.adjust($color-primary, $lightness: -10%) 100%);
  color: white;
  padding: $spacing-xl 0;
  box-shadow: $shadow-md;
}

.logo-link {
  text-decoration: none;
  color: inherit;
  display: inline-block;

  &:hover .app-title {
    opacity: 0.9;
  }
}

.app-title {
  font-size: $font-size-2xl;
  font-weight: 700;
  margin: 0;
  color: white;

  @include tablet {
    font-size: $font-size-3xl;
  }
}

.app-subtitle {
  font-size: $font-size-sm;
  margin: 0;
  opacity: 0.9;
  font-weight: 400;
  margin-top: $spacing-xs;
}

.app-nav {
  background: white;
  padding: $spacing-lg 0;
  border-bottom: 1px solid $color-border;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: $shadow-sm;
}

.nav-back {
  color: $color-primary;
  text-decoration: none;
  font-size: $font-size-sm;
  font-weight: 500;
  transition: color $transition-speed $transition-timing;

  &:hover {
    color: color.adjust($color-primary, $lightness: -10%);
  }
}

.app-main {
  flex: 1;
  padding: $spacing-2xl 0;
}

.app-footer {
  background: #f9fafb;
  padding: $spacing-xl 0;
  border-top: 1px solid $color-border;
  margin-top: auto;
}

.footer-text {
  text-align: center;
  font-size: $font-size-sm;
  color: $color-text-light;
  margin: 0;

  a {
    color: $color-primary;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
