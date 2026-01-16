import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { title: 'Accueil' }
    },
    {
      path: '/inscription',
      name: 'registration',
      component: () => import('@/views/RegistrationView.vue'),
      meta: { title: 'Inscription' }
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/ContactView.vue'),
      meta: { title: 'Contact' }
    },
    {
      path: '/newsletter',
      name: 'newsletter',
      component: () => import('@/views/NewsletterView.vue'),
      meta: { title: 'Newsletter' }
    },
    {
      path: '/question',
      name: 'question',
      component: () => import('@/views/QuestionView.vue'),
      meta: { title: 'Poser une question' }
    },
    {
      path: '/projet',
      name: 'project',
      component: () => import('@/views/ProjectView.vue'),
      meta: { title: 'Demande de projet' }
    },
    // Routes Admin
    {
      path: '/admin',
      redirect: '/admin/dashboard',
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('@/views/AdminLogin.vue'),
      meta: {
        title: 'Connexion Admin',
        guestOnly: true
      }
    },
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: () => import('@/views/AdminDashboard.vue'),
      meta: {
        title: 'Dashboard Admin',
        requiresAuth: true
      }
    }
  ]
});

router.beforeEach((to, _from, next) => {
  // Mettre à jour le titre de la page
  document.title = to.meta.title ? `${to.meta.title} | Forms App` : 'Forms App';

  // Vérifier l'authentification
  const { checkAuth } = useAuth();
  const isAuthenticated = checkAuth();

  // Protection des routes admin (requiresAuth)
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({
      name: 'admin-login',
      query: { redirect: to.fullPath }
    });
  }
  // Rediriger admin connecté depuis /login vers dashboard
  else if (to.meta.guestOnly && isAuthenticated) {
    next({ name: 'admin-dashboard' });
  }
  // Route autorisée
  else {
    next();
  }
});

export default router;