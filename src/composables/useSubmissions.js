import { computed } from 'vue';
import { generateUUID } from '@/utils/uuid';

const STORAGE_KEY = 'form-submissions';

// Types de formulaires supportés
const FORM_TYPES = {
  CONTACT: 'contact',
  REGISTRATION: 'registration',
  NEWSLETTER: 'newsletter',
  QUESTION: 'question',
  PROJECT: 'project'
};

/**
 * Composable pour gérer les soumissions de formulaires
 * @returns {object} Submissions utilities
 */
export function useSubmissions() {
  /**
   * Charger toutes les soumissions depuis localStorage
   * @returns {object}
   */
  const loadSubmissions = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading submissions:', error);
    }

    // Structure par défaut
    return {
      contact: [],
      registration: [],
      newsletter: [],
      question: [],
      project: []
    };
  };

  /**
   * Sauvegarder les soumissions dans localStorage
   * @param {object} data - Données à sauvegarder
   */
  const saveSubmissions = (data) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving submissions:', error);
    }
  };

  /**
   * Toutes les soumissions sous forme de tableau plat
   */
  const submissions = computed(() => {
    const data = loadSubmissions();
    const allSubmissions = [];

    Object.keys(data).forEach(type => {
      data[type].forEach(submission => {
        allSubmissions.push({
          ...submission,
          formType: type
        });
      });
    });

    // Trier par date (plus récent en premier)
    return allSubmissions.sort((a, b) => {
      return new Date(b.submittedAt) - new Date(a.submittedAt);
    });
  });

  /**
   * Récupérer les soumissions par type
   * @param {string} type - Type de formulaire
   * @returns {Array}
   */
  const getByType = (type) => {
    const data = loadSubmissions();
    const submissions = data[type] || [];

    return submissions.map(submission => ({
      ...submission,
      formType: type
    })).sort((a, b) => {
      return new Date(b.submittedAt) - new Date(a.submittedAt);
    });
  };

  /**
   * Ajouter une nouvelle soumission
   * @param {string} type - Type de formulaire
   * @param {object} formData - Données du formulaire
   */
  const addSubmission = (type, formData) => {
    if (!Object.values(FORM_TYPES).includes(type)) {
      console.error(`Invalid form type: ${type}`);
      return;
    }

    const data = loadSubmissions();

    const submission = {
      id: generateUUID(),
      submittedAt: new Date().toISOString(),
      ...formData
    };

    if (!data[type]) {
      data[type] = [];
    }

    data[type].push(submission);
    saveSubmissions(data);

    console.log(`Submission added to ${type}:`, submission);
  };

  /**
   * Rechercher dans toutes les soumissions
   * @param {string} query - Texte de recherche
   * @returns {Array}
   */
  const search = (query) => {
    if (!query || query.trim() === '') {
      return submissions.value;
    }

    const lowerQuery = query.toLowerCase().trim();

    return submissions.value.filter(submission => {
      // Rechercher dans tous les champs string
      return Object.values(submission).some(value => {
        if (typeof value === 'string') {
          return value.toLowerCase().includes(lowerQuery);
        }
        return false;
      });
    });
  };

  /**
   * Obtenir les statistiques
   * @returns {object}
   */
  const getStats = () => {
    const data = loadSubmissions();
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let total = 0;
    let thisMonth = 0;
    const byType = {};

    Object.keys(data).forEach(type => {
      const count = data[type].length;
      byType[type] = count;
      total += count;

      // Compter ce mois-ci
      data[type].forEach(submission => {
        const subDate = new Date(submission.submittedAt);
        if (subDate.getMonth() === currentMonth && subDate.getFullYear() === currentYear) {
          thisMonth++;
        }
      });
    });

    return {
      total,
      thisMonth,
      byType
    };
  };

  /**
   * Exporter les données au format CSV
   * @param {string} type - Type de formulaire (optionnel, all par défaut)
   * @returns {string} - CSV string
   */
  const exportToCSV = (type = 'all') => {
    const data = type === 'all' ? submissions.value : getByType(type);

    if (data.length === 0) {
      return '';
    }

    // Extraire les en-têtes (toutes les clés uniques)
    const headers = new Set();
    data.forEach(item => {
      Object.keys(item).forEach(key => headers.add(key));
    });

    const headerArray = Array.from(headers);

    // Créer le CSV
    const csvRows = [
      headerArray.join(','), // En-têtes
      ...data.map(item => {
        return headerArray.map(header => {
          const value = item[header] || '';
          // Échapper les virgules et guillemets
          const escaped = String(value).replace(/"/g, '""');
          return `"${escaped}"`;
        }).join(',');
      })
    ];

    return csvRows.join('\n');
  };

  /**
   * Télécharger le CSV
   * @param {string} type - Type de formulaire
   */
  const downloadCSV = (type = 'all') => {
    const csv = exportToCSV(type);
    if (!csv) {
      console.warn('No data to export');
      return;
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `submissions-${type}-${Date.now()}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * Nettoyer toutes les soumissions (debug)
   */
  const clearAll = () => {
    const empty = {
      contact: [],
      registration: [],
      newsletter: [],
      question: [],
      project: []
    };
    saveSubmissions(empty);
    console.log('All submissions cleared');
  };

  return {
    submissions,
    getByType,
    addSubmission,
    search,
    getStats,
    exportToCSV,
    downloadCSV,
    clearAll,
    FORM_TYPES
  };
}
