import { ref, reactive } from 'vue';

/**
 * Composable for form validation
 * @param {object} formData - Reactive form data object
 * @param {object} validationRules - Validation rules object where keys are field names and values are arrays of validators
 * @returns {object} - Validation utilities
 */
export function useValidation(formData, validationRules) {
  // Store validation errors for each field
  const errors = ref({});

  // Track which fields have been touched (blurred)
  const touchedFields = reactive(new Set());

  /**
   * Validate a single field
   * @param {string} field - Field name to validate
   * @returns {boolean} - true if valid, false if invalid
   */
  const validate = (field) => {
    // Get the validation rules for this field
    const rules = validationRules[field];

    // If no rules, field is valid
    if (!rules || !Array.isArray(rules)) {
      errors.value[field] = null;
      return true;
    }

    // Get the field value
    const value = formData[field];

    // Run through all validators for this field
    for (const validator of rules) {
      const result = validator(value, formData);

      // If validator returns a string, it's an error message
      if (typeof result === 'string') {
        errors.value[field] = result;
        return false;
      }

      // If validator returns false, it failed but no message
      if (result === false) {
        errors.value[field] = 'Valeur invalide';
        return false;
      }
    }

    // All validators passed
    errors.value[field] = null;
    return true;
  };

  /**
   * Validate all fields in the form
   * @returns {boolean} - true if all fields are valid
   */
  const validateAll = () => {
    let isValid = true;

    // Validate each field that has rules
    Object.keys(validationRules).forEach(field => {
      const fieldValid = validate(field);
      if (!fieldValid) {
        isValid = false;
      }
    });

    return isValid;
  };

  /**
   * Clear error for a specific field
   * @param {string} field - Field name
   */
  const clearError = (field) => {
    errors.value[field] = null;
  };

  /**
   * Clear all errors
   */
  const clearAllErrors = () => {
    errors.value = {};
  };

  /**
   * Mark a field as touched
   * @param {string} field - Field name
   */
  const setTouched = (field) => {
    touchedFields.add(field);
  };

  /**
   * Check if a field has been touched
   * @param {string} field - Field name
   * @returns {boolean} - true if field has been touched
   */
  const isTouched = (field) => {
    return touchedFields.has(field);
  };

  /**
   * Reset validation state
   */
  const resetValidation = () => {
    errors.value = {};
    touchedFields.clear();
  };

  /**
   * Get error for a field (only if touched)
   * @param {string} field - Field name
   * @returns {string|null} - Error message or null
   */
  const getError = (field) => {
    return isTouched(field) ? errors.value[field] : null;
  };

  return {
    errors,
    touchedFields,
    validate,
    validateAll,
    clearError,
    clearAllErrors,
    setTouched,
    isTouched,
    resetValidation,
    getError
  };
}