import { ref, computed } from 'vue';
import { generateUUID } from '@/utils/uuid';

/**
 * Factory pour créer un gestionnaire de versions
 * @param {Object} options
 * @param {string} options.storageKey
 * @param {string} options.defaultTitle
 */
export function useVersionManager({ storageKey, defaultTitle }) {

  const load = () => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) return JSON.parse(stored);
    } catch (error) {
      console.error(`Error loading ${storageKey}:`, error);
    }

    return {
      versions: [],
      activeVersionId: null
    };
  };

  const save = (data) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${storageKey}:`, error);
      throw new Error('Espace de stockage insuffisant.');
    }
  };

  const state = ref(load());

  const refresh = () => {
    state.value = load();
  };

  const versions = computed(() => state.value.versions || []);

  const activeVersion = computed(() => {
    const activeId = state.value.activeVersionId;
    if (!activeId) return null;
    return versions.value.find(v => v.id === activeId) || null;
  });

  const getVersionById = (id) => {
    return versions.value.find(v => v.id === id) || null;
  };

  const addVersion = (versionData) => {
    const data = load();

    const newVersion = {
      id: generateUUID(),
      title: versionData.title || defaultTitle,
      version: versionData.version,
      content: versionData.content,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      isActive: false
    };

    data.versions.push(newVersion);
    save(data);
    refresh();

    return newVersion;
  };

  const updateVersion = (id, updates) => {
    const data = load();
    const index = data.versions.findIndex(v => v.id === id);
    if (index === -1) return;

    data.versions[index] = {
      ...data.versions[index],
      ...updates,
      lastModified: new Date().toISOString()
    };

    save(data);
    refresh();
  };

  const setActiveVersion = (id) => {
    const data = load();
    const index = data.versions.findIndex(v => v.id === id);
    if (index === -1) return;

    data.versions.forEach(v => v.isActive = false);

    data.versions[index].isActive = true;
    data.activeVersionId = id;

    save(data);
    refresh();
  };

  const deleteVersion = (id) => {
    const data = load();
    const version = data.versions.find(v => v.id === id);
    if (!version) return;

    if (version.isActive) {
      throw new Error('Impossible de supprimer la version active.');
    }

    data.versions = data.versions.filter(v => v.id !== id);
    save(data);
    refresh();
  };

  return {
    versions,
    activeVersion,
    getVersionById,
    addVersion,
    updateVersion,
    setActiveVersion,
    deleteVersion,
    refresh
  };
}