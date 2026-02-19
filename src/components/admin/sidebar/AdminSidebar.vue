<template>
  <aside class="admin-sidebar" :class="{ 'is-open': isOpen }">
    <button
      class="hamburger-btn"
      @click="toggleSidebar"
      aria-label="Toggle menu"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>

    <!-- Overlay for mobile -->
    <div
      v-if="isOpen"
      class="sidebar-overlay"
      @click="closeSidebar"
    ></div>

    <nav class="sidebar-nav" :class="{ 'is-open': isOpen }">
      <div class="sidebar-header">
        <h2 class="sidebar-title">Admin</h2>
      </div>

      <ul class="sidebar-menu">
        <li>
          <router-link
            to="/admin/dashboard"
            class="menu-item"
            :class="{ 'is-active': isActive('/admin/dashboard') }"
            @click="closeSidebar"
          >
            <span class="menu-icon">📋</span>
            <span class="menu-label">Soumissions</span>
          </router-link>
        </li>
        <li>
          <router-link
            to="/admin/cgu"
            class="menu-item"
            :class="{ 'is-active': isActive('/admin/cgu') }"
            @click="closeSidebar"
          >
            <span class="menu-icon">📜</span>
            <span class="menu-label">CGU</span>
          </router-link>
        </li>
        <li>
          <router-link
            to="/admin/cgv"
            class="menu-item"
            :class="{ 'is-active': isActive('/admin/cgv') }"
            @click="closeSidebar"
          >
            <span class="menu-icon">💰</span>
            <span class="menu-label">CGV</span>
          </router-link>
        </li>
        <li>
          <router-link
            to="/admin/policy"
            class="menu-item"
            :class="{ 'is-active': isActive('/admin/policy') }"
            @click="closeSidebar"
          >
            <span class="menu-icon">📄</span>
            <span class="menu-label">Politique de confidentialité</span>
          </router-link>
        </li>
      </ul>

      <div class="sidebar-footer">
        <BaseButton
          variant="outline"
          @click="handleLogout"
          class="logout-btn"
        >
          Déconnexion
        </BaseButton>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from '@/composables/auth/useAuth';
import BaseButton from '@/components/ui/base/BaseButton.vue';

const router = useRouter();
const route = useRoute();
const { logout } = useAuth();

const isOpen = ref(false);

const isActive = (path) => {
  return route.path === path;
};

const toggleSidebar = () => {
  isOpen.value = !isOpen.value;
};

const closeSidebar = () => {
  isOpen.value = false;
};

const handleLogout = () => {
  logout();
  router.push('/admin/login');
  closeSidebar();
};
</script>

<style scoped lang="scss">
@use '@/assets/styles/index' as *;

.admin-sidebar {
  position: relative;
}

.hamburger-btn {
  position: fixed;
  top: $spacing-lg;
  left: $spacing-lg;
  z-index: 1200;
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: $color-background;
  border: 1px solid $color-border;
  border-radius: $border-radius-md;
  padding: $spacing-sm;
  cursor: pointer;
  transition: all 0.3s ease;

  @include tablet {
    display: none;
  }

  span {
    display: block;
    width: 20px;
    height: 2px;
    background: $color-text;
    border-radius: 2px;
    transition: all 0.3s ease;
  }

  &:hover {
    background: $color-background-hover;
  }
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1100;

  @include tablet {
    display: none;
  }
}

.sidebar-nav {
  position: fixed;
  top: 0;
  left: -250px;
  width: 250px;
  height: 100vh;
  background: $color-background;
  border-right: 1px solid $color-border;
  display: flex;
  flex-direction: column;
  transition: left 0.3s ease;
  z-index: 1150;

  @include tablet {
    left: 0;
  }

  &.is-open {
    left: 0;
  }
}

.sidebar-header {
  padding: $spacing-xl $spacing-lg;
  border-bottom: 1px solid $color-border;
}

.sidebar-title {
  font-size: $font-size-xl;
  font-weight: 700;
  color: $color-text;
  margin: 0;
}

.sidebar-menu {
  flex: 1;
  list-style: none;
  padding: $spacing-lg 0;
  margin: 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md $spacing-lg;
  color: $color-text-light;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: $color-background-hover;
    color: $color-text;
  }

  &.is-active {
    background: rgba($color-primary, 0.1);
    color: $color-primary;
    border-right: 3px solid $color-primary;
    font-weight: 600;
  }
}

.menu-icon {
  font-size: $font-size-lg;
}

.menu-label {
  font-size: $font-size-base;
}

.sidebar-footer {
  padding: $spacing-lg;
  border-top: 1px solid $color-border;
}

.logout-btn {
  width: 100%;
  font-size: $font-size-sm;
}
</style>
