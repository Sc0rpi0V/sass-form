import { ref, computed } from 'vue';
import { generateUUID } from '@/utils/uuid';

const STORAGE_KEY = 'cgv-versions';

/**
 * Composable pour gérer les versions de CGV
 * @returns {object} CGV utilities
 */
export function useCGV() {
  /**
   * Charger toutes les versions de CGV depuis localStorage
   * @returns {object}
   */
  const loadCGV = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading CGV:', error);
    }

    // Structure par défaut
    return {
      versions: [],
      activeVersionId: null
    };
  };

  /**
   * Sauvegarder les CGV dans localStorage
   * @param {object} data - Données à sauvegarder
   */
  const saveCGV = (data) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving CGV:', error);
      throw new Error('Espace de stockage insuffisant. Supprimez d\'anciennes versions.');
    }
  };

  /**
   * State réactif des CGV
   */
  const cgvState = ref(loadCGV());

  /**
   * Recharger les CGV depuis le localStorage
   */
  const refreshCGV = () => {
    cgvState.value = loadCGV();
  };

  /**
   * Toutes les versions de CGV
   */
  const versions = computed(() => cgvState.value.versions || []);

  /**
   * Version active
   */
  const activeVersion = computed(() => {
    const activeId = cgvState.value.activeVersionId;
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
    const data = loadCGV();

    const newVersion = {
      id: generateUUID(),
      title: versionData.title || 'Conditions Générales d\'Utilisation',
      version: versionData.version,
      content: versionData.content,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      isActive: false
    };

    data.versions.push(newVersion);
    saveCGV(data);
    refreshCGV();

    console.log('CGV version added:', newVersion);
    return newVersion;
  };

  /**
   * Mettre à jour une version existante
   * @param {string} id - ID de la version
   * @param {object} updates - Modifications à apporter
   */
  const updateVersion = (id, updates) => {
    const data = loadCGV();
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

    saveCGV(data);
    refreshCGV();

    console.log('CGV version updated:', data.versions[index]);
  };

  /**
   * Activer une version (désactive les autres)
   * @param {string} id - ID de la version à activer
   */
  const setActiveVersion = (id) => {
    const data = loadCGV();
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

    saveCGV(data);
    refreshCGV();

    console.log('Active CGV version set:', id);
  };

  /**
   * Supprimer une version
   * @param {string} id - ID de la version à supprimer
   * @throws {Error} Si la version est active
   */
  const deleteVersion = (id) => {
    const data = loadCGV();
    const version = data.versions.find(v => v.id === id);

    if (!version) {
      console.error(`Version not found: ${id}`);
      return;
    }

    if (version.isActive) {
      throw new Error('Impossible de supprimer la version active. Activez une autre version d\'abord.');
    }

    data.versions = data.versions.filter(v => v.id !== id);
    saveCGV(data);
    refreshCGV();

    console.log('CGV version deleted:', id);
  };

  return {
    versions,
    activeVersion,
    getVersionById,
    addVersion,
    updateVersion,
    setActiveVersion,
    deleteVersion,
    refreshCGV
  };
}
