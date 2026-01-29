import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '@/composables/auth/useAuth';
import { useUserAuth } from '@/composables/auth/useUserAuth';

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
    {
      path: '/paiement',
      name: 'payment',
      component: () => import('@/views/PaymentView.vue'),
      meta: { title: 'Demande de paiement' }
    },
    {
      path: '/sondage',
      name: 'survey',
      component: () => import('@/views/SurveyView.vue'),
      meta: { title: 'Sondage' }
    },
    {
      path: '/recherche',
      name: 'search',
      component: () => import('@/views/SearchView.vue'),
      meta: { title: 'Recherche' }
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
      component: () => import('@/views/Admin/AdminLogin.vue'),
      meta: {
        title: 'Connexion Admin',
        guestOnly: true
      }
    },
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: () => import('@/views/Admin/AdminDashboard.vue'),
      meta: {
        title: 'Dashboard Admin',
        requiresAuth: true
      }
    },
    {
      path: '/user/login',
      name: 'user-login',
      component: () => import('@/views/Users/UserLogin.vue'),
      meta: { title: 'Connexion', guestOnly: true }
    },
    {
      path: '/user/dashboard',
      name: 'user-dashboard',
      component: () => import('@/views/Users/UserDashboard.vue'),
      meta: { title: 'Mon Compte', requiresUserAuth: true }
    }
  ]
});

router.beforeEach((to, _from, next) => {
  document.title = to.meta.title ? `${to.meta.title} | Forms App` : 'Forms App';

  // Vérifier auth utilisateur
  const { checkAuth, isLoggedIn } = useUserAuth();
  const isUserAuthenticated = isLoggedIn() || checkAuth();

  if (to.meta.requiresUserAuth && !isUserAuthenticated) {
    next({ name: 'user-login', query: { redirect: to.fullPath } });
  } else if (to.meta.guestOnly && isUserAuthenticated) {
    next({ name: 'user-dashboard' });
  } else {
    next();
  }
});

export default router;