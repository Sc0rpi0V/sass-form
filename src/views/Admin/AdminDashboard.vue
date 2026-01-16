<template>
  <div class="admin-dashboard">
    <!-- Header -->
    <header class="dashboard-header">
      <div class="container">
        <div class="header-content">
          <h1 class="dashboard-title">Dashboard Administrateur</h1>
          <div class="header-actions">
            <span class="user-info">{{ user?.name }}</span>
            <BaseButton variant="outline" @click="handleLogout" class="logout-btn">
              Déconnexion
            </BaseButton>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="dashboard-main">
      <div class="container">
        <!-- Stats Panel -->
        <StatsPanel :stats="stats" />

        <!-- Search Bar -->
        <SearchBar @search="handleSearch" />

        <!-- Tabs Navigation -->
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

        <!-- Submissions Table -->
        <SubmissionsTable
          :submissions="filteredSubmissions"
          :columns="currentColumns"
          :type="activeTab"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useSubmissions } from '@/composables/useSubmissions';
import BaseButton from '@/components/ui/BaseButton.vue';
import StatsPanel from '@/components/admin/StatsPanel.vue';
import SearchBar from '@/components/admin/SearchBar.vue';
import SubmissionsTable from '@/components/admin/SubmissionsTable.vue';

const router = useRouter();
const { user, logout } = useAuth();
const { submissions, getByType, search, getStats } = useSubmissions();

const activeTab = ref('all');
const searchQuery = ref('');

// Configuration des onglets
const tabs = [
  { key: 'all', label: 'Toutes' },
  { key: 'contact', label: 'Contact' },
  { key: 'registration', label: 'Inscription' },
  { key: 'newsletter', label: 'Newsletter' },
  { key: 'question', label: 'Questions' },
  { key: 'project', label: 'Projets' }
];

// Configuration des colonnes par type
const columnsConfig = {
  all: [
    { key: 'formType', label: 'Type' },
    { key: 'name', label: 'Nom' },
    { key: 'email', label: 'Email' },
    { key: 'submittedAt', label: 'Date' }
  ],
  contact: [
    { key: 'name', label: 'Nom' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Téléphone' },
    { key: 'subject', label: 'Sujet' },
    { key: 'submittedAt', label: 'Date' }
  ],
  registration: [
    { key: 'firstName', label: 'Prénom' },
    { key: 'lastName', label: 'Nom' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Téléphone' },
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

// Computed properties
const stats = computed(() => getStats());

const currentColumns = computed(() => {
  return columnsConfig[activeTab.value] || columnsConfig.all;
});

const filteredSubmissions = computed(() => {
  let data = activeTab.value === 'all'
    ? submissions.value
    : getByType(activeTab.value);

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();

    data = data.filter(sub => {
      const fieldsToSearch = [
        sub.name,
        sub.email,
        sub.subject,
        sub.firstName,
        sub.lastName,
        sub.company,
        sub.projectType,
        sub.category,
        sub.question
      ].filter(Boolean); 

      // Vérifie si champ contient query
      return fieldsToSearch.some(field =>
        field.toString().toLowerCase().includes(query)
      );
    });
  }

  return data;
});

const getCount = (type) => {
  if (type === 'all') return submissions.value.length;
  return getByType(type).length;
};

// Méthodes
const handleSearch = (query) => {
  searchQuery.value = query;
};

const handleLogout = () => {
  logout();
  router.push('/admin/login');
};
</script>

<style scoped lang="scss">
@use '@/assets/styles/index' as *;

.admin-dashboard {
  min-height: 100vh;
  background: #f3f4f6;
}

.dashboard-header {
  background: $color-background;
  border-bottom: 1px solid $color-border;
  padding: $spacing-xl 0;
  box-shadow: $shadow-sm;
  border-radius: 8px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: $spacing-lg;
  flex-wrap: wrap;
}

.dashboard-title {
  font-size: $font-size-3xl;
  font-weight: 700;
  color: $color-text;
  margin: 0;

  @include tablet {
    font-size: $font-size-4xl;
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: $spacing-lg;
}

.user-info {
  font-size: $font-size-sm;
  color: $color-text-light;
  font-weight: 500;
  display: none;

  @include tablet {
    display: block;
  }
}

.logout-btn {
  font-size: $font-size-sm;
}

.dashboard-main {
  padding: $spacing-2xl 0;
}

.tabs-nav {
  display: flex;
  gap: $spacing-sm;
  margin-bottom: $spacing-xl;
  overflow-x: auto;
  padding-bottom: $spacing-xs;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: $color-border;
    border-radius: 2px;
  }
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-md $spacing-lg;
  background: $color-background;
  border: 2px solid $color-border;
  border-radius: $border-radius-lg;
  font-size: $font-size-sm;
  font-weight: 500;
  color: $color-text;
  cursor: pointer;
  transition: all $transition-speed $transition-timing;
  white-space: nowrap;

  &:hover {
    border-color: $color-primary;
    transform: translateY(-1px);
  }

  &.active {
    background: $color-primary;
    color: white;
    border-color: $color-primary;
  }

  &:focus {
    outline: 2px solid $color-primary;
    outline-offset: 2px;
  }
}

.tab-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 $spacing-xs;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  font-size: $font-size-xs;
  font-weight: 600;

  .tab-btn.active & {
    background: rgba(255, 255, 255, 0.3);
  }
}
</style>
