import { useForm } from '@/composables/forms/useForm';
import { validators } from '@/utils/validators';

export function useSearchForm() {

  const initialValues = {
    search: '',
    category: '',
    tags: [],
    priceMin: null,
    priceMax: null,
    date: null,
    orderBy: null,
    size: null,
    color: null,
    author: null,
    dateCreation: null
  };

  const validationRules = {
    category: [validators.required]
  };

  const form = useForm(initialValues, validationRules);

  return {
    ...form
  };
}