<template>
  <div class="admin-layout">
    <AdminSidebar />
    <div class="admin-content">
      <header class="dashboard-header">
      <div class="container">
        <h1 class="dashboard-title">Dashboard Administrateur</h1>
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
        <div class="tabs-select">
          <select v-model="activeTab" class="tab-dropdown">
            <option
              v-for="tab in tabs"
              :key="tab.key"
              :value="tab.key"
            >
              {{ tab.label }} ({{ getCount(tab.key) }})
            </option>
          </select>
        </div>

        <SubmissionsTable
          :submissions="filteredSubmissions"
          :columns="currentColumns"
          :type="activeTab"
          @row-click="openModal"
          @archive="openArchiveConfirm"
        />

        <!-- Submission details modal -->
        <SubmissionModal
          v-if="isModalOpen && selectedSubmission"
          :submission="selectedSubmission"
          @close="closeModal"
          @answer="handleAnswer"
          @archive="confirmArchive"
        />

        <!-- Archive confirmation modal -->
        <ArchiveConfirmModal
          v-if="isArchiveModalOpen"
          @confirm="confirmArchive"
          @cancel="cancelArchive"
        />
      </div>
    </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useSubmissions } from '@/composables/submissions/useSubmissions';

import AdminSidebar from '@/components/admin/sidebar/AdminSidebar.vue';
import BaseButton from '@/components/ui/base/BaseButton.vue';
import StatsPanel from '@/components/admin/dashboard/StatsPanel.vue';
import SearchBar from '@/components/admin/dashboard/SearchBar.vue';
import SubmissionsTable from '@/components/admin/submissions/SubmissionsTable.vue';
import SubmissionModal from '@/components/ui/modals/SubmissionModal.vue';
import ArchiveConfirmModal from '@/components/ui/modals/ArchiveConfirmModal.vue';

/* -----------------------
   ROUTER
----------------------- */
const router = useRouter();

/* -----------------------
   DATA
----------------------- */
const { submissions, getByType, getStats, updateSubmissionStatus } = useSubmissions();

const activeTab = ref('all');
const searchQuery = ref('');

/* -----------------------
   MODALS STATE
----------------------- */
const selectedSubmission = ref(null);
const isModalOpen = ref(false);
const isArchiveModalOpen = ref(false);

/* -----------------------
   TABS CONFIG
----------------------- */
const tabs = [
  { key: 'all', label: 'Toutes' },
  { key: 'contact', label: 'Contact' },
  { key: 'registration', label: 'Inscription' },
  { key: 'newsletter', label: 'Newsletter' },
  { key: 'question', label: 'Questions' },
  { key: 'project', label: 'Projets' },
  { key: 'payment', label: 'Paiements' },
  { key: 'survey', label: 'Sondages' },
  { key: 'search', label: 'Recherches' },
  { key: 'contentUpload', label: 'Soumissions de contenu' },
  { key: 'archived', label: 'Archivées' }
];

/* -----------------------
   TABLE COLUMNS
----------------------- */
const columnsConfig = {
  all: [
    { key: 'formType', label: 'Type' },
    { key: 'firstName', label: 'Prénom' },
    { key: 'lastName', label: 'Nom' },
    { key: 'email', label: 'Email' },
    { key: 'submittedAt', label: 'Date' }
  ],
  payment: [
    { key: 'firstName', label: 'Prénom' },
    { key: 'lastName', label: 'Nom' },
    { key: 'email', label: 'Email' },
    { key: 'paymentMethod', label: 'Méthode de paiement' },
    { key: 'amount', label: 'Montant' },
    { key: 'submittedAt', label: 'Date' }
  ]
};

/* -----------------------
   COMPUTED
----------------------- */
const stats = computed(() => getStats());

const currentColumns = computed(() => {
  return columnsConfig[activeTab.value] || columnsConfig.all;
});

/* -----------------------
   FILTERED SUBMISSIONS
----------------------- */
const filteredSubmissions = computed(() => {
  let data = submissions.value;

  // Archivées
  if (activeTab.value === 'archived') {
    data = data.filter(s => s.status === 'archived');
  } else {
    // Actives
    data = data.filter(s => s.status !== 'archived');

    if (activeTab.value !== 'all') {
      data = data.filter(s => s.formType === activeTab.value);
    }
  }

  // Search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    data = data.filter(sub =>
      Object.values(sub)
        .filter(Boolean)
        .some(val =>
          val.toString().toLowerCase().includes(query)
        )
    );
  }

  return data;
});

/* -----------------------
   COUNTS
----------------------- */
const getCount = (type) => {
  if (type === 'archived') {
    return submissions.value.filter(s => s.status === 'archived').length;
  }

  if (type === 'all') {
    return submissions.value.filter(s => s.status !== 'archived').length;
  }

  return submissions.value.filter(
    s => s.formType === type && s.status !== 'archived'
  ).length;
};

/* -----------------------
   MODAL HANDLERS
----------------------- */
const openModal = (submission) => {
  // statut par défaut si absent
  if (!submission.status) {
    submission.status = 'new';
  }

  selectedSubmission.value = submission;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedSubmission.value = null;
};

/* -----------------------
   ACTIONS
----------------------- */
const handleAnswer = (submission) => {
  if (submission.email) {
    window.location.href = `mailto:${submission.email}`;
  }

  submission.status = 'answered';
};

const openArchiveConfirm = (submission) => {
  selectedSubmission.value = submission;
  isArchiveModalOpen.value = true;
};

const confirmArchive = () => {
  if (!selectedSubmission.value) return;

  updateSubmissionStatus(
    selectedSubmission.value.id,
    selectedSubmission.value.formType,
    'archived'
  );

  activeTab.value = 'archived';

  isArchiveModalOpen.value = false;
  isModalOpen.value = false;
  selectedSubmission.value = null;
};

const cancelArchive = () => {
  isArchiveModalOpen.value = false;
};

/* -----------------------
   SEARCH
----------------------- */
const handleSearch = (query) => {
  searchQuery.value = query;
};
</script>

<style scoped lang="scss">
@use '@/assets/styles/index' as *;

.admin-layout {
  display: flex;
  min-height: 100vh;
}

.admin-content {
  flex: 1;
  margin-left: 250px;
  background: #f3f4f6;

  @include tablet {
    margin-left: 0;
  }
}

.dashboard-header {
  background: $color-background;
  border-bottom: 1px solid $color-border;
  padding: $spacing-xl 0;
  box-shadow: $shadow-sm;
  border-radius: 8px;
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

.dashboard-main {
  padding: $spacing-2xl 0;
}

.tabs-select {
  margin-bottom: $spacing-xl;
}

.tab-dropdown {
  padding: $spacing-md $spacing-lg;
  border-radius: $border-radius-lg;
  border: 2px solid $color-border;
  font-size: $font-size-sm;
  background: $color-background;
  cursor: pointer;
}

.tab-count {
  min-width: 20px;
  padding: 0 $spacing-xs;
  border-radius: 10px;
  font-weight: 600;
}
</style>
