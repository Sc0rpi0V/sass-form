<template>
  <div class="view-container">
    <SearchForm @search="handleSearch" />
    <SearchResults :results="searchResults" :is-loading="isLoading" />
  </div>
</template>

<script setup>
import SearchForm from '@/components/forms/public/SearchForm.vue';
import SearchResults from '@/components/forms/public/SearchResults.vue';
import { useSearchApi } from '@/composables/forms/useSearchApi';

const { searchResults, isLoading, performSearch } = useSearchApi();

const handleSearch = (formData) => {
  performSearch(formData);
};
</script>

<style scoped>
.view-container {
  padding: 2rem 0;
}
</style>
