import { ref, onMounted } from 'vue';
import { useSubmissions } from '@/composables/useSubmissions';

const STORAGE_KEY = 'user-auth';
const isAuthenticated = ref(false);
const user = ref(null);

export function useUserAuth() {
  const { submissions } = useSubmissions();

  /** Charger l'état d'auth depuis localStorage */
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
      console.error('Error loading user auth state:', error);
    }
    return false;
  };

  /** Sauvegarder état auth */
  const saveAuthState = () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ isAuthenticated: isAuthenticated.value, user: user.value })
      );
    } catch (error) {
      console.error('Error saving user auth state:', error);
    }
  };

  /** Effacer auth */
  const clearAuthState = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing user auth state:', error);
    }
  };

  /**
   * Login utilisateur
   * Vérifie email/password dans les soumissions de type 'registration'
   */
  const login = async (email, password) => {
    const registeredUsers = submissions.value.filter(sub => sub.formType === 'registration');

    const foundUser = registeredUsers.find(
      u => u.email === email && u.password === password
    );

    if (foundUser) {
      isAuthenticated.value = true;
      user.value = {
        email: foundUser.email,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName
      };
      saveAuthState();
      return true;
    }

    return false;
  };

  /** Logout utilisateur */
  const logout = () => {
    isAuthenticated.value = false;
    user.value = null;
    clearAuthState();
  };

  /** Vérifier auth */
  const checkAuth = () => {
    if (!isAuthenticated.value) {
      return loadAuthState();
    }
    return isAuthenticated.value;
  };

  /** Est connecté */
  const isLoggedIn = () => {
    return isAuthenticated.value && user.value !== null;
  };

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
    isLoggedIn
  };
}
