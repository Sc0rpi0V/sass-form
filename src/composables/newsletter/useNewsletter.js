import { ref, computed } from 'vue';
import { generateUUID } from '@/utils/uuid';

const STORAGE_KEY = 'newsletter-versions';

/**
 * Composable pour gérer les versions de newsletter
 * @returns {object} Newsletter utilities
 */
export function useNewsletter() {
  /**
   * Charger toutes les versions de newsletter depuis localStorage
   * @returns {object}
   */
  const loadNewsletter = () => {
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
   * Sauvegarder les versions de newsletter dans localStorage
   * @param {object} data - Données à sauvegarder
   */
  const saveNewsletter = (data) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving newsletter:', error);
      throw new Error('Espace de stockage insuffisant. Supprimez d\'anciennes versions.');
    }
  };

  /**
   * State réactif des versions de newsletter
   */
  const newsletterState = ref(loadNewsletter());

  /**
   * Recharger les versions de newsletter depuis le localStorage
   */
  const refreshNewsletter = () => {
    newsletterState.value = loadNewsletter();
  };

  /**
   * Toutes les versions de newsletter
   */
  const versions = computed(() => newsletterState.value.versions || []);

  /**
   * Version active
   */
  const activeVersion = computed(() => {
    const activeId = newsletterState.value.activeVersionId;
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
    const data = loadNewsletter();

    const newVersion = {
      id: generateUUID(),
      title: versionData.title || 'Neswletter',
      version: versionData.version,
      content: versionData.content,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      isActive: false
    };

    data.versions.push(newVersion);
    saveNewsletter(data);
    refreshNewsletter();

    console.log('Newsletter version added:', newVersion);
    return newVersion;
  };

  /**
   * Mettre à jour une version existante
   * @param {string} id - ID de la version
   * @param {object} updates - Modifications à apporter
   */
  const updateVersion = (id, updates) => {
    const data = loadNewsletter();
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

    saveNewsletter(data);
    refreshNewsletter();

    console.log('Newsletter version updated:', data.versions[index]);
  };

  /**
   * Activer une version (désactive les autres)
   * @param {string} id - ID de la version à activer
   */
  const setActiveVersion = (id) => {
    const data = loadNewsletter();
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

    saveNewsletter(data);
    refreshNewsletter();

    console.log('Active newsletter version set:', id);
  };

  /**
   * Supprimer une version
   * @param {string} id - ID de la version à supprimer
   * @throws {Error} Si la version est active
   */
  const deleteVersion = (id) => {
    const data = loadNewsletter();
    const version = data.versions.find(v => v.id === id);

    if (!version) {
      console.error(`Version not found: ${id}`);
      return;
    }

    if (version.isActive) {
      throw new Error('Impossible de supprimer la version active. Activez une autre version d\'abord.');
    }

    data.versions = data.versions.filter(v => v.id !== id);
    saveNewsletter(data);
    refreshNewsletter();

    console.log('Newsletter version deleted:', id);
  };

  return {
    versions,
    activeVersion,
    getVersionById,
    addVersion,
    updateVersion,
    setActiveVersion,
    deleteVersion,
    refreshNewsletter
  };
}
