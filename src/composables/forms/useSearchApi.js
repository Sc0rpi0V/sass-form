import { ref } from 'vue';

let _cachedProducts = null;
let _cachedArticles = null;

export function useSearchApi() {
  const suggestions = ref([]);
  const categories = ref([]);
  const sizes = ref([]);
  const colors = ref([]);
  const authors = ref([]);
  const previewResults = ref({ products: [], articles: [] });
  const isLoadingPreview = ref(false);
  const searchResults = ref(null);
  const isLoading = ref(false);

  const loadProducts = async () => {
    if (!_cachedProducts) {
      const res = await fetch('/searchApi/products.json');
      _cachedProducts = await res.json();
    }
    return _cachedProducts;
  };

  const loadArticles = async () => {
    if (!_cachedArticles) {
      const res = await fetch('/searchApi/articles.json');
      _cachedArticles = await res.json();
    }
    return _cachedArticles;
  };

  const fetchCategories = async () => {
    categories.value = [
      { label: 'Articles', value: 'article' },
      { label: 'Produits', value: 'produit' }
    ];
  };

  const fetchFilterOptions = async (category) => {
    if (category === 'produit') {
      const products = await loadProducts();
      const allSizes = products.flatMap(p => p.tailles_disponibles);
      const allColors = products.flatMap(p => p.couleurs_disponibles);
      sizes.value = [...new Set(allSizes)].map(s => ({ label: String(s), value: s }));
      colors.value = [...new Set(allColors)].map(c => ({ label: c, value: c }));
      authors.value = [];
    } else if (category === 'article') {
      const articles = await loadArticles();
      const allAuthors = articles.map(a => a.auteur);
      authors.value = [...new Set(allAuthors)].map(a => ({ label: a, value: a }));
      sizes.value = [];
      colors.value = [];
    } else {
      sizes.value = [];
      colors.value = [];
      authors.value = [];
    }
  };

  const fetchSuggestions = async (query) => {
    if (!query || query.length < 2) {
      suggestions.value = [];
      return;
    }

    const [products, articles] = await Promise.all([loadProducts(), loadArticles()]);
    const q = query.toLowerCase();

    const productMatches = products
      .filter(p => p.nom.toLowerCase().includes(q))
      .map(p => ({ id: `p-${p.id}`, label: p.nom }));

    const articleMatches = articles
      .filter(a => a.titre.toLowerCase().includes(q))
      .map(a => ({ id: `a-${a.id}`, label: a.titre }));

    suggestions.value = [...productMatches, ...articleMatches].slice(0, 10);
  };

  const searchPreview = async (formData) => {
    isLoadingPreview.value = true;
    try {
      const [products, articles] = await Promise.all([loadProducts(), loadArticles()]);
      const q = (formData.search || '').toLowerCase();

      previewResults.value = {
        products: products
          .filter(p => !q || p.nom.toLowerCase().includes(q))
          .slice(0, 5),
        articles: articles
          .filter(a => !q || a.titre.toLowerCase().includes(q))
          .slice(0, 5)
      };
    } finally {
      isLoadingPreview.value = false;
    }
  };

  const performSearch = async (formData) => {
    isLoading.value = true;
    try {
      const [products, articles] = await Promise.all([loadProducts(), loadArticles()]);
      const q = (formData.search || '').toLowerCase();
      const category = formData.category || null;

      let filteredProducts = [];
      if (category === 'produit' || category === null) {
        filteredProducts = products.filter(p => {
          if (q && !p.nom.toLowerCase().includes(q)) return false;
          if (formData.priceMin !== null && p.prix < formData.priceMin) return false;
          if (formData.priceMax !== null && p.prix > formData.priceMax) return false;
          if (formData.size !== null && !p.tailles_disponibles.map(String).includes(String(formData.size))) return false;
          if (formData.color !== null && !p.couleurs_disponibles.includes(formData.color)) return false;
          return true;
        });

        if (formData.orderBy === 'prix') {
          filteredProducts.sort((a, b) => a.prix - b.prix);
        } else if (formData.orderBy === 'taille') {
          filteredProducts.sort((a, b) => String(a.tailles_disponibles[0] ?? '').localeCompare(String(b.tailles_disponibles[0] ?? '')));
        } else if (formData.orderBy === 'couleur') {
          filteredProducts.sort((a, b) => (a.couleurs_disponibles[0] ?? '').localeCompare(b.couleurs_disponibles[0] ?? ''));
        }
      }

      let filteredArticles = [];
      if (category === 'article' || category === null) {
        filteredArticles = articles.filter(a => {
          if (q && !a.titre.toLowerCase().includes(q)) return false;
          if (formData.author !== null && a.auteur !== formData.author) return false;
          if (formData.dateCreation !== null && a.date_creation < formData.dateCreation) return false;
          return true;
        });

        if (formData.orderBy === 'date_creation') {
          filteredArticles.sort((a, b) => b.date_creation.localeCompare(a.date_creation));
        } else if (formData.orderBy === 'date_modification') {
          filteredArticles.sort((a, b) => b.date_modification.localeCompare(a.date_modification));
        } else if (formData.orderBy === 'auteur') {
          filteredArticles.sort((a, b) => a.auteur.localeCompare(b.auteur));
        }
      }

      searchResults.value = { products: filteredProducts, articles: filteredArticles };
    } finally {
      isLoading.value = false;
    }
  };

  return {
    suggestions,
    categories,
    sizes,
    colors,
    authors,
    previewResults,
    isLoadingPreview,
    searchResults,
    isLoading,
    fetchSuggestions,
    fetchCategories,
    fetchFilterOptions,
    searchPreview,
    performSearch
  };
}
