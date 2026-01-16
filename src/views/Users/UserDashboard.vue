<template>
  <div class="user-dashboard">
    <header class="dashboard-header">
      <div class="container flex justify-between items-center">
        <h1>Mon Compte</h1>
        <div class="header-actions">
          <span>{{ user?.firstName }} {{ user?.lastName }}</span>
          <BaseButton variant="outline" @click="handleLogout">Déconnexion</BaseButton>
        </div>
      </div>
    </header>

    <main class="dashboard-main container">
      <!-- Tabs -->
      <div class="tabs-nav">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="['tab-btn', { active: activeTab === tab.key }]"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
          <span class="tab-count">{{ getCount(tab.key) }}</span>
        </button>
      </div>

      <!-- Table des soumissions -->
      <SubmissionsTable
        :submissions="filteredSubmissions"
        :columns="currentColumns"
        :type="activeTab"
      />
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserAuth } from '@/composables/useUserAuth';
import { useSubmissions } from '@/composables/useSubmissions';
import BaseButton from '@/components/ui/BaseButton.vue';
import SubmissionsTable from '@/components/admin/SubmissionsTable.vue';

const router = useRouter();
const { user, logout } = useUserAuth();
const { submissions, getByType } = useSubmissions();

const activeTab = ref('all');

const tabs = [
  { key: 'all', label: 'Toutes' },
  { key: 'contact', label: 'Contact' },
  { key: 'registration', label: 'Inscription' },
  { key: 'newsletter', label: 'Newsletter' },
  { key: 'question', label: 'Questions' },
  { key: 'project', label: 'Projets' }
];

const columnsConfig = {
  all: [
    { key: 'formType', label: 'Type' },
    { key: 'submittedAt', label: 'Date' }
  ],
  registration: [
    { key: 'firstName', label: 'Prénom' },
    { key: 'lastName', label: 'Nom' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Téléphone' },
    { key: 'submittedAt', label: 'Date' }
  ],
  contact: [
    { key: 'name', label: 'Nom' },
    { key: 'email', label: 'Email' },
    { key: 'subject', label: 'Sujet' },
    { key: 'submittedAt', label: 'Date' }
  ],
  newsletter: [
    { key: 'firstName', label: 'Prénom' },
    { key: 'lastName', label: 'Nom' },
    { key: 'email', label: 'Email' },
    { key: 'consent', label: 'Consentement' },
    { key: 'submittedAt', label: 'Date' }
  ],
  question: [
    { key: 'name', label: 'Nom' },
    { key: 'email', label: 'Email' },
    { key: 'category', label: 'Catégorie' },
    { key: 'question', label: 'Question' },
    { key: 'submittedAt', label: 'Date' }
  ],
  project: [
    { key: 'company', label: 'Entreprise' },
    { key: 'name', label: 'Nom' },
    { key: 'email', label: 'Email' },
    { key: 'projectType', label: 'Type' },
    { key: 'budget', label: 'Budget' },
    { key: 'submittedAt', label: 'Date' }
  ]
};

const currentColumns = computed(() => columnsConfig[activeTab.value] || columnsConfig.all);

// Filtrer uniquement les soumissions de l'utilisateur connecté
const filteredSubmissions = computed(() => {
  const userEmail = user.value?.email;
  let data = activeTab.value === 'all' ? submissions.value : getByType(activeTab.value);
  return data.filter(sub => sub.email === userEmail);
});

const stats = computed(() => {
  const userEmail = user.value?.email;
  const stats = {};
  tabs.forEach(tab => {
    const typeData = tab.key === 'all' ? submissions.value : getByType(tab.key);
    stats[tab.key] = typeData.filter(sub => sub.email === userEmail).length;
  });
  return stats;
});

const getCount = (type) => stats.value[type] || 0;

const handleLogout = () => {
  logout();
  router.push('/user/login');
};
</script>

<style scoped lang="scss">
.user-dashboard {
    .dashboard-header {
        padding: 1.5rem 0;
        border-bottom: 1px solid #e5e7eb;
        border-radius: 8px;
        background: #ffffff;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);

        .container {
            display: flex;
            justify-content: space-between;
            align-items: center;

            h1 {
                font-size: 1.75rem;
                font-weight: 700;
                color: #1f2937;
            }

            .header-actions {
                display: flex;
                align-items: center;
                gap: 2rem; 
                font-size: 0.95rem;
                font-weight: 500;
                color: #374151;

                span {
                display: inline-block;
                }

                button {
                padding: 0.5rem 1rem;
                font-size: 0.875rem;
                }

                /* Responsive : moins d’espace sur mobile */
                @media (max-width: 640px) {
                flex-direction: column;
                align-items: flex-end;
                gap: 0.5rem;
                }
            }
        }
    }
    .dashboard-main {
        padding: 2rem 0;

        /* Section tabs */
        .tabs-nav {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 2rem;
            overflow-x: auto;
            padding-bottom: 0.5rem;

            /* Scrollbar léger pour overflow horizontal */
            &::-webkit-scrollbar {
                height: 4px;
            }
            &::-webkit-scrollbar-thumb {
                background: rgba(156, 163, 175, 0.5);
                border-radius: 2px;
            }

            .tab-btn {
                display: flex;
                align-items: center;
                gap: 0.25rem;
                padding: 0.5rem 1rem;
                border: 2px solid #d1d5db;
                border-radius: 0.5rem;
                background: #ffffff;
                color: #1f2937;
                font-weight: 500;
                cursor: pointer;
                white-space: nowrap;
                transition: all 0.2s ease;

                &:hover {
                border-color: #f59e0b;
                transform: translateY(-1px);
                }

                &.active {
                background: #f59e0b;
                color: white;
                border-color: #f59e0b;
                }

                .tab-count {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                min-width: 20px;
                height: 20px;
                padding: 0 0.25rem;
                font-size: 0.75rem;
                font-weight: 600;
                border-radius: 9999px;
                background: rgba(0, 0, 0, 0.1);

                .tab-btn.active & {
                    background: rgba(255, 255, 255, 0.3);
                }
                }
            }
        }
    }
}
</style>
