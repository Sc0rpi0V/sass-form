<template>
  <div class="search-results">
    <p v-if="isLoading" class="search-results__loading">Recherche en cours...</p>

    <template v-else-if="results !== null">
      <div v-if="results.products.length" class="search-results__section">
        <h2 class="search-results__title">Produits ({{ results.products.length }})</h2>
        <ul class="search-results__list">
          <li v-for="product in results.products" :key="product.id" class="search-results__item">
            <span class="search-results__name">{{ product.nom }}</span>
            <span class="search-results__meta">{{ product.prix }} €</span>
            <span class="search-results__meta">{{ product.marque }}</span>
          </li>
        </ul>
      </div>

      <div v-if="results.articles.length" class="search-results__section">
        <h2 class="search-results__title">Articles ({{ results.articles.length }})</h2>
        <ul class="search-results__list">
          <li v-for="article in results.articles" :key="article.id" class="search-results__item">
            <span class="search-results__name">{{ article.titre }}</span>
            <span class="search-results__meta">{{ article.auteur }}</span>
            <span class="search-results__meta">{{ article.date_creation }}</span>
          </li>
        </ul>
      </div>

      <p v-if="!results.products.length && !results.articles.length" class="search-results__empty">
        Aucun résultat trouvé.
      </p>
    </template>
  </div>
</template>

<script setup>
defineProps({
  results: {
    type: Object,
    default: null
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped lang="scss">
@use '@/assets/styles/index' as *;

.search-results {
  margin-top: 1.5rem;

  &__loading {
    text-align: center;
    color: #666;
  }

  &__section {
    margin-bottom: 1.5rem;
  }

  &__title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 0.5rem;
  }

  &__item {
    display: flex;
    gap: 1rem;
    padding: 0.75rem 1rem;
    background: white;
    border-radius: 0.375rem;
    border: 1px solid #e5e7eb;
  }

  &__name {
    flex: 1;
    font-weight: 500;
  }

  &__meta {
    color: #6b7280;
    white-space: nowrap;
  }

  &__empty {
    text-align: center;
    color: #6b7280;
  }
}
</style>
