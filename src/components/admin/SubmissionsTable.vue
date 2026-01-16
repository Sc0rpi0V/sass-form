<template>
  <div class="submissions-table">
    <div v-if="submissions.length === 0" class="empty-state">
      <p>Aucune soumission pour le moment.</p>
    </div>

    <div v-else class="table-wrapper">
      <div class="table-controls">
        <div class="items-per-page">
          <label for="items-select">Afficher:</label>
          <select id="items-select" v-model.number="itemsPerPage">
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
          <span class="total-text">sur {{ submissions.length }} résultat(s)</span>
        </div>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th
                v-for="col in columns"
                :key="col.key"
                @click="sortBy(col.key)"
                :class="{ sortable: true, active: sortKey === col.key }"
              >
                {{ col.label }}
                <span class="sort-icon" v-if="sortKey === col.key">
                  {{ sortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in paginatedData" :key="item.id" class="data-row">
              <td v-for="col in columns" :key="col.key">
                {{ formatValue(item[col.key], col.key) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination" v-if="totalPages > 1">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="pagination-btn"
        >
          ← Précédent
        </button>

        <span class="pagination-info">
          Page {{ currentPage }} sur {{ totalPages }}
        </span>

        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="pagination-btn"
        >
          Suivant →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  submissions: {
    type: Array,
    required: true,
    default: () => []
  },
  columns: {
    type: Array,
    required: true,
    default: () => []
  },
  type: {
    type: String,
    default: 'all'
  }
});

const itemsPerPage = ref(25);
const currentPage = ref(1);
const sortKey = ref('submittedAt');
const sortOrder = ref('desc');

// Reset page quand les données changent
watch(() => props.submissions, () => {
  currentPage.value = 1;
});

// Tri des données
const sortedData = computed(() => {
  if (!sortKey.value) return props.submissions;

  return [...props.submissions].sort((a, b) => {
    const aVal = a[sortKey.value];
    const bVal = b[sortKey.value];

    // Tri pour les dates
    if (sortKey.value === 'submittedAt') {
      const dateA = new Date(aVal);
      const dateB = new Date(bVal);
      return sortOrder.value === 'asc'
        ? dateA - dateB
        : dateB - dateA;
    }

    // Tri pour les strings
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortOrder.value === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    // Tri pour les nombres
    return sortOrder.value === 'asc'
      ? aVal - bVal
      : bVal - aVal;
  });
});

// Pagination
const totalPages = computed(() => {
  return Math.ceil(sortedData.value.length / itemsPerPage.value);
});

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return sortedData.value.slice(start, end);
});

// Méthodes
const sortBy = (key) => {
  if (sortKey.value === key) {
    // Toggle l'ordre
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
};

const formatValue = (value, key) => {
  if (value === null || value === undefined) return '-';

  // Format date
  if (key === 'submittedAt') {
    const date = new Date(value);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Format type de formulaire
  if (key === 'formType') {
    const types = {
      contact: 'Contact',
      registration: 'Inscription',
      newsletter: 'Newsletter',
      question: 'Question',
      project: 'Projet'
    };
    return types[value] || value;
  }

  // Format boolean
  if (typeof value === 'boolean') {
    return value ? 'Oui' : 'Non';
  }

  // Truncate long strings
  if (typeof value === 'string' && value.length > 50) {
    return value.substring(0, 50) + '...';
  }

  return value;
};
</script>

<style scoped lang="scss">
@use '@/assets/styles/index' as *;

.submissions-table {
  background: $color-background;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-md;
  overflow: hidden;
}

.empty-state {
  padding: $spacing-3xl;
  text-align: center;
  color: $color-text-light;
  font-size: $font-size-lg;
}

.table-wrapper {
  padding: $spacing-lg;
}

.table-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-lg;
  flex-wrap: wrap;
  gap: $spacing-md;
}

.items-per-page {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  font-size: $font-size-sm;
  color: $color-text;

  label {
    font-weight: 500;
  }

  select {
    padding: $spacing-xs $spacing-md;
    border: $border-width solid $color-border;
    border-radius: $border-radius;
    font-size: $font-size-sm;
    cursor: pointer;

    &:focus {
      outline: none;
      border-color: $color-primary;
    }
  }

  .total-text {
    color: $color-text-light;
  }
}

.table-container {
  overflow-x: auto;
  margin-bottom: $spacing-lg;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: $font-size-sm;

  thead {
    background: #f9fafb;
    border-bottom: 2px solid $color-border;

    th {
      padding: $spacing-md;
      text-align: left;
      font-weight: 600;
      color: $color-text;
      white-space: nowrap;
      user-select: none;

      &.sortable {
        cursor: pointer;
        transition: background-color $transition-speed;

        &:hover {
          background: #f3f4f6;
        }

        &.active {
          color: $color-primary;
        }
      }
    }
  }

  tbody {
    tr.data-row {
      border-bottom: 1px solid $color-border;
      transition: background-color $transition-speed;

      &:hover {
        background: #f9fafb;
      }

      &:last-child {
        border-bottom: none;
      }
    }

    td {
      padding: $spacing-md;
      color: $color-text;
    }
  }
}

.sort-icon {
  margin-left: $spacing-xs;
  font-size: $font-size-sm;
  color: $color-primary;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: $spacing-lg;
  padding-top: $spacing-lg;
  border-top: 1px solid $color-border;
}

.pagination-btn {
  padding: $spacing-sm $spacing-lg;
  background: $color-primary;
  color: white;
  border: none;
  border-radius: $border-radius;
  font-size: $font-size-sm;
  font-weight: 500;
  cursor: pointer;
  transition: all $transition-speed;

  &:hover:not(:disabled) {
    background: #2563eb;
    transform: translateY(-1px);
  }

  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    opacity: 0.6;
  }

  &:focus {
    outline: 2px solid $color-primary;
    outline-offset: 2px;
  }
}

.pagination-info {
  font-size: $font-size-sm;
  color: $color-text;
  font-weight: 500;
}
</style>
