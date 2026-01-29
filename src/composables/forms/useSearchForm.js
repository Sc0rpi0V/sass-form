import { reactive } from 'vue';

export function useSearchForm() {
  const formData = reactive({
    search: '',
    category: null,
    tags: [],
    priceMin: null,
    priceMax: null,
    date: null,
    orderBy: 'date'
  });

  const handleInput = (field, value) => {
    formData[field] = value;
  };

  const resetForm = () => {
    Object.keys(formData).forEach(key => {
      formData[key] = Array.isArray(formData[key]) ? [] : null;
    });
    formData.search = '';
    formData.orderBy = 'date';
  };

  return {
    formData,
    handleInput,
    resetForm
  };
}
