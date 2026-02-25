<template>
    <div class="admin-layout">
        <AdminSidebar />
        <div class="admin-content">
            <!-- Header -->
            <header class="search-header">
                <div class="container">
                    <div class="header-content">
                        <h1 class="page-title">Gestion des filtres de recherche</h1>
                        <BaseButton
                        variant="primary"
                        @click="createNewVersion"
                        >
                        + Nouvelle version
                        </BaseButton>
                    </div>
                </div>
            </header>

            <!-- Main Content -->
        </div>
    </div>
</template>

<script setup>
import AdminSidebar from '@/components/admin/sidebar/AdminSidebar.vue';
import BaseButton from '@/components/ui/base/BaseButton.vue';
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

.search-header {
  background: $color-background;
  border-bottom: 1px solid $color-border;
  padding: $spacing-xl 0;
  box-shadow: $shadow-sm;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: $spacing-lg;
  flex-wrap: wrap;
}

.page-title {
  font-size: $font-size-3xl;
  font-weight: 700;
  color: $color-text;
  margin: 0;

  @include tablet {
    font-size: $font-size-4xl;
  }
}

</style>