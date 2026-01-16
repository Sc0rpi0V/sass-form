/**
 * Validators for form fields
 * Each validator returns true if validation passes, or an error message string if it fails
 */

export const validators = {
  /**
   * Required field validator
   * @param {*} value - The field value to validate
   * @returns {boolean|string} - true if valid, error message if invalid
   */
  required: (value) => {
    // Handle different types of values
    if (value === null || value === undefined) {
      return 'Ce champ est obligatoire';
    }

    // For strings, trim whitespace
    if (typeof value === 'string') {
      return value.trim().length > 0 || 'Ce champ est obligatoire';
    }

    // For booleans (checkboxes), must be true
    if (typeof value === 'boolean') {
      return value === true || 'Vous devez accepter ce champ';
    }

    // For arrays, must not be empty
    if (Array.isArray(value)) {
      return value.length > 0 || 'Ce champ est obligatoire';
    }

    return true;
  },

  /**
   * Email format validator
   * @param {string} value - The email to validate
   * @returns {boolean|string} - true if valid, error message if invalid
   */
  email: (value) => {
    if (!value) return true; // Allow empty (use required separately)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) || 'Format d\'email invalide';
  },

  /**
   * French phone number validator
   * Accepts formats: 0612345678, 06 12 34 56 78, 06-12-34-56-78, +33612345678
   * @param {string} value - The phone number to validate
   * @returns {boolean|string} - true if valid, error message if invalid
   */
  phone: (value) => {
    if (!value) return true; // Allow empty (use required separately)

    // Remove spaces, dots, and hyphens
    const cleaned = value.replace(/[\s.\-]/g, '');

    // French mobile: starts with 06 or 07 (or +336 or +337), 10 digits total
    // French landline: starts with 01-05 or 09, 10 digits total
    const frenchPhoneRegex = /^(?:(?:\+|00)33|0)[1-9](?:\d{8})$/;

    return frenchPhoneRegex.test(cleaned) || 'Numéro de téléphone invalide (format français attendu)';
  },

  /**
   * Minimum length validator factory
   * @param {number} min - Minimum length required
   * @returns {function} - Validator function
   */
  minLength: (min) => {
    return (value) => {
      if (!value) return true; // Allow empty (use required separately)

      const length = typeof value === 'string' ? value.trim().length : String(value).length;
      return length >= min || `Ce champ doit contenir au moins ${min} caractères`;
    };
  },

  /**
   * Maximum length validator factory
   * @param {number} max - Maximum length allowed
   * @returns {function} - Validator function
   */
  maxLength: (max) => {
    return (value) => {
      if (!value) return true; // Allow empty (use required separately)

      const length = typeof value === 'string' ? value.length : String(value).length;
      return length <= max || `Ce champ ne doit pas dépasser ${max} caractères`;
    };
  },

  /**
   * URL validator
   * @param {string} value - The URL to validate
   * @returns {boolean|string} - true if valid, error message if invalid
   */
  url: (value) => {
    if (!value) return true; // Allow empty (use required separately)

    try {
      new URL(value);
      return true;
    } catch {
      return 'URL invalide (doit commencer par http:// ou https://)';
    }
  },

  /**
   * Match field validator factory (for password confirmation, etc.)
   * @param {string} fieldName - The name of the field to match
   * @param {string} fieldLabel - The label of the field to match (for error message)
   * @returns {function} - Validator function that takes value and formData
   */
  match: (fieldName, fieldLabel) => {
    return (value, formData) => {
      if (!value) return true; // Allow empty (use required separately)

      const fieldToMatch = formData?.[fieldName];
      return value === fieldToMatch || `Doit correspondre au champ "${fieldLabel}"`;
    };
  },

  /**
   * Numeric validator
   * @param {string|number} value - The value to validate
   * @returns {boolean|string} - true if valid, error message if invalid
   */
  numeric: (value) => {
    if (!value && value !== 0) return true; // Allow empty (use required separately)

    const numericRegex = /^-?\d+(\.\d+)?$/;
    return numericRegex.test(String(value)) || 'Doit être un nombre valide';
  },

  /**
   * Min value validator factory
   * @param {number} min - Minimum value allowed
   * @returns {function} - Validator function
   */
  minValue: (min) => {
    return (value) => {
      if (!value && value !== 0) return true; // Allow empty (use required separately)

      const numValue = Number(value);
      return numValue >= min || `La valeur doit être supérieure ou égale à ${min}`;
    };
  },

  /**
   * Max value validator factory
   * @param {number} max - Maximum value allowed
   * @returns {function} - Validator function
   */
  maxValue: (max) => {
    return (value) => {
      if (!value && value !== 0) return true; // Allow empty (use required separately)

      const numValue = Number(value);
      return numValue <= max || `La valeur doit être inférieure ou égale à ${max}`;
    };
  }
};
