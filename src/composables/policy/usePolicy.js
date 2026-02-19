import { ref, computed } from 'vue';
import { generateUUID } from '@/utils/uuid';

const STORAGE_KEY = 'policy-versions';

/**
 * Composable pour gérer les versions de Politique de Confidentialité
 * @returns {object} Politique de Confidentialité utilities
 */
export function usePolicy() {
  /**
   * Charger toutes les versions de Politique de Confidentialité depuis localStorage
   * @returns {object}
   */
  const loadPolicy = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading Policy:', error);
    }

    // Structure par défaut
    return {
      versions: [],
      activeVersionId: null
    };
  };

  /**
   * Sauvegarder les Politiques de Confidentialité dans localStorage
   * @param {object} data - Données à sauvegarder
   */
  const savePolicy = (data) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving Policy:', error);
      throw new Error('Espace de stockage insuffisant. Supprimez d\'anciennes versions.');
    }
  };

  /**
   * State réactif des Politiques de Confidentialité
   */
  const policyState = ref(loadPolicy());

  /**
   * Recharger les Politiques de Confidentialité depuis le localStorage
   */
  const refreshPolicy = () => {
    policyState.value = loadPolicy();
  };

  /**
   * Toutes les versions de Politique de Confidentialité
   */
  const versions = computed(() => policyState.value.versions || []);

  /**
   * Version active
   */
  const activeVersion = computed(() => {
    const activeId = policyState.value.activeVersionId;
    if (!activeId) return null;
    return versions.value.find(v => v.id === activeId) || null;
  });

  /**
   * Récupérer une version par son ID
   * @param {string} id - ID de la version
   * @returns {object|null}
   */
  const getVersionById = (id) => {
    return versions.value.find(v => v.id === id) || null;
  };

  /**
   * Ajouter une nouvelle version
   * @param {object} versionData - Données de la version
   * @returns {object} - Version créée
   */
  const addVersion = (versionData) => {
    const data = loadPolicy();

    const newVersion = {
      id: generateUUID(),
      title: versionData.title || 'Politique de Confidentialité',
      version: versionData.version,
      content: versionData.content,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      isActive: false
    };

    data.versions.push(newVersion);
    savePolicy(data);
    refreshPolicy();

    console.log('Policy version added:', newVersion);
    return newVersion;
  };

  /**
   * Mettre à jour une version existante
   * @param {string} id - ID de la version
   * @param {object} updates - Modifications à apporter
   */
  const updateVersion = (id, updates) => {
    const data = loadPolicy();
    const index = data.versions.findIndex(v => v.id === id);

    if (index === -1) {
      console.error(`Version not found: ${id}`);
      return;
    }

    data.versions[index] = {
      ...data.versions[index],
      ...updates,
      lastModified: new Date().toISOString()
    };

    savePolicy(data);
    refreshPolicy();

    console.log('Policy version updated:', data.versions[index]);
  };

  /**
   * Activer une version (désactive les autres)
   * @param {string} id - ID de la version à activer
   */
  const setActiveVersion = (id) => {
    const data = loadPolicy();
    const version = data.versions.find(v => v.id === id);

    if (!version) {
      console.error(`Version not found: ${id}`);
      return;
    }

    // Désactiver toutes les versions
    data.versions.forEach(v => {
      v.isActive = false;
    });

    // Activer la version cible
    const index = data.versions.findIndex(v => v.id === id);
    data.versions[index].isActive = true;
    data.activeVersionId = id;

    savePolicy(data);
    refreshPolicy();

    console.log('Active Policy version set:', id);
  };

  /**
   * Supprimer une version
   * @param {string} id - ID de la version à supprimer
   * @throws {Error} Si la version est active
   */
  const deleteVersion = (id) => {
    const data = loadPolicy();
    const version = data.versions.find(v => v.id === id);

    if (!version) {
      console.error(`Version not found: ${id}`);
      return;
    }

    if (version.isActive) {
      throw new Error('Impossible de supprimer la version active. Activez une autre version d\'abord.');
    }

    data.versions = data.versions.filter(v => v.id !== id);
    savePolicy(data);
    refreshPolicy();

    console.log('Policy version deleted:', id);
  };

  return {
    versions,
    activeVersion,
    getVersionById,
    addVersion,
    updateVersion,
    setActiveVersion,
    deleteVersion,
    refreshPolicy
  };
}
