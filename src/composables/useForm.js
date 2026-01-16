import { ref, reactive, onMounted } from 'vue';
import { useValidation } from './useValidation';

/**
 * Composable for form management with validation and optional localStorage persistence
 * @param {object} initialValues - Initial form values
 * @param {object} validationRules - Validation rules object
 * @param {object} options - Options object
 * @param {string} options.persistKey - Key for localStorage persistence (optional)
 * @returns {object} - Form utilities
 */
export function useForm(initialValues, validationRules, options = {}) {
  const { persistKey } = options;

  // Create reactive form data
  const formData = reactive({ ...initialValues });

  // Form submission state
  const isSubmitting = ref(false);
  const submitError = ref(null);
  const submitSuccess = ref(false);

  // Use validation composable
  const {
    validate,
    validateAll,
    setTouched,
    resetValidation,
    getError: getValidationError
  } = useValidation(formData, validationRules);

  /**
   * Load persisted data from localStorage
   */
  const loadPersistedData = () => {
    if (!persistKey) return;

    try {
      const stored = localStorage.getItem(persistKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge stored data with form data
        Object.keys(parsed).forEach(key => {
          if (key in formData) {
            formData[key] = parsed[key];
          }
        });
      }
    } catch (error) {
      console.warn('Failed to load persisted form data:', error);
    }
  };

  /**
   * Save form data to localStorage
   */
  const savePersistedData = () => {
    if (!persistKey) return;

    try {
      localStorage.setItem(persistKey, JSON.stringify(formData));
    } catch (error) {
      console.warn('Failed to save form data to localStorage:', error);
    }
  };

  /**
   * Clear persisted data from localStorage
   */
  const clearPersistedData = () => {
    if (!persistKey) return;

    try {
      localStorage.removeItem(persistKey);
    } catch (error) {
      console.warn('Failed to clear persisted form data:', error);
    }
  };

  /**
   * Handle input change
   * @param {string} field - Field name
   * @param {*} value - New value
   */
  const handleInput = (field, value) => {
    formData[field] = value;

    // Validate if field has been touched
    validate(field);

    // Save to localStorage if persistence is enabled
    if (persistKey) {
      savePersistedData();
    }
  };

  /**
   * Handle field blur
   * @param {string} field - Field name
   */
  const handleBlur = (field) => {
    setTouched(field);
    validate(field);
  };

  /**
   * Handle form submission
   * @param {function} submitFn - Async function to call on successful validation
   */
  const handleSubmit = async (submitFn) => {
    // Validation des champs
    const isValid = validateAll();

    if (!isValid) {
      submitError.value = 'Veuillez corriger les erreurs dans le formulaire';
      submitSuccess.value = false;
      return;
    }

    // Reset état sousmission
    isSubmitting.value = true;
    submitError.value = null;
    submitSuccess.value = false;

    try {
      // Appel function submit avec données du form
      await submitFn(formData);

      // Success
      submitSuccess.value = true;
      submitError.value = null;

      // Clear persisted data on successful submission
      if (persistKey) {
        clearPersistedData();
      }
    } catch (error) {
      // Gestion Erreur
      submitError.value = error.message || 'Une erreur est survenue lors de l\'envoi du formulaire';
      submitSuccess.value = false;
    } finally {
      isSubmitting.value = false;
    }
  };

  /**
   * Reset form to initial values
   */
  const resetForm = () => {
    // Reset all fields to initial values
    Object.keys(initialValues).forEach(key => {
      formData[key] = initialValues[key];
    });

    // Reset validation state
    resetValidation();

    // Reset submission state
    isSubmitting.value = false;
    submitError.value = null;
    submitSuccess.value = false;

    // Clear persisted data
    if (persistKey) {
      clearPersistedData();
    }
  };

  /**
   * Get error for a field
   * @param {string} field - Field name
   * @returns {string|null} - Error message or null
   */
  const getError = (field) => {
    return getValidationError(field);
  };

  // Load persisted data on mount
  onMounted(() => {
    if (persistKey) {
      loadPersistedData();
    }
  });

  return {
    formData,
    isSubmitting,
    submitError,
    submitSuccess,
    handleInput,
    handleBlur,
    handleSubmit,
    resetForm,
    getError,
    clearPersistedData
  };
}