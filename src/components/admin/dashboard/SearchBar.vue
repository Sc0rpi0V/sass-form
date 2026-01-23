<template>
  <div class="search-bar">
    <div class="search-input-wrapper">
      <span class="search-icon">🔍</span>
      <input
        v-model="searchQuery"
        type="text"
        class="search-input"
        placeholder="Rechercher par nom, email, sujet..."
        @input="onSearch"
      />
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="clear-btn"
        type="button"
        aria-label="Effacer la recherche"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['search']);

const searchQuery = ref('');
let debounceTimeout = null;

const onSearch = () => {
  // Debounce de 300ms
  clearTimeout(debounceTimeout);

  debounceTimeout = setTimeout(() => {
    emit('search', searchQuery.value);
  }, 300);
};

const clearSearch = () => {
  searchQuery.value = '';
  emit('search', '');
};
</script>

<style scoped lang="scss">
@use '@/assets/styles/index' as *;

.search-bar {
  margin-bottom: $spacing-xl;
}

.search-input-wrapper {
  position: relative;
  max-width: 500px;
}

.search-icon {
  position: absolute;
  left: $spacing-md;
  top: 50%;
  transform: translateY(-50%);
  font-size: $font-size-lg;
  pointer-events: none;
  opacity: 0.5;
}

.search-input {
  width: 100%;
  padding: $spacing-md $spacing-3xl $spacing-md $spacing-3xl;
  font-size: $font-size-base;
  border: $border-width solid $color-border;
  border-radius: $border-radius-lg;
  transition: all $transition-speed $transition-timing;
  background: $color-background;

  &:focus {
    outline: none;
    border-color: $color-primary;
    box-shadow: 0 0 0 3px rgba($color-primary, 0.1);
  }

  &::placeholder {
    color: $color-text-light;
  }
}

.clear-btn {
  position: absolute;
  right: $spacing-md;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: $font-size-lg;
  color: $color-text-light;
  cursor: pointer;
  padding: $spacing-xs;
  line-height: 1;
  transition: color $transition-speed $transition-timing;

  &:hover {
    color: $color-error;
  }

  &:focus {
    outline: 2px solid $color-primary;
    outline-offset: 2px;
    border-radius: $border-radius-sm;
  }
}
</style>
