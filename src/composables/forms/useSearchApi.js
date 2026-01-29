import { ref } from 'vue';

export function useSearchApi() {
  const suggestions = ref([]);
  const categories = ref([]);

  const fetchSuggestions = async (query) => {
    if (!query || query.length < 2) {
      suggestions.value = [];
      return;
    }

    // MOCK DATA
    const mock = [
      { id: 1, title: 'Article Vue 3' },
      { id: 2, title: 'Produit JavaScript' },
      { id: 3, title: 'Guide Frontend' }
    ];

    suggestions.value = mock
      .filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase())
      )
      .map(item => ({
        id: item.id,
        label: item.title
      }));
  };

  const fetchCategories = async () => {
    categories.value = [
      { label: 'Tech', value: 1 },
      { label: 'Design', value: 2 },
      { label: 'Business', value: 3 }
    ];
  };

  return {
    suggestions,
    categories,
    fetchSuggestions,
    fetchCategories
  };
}
