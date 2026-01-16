import { ref, onMounted } from 'vue';

// Credentials hardcodés
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Admin123!';
const STORAGE_KEY = 'admin-auth';

// État global partagé entre toutes les instances
const isAuthenticated = ref(false);
const user = ref(null);

/**
 * Composable pour gérer l'authentification admin
 * @returns {object} Auth utilities
 */
export function useAuth() {
  /**
   * Charger l'état d'authentification depuis localStorage
   */
  const loadAuthState = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const authData = JSON.parse(stored);
        if (authData.isAuthenticated && authData.user) {
          isAuthenticated.value = true;
          user.value = authData.user;
          return true;
        }
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
    }
    return false;
  };

  /**
   * Sauvegarder l'état d'authentification dans localStorage
   */
  const saveAuthState = () => {
    try {
      const authData = {
        isAuthenticated: isAuthenticated.value,
        user: user.value
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
    } catch (error) {
      console.error('Error saving auth state:', error);
    }
  };

  /**
   * Effacer l'état d'authentification
   */
  const clearAuthState = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing auth state:', error);
    }
  };

  /**
   * Se connecter
   * @param {string} email - Email
   * @param {string} password - Mot de passe
   * @returns {Promise<boolean>} True si succès
   */
  const login = async (email, password) => {
    // Simuler délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));

    // Vérifier credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      isAuthenticated.value = true;
      user.value = {
        email: ADMIN_EMAIL,
        name: 'Administrateur',
        loginAt: new Date().toISOString()
      };

      saveAuthState();
      return true;
    }

    return false;
  };

  /**
   * Se déconnecter
   */
  const logout = () => {
    isAuthenticated.value = false;
    user.value = null;
    clearAuthState();
  };

  /**
   * Vérifier si l'utilisateur est authentifié
   * @returns {boolean}
   */
  const checkAuth = () => {
    if (!isAuthenticated.value) {
      return loadAuthState();
    }
    return isAuthenticated.value;
  };

  /**
   * Vérifier si l'utilisateur est admin
   * @returns {boolean}
   */
  const isAdmin = () => {
    return isAuthenticated.value && user.value !== null;
  };

  // Charger l'état au montage du composable
  onMounted(() => {
    if (!isAuthenticated.value) {
      loadAuthState();
    }
  });

  return {
    isAuthenticated,
    user,
    login,
    logout,
    checkAuth,
    isAdmin
  };
}
