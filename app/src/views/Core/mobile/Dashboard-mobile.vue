<template>
  <div class="root-dashboard-items">
    <div class="p-3 text-center">
      <h3 class="font-weight-light text-muted">Informações rápidas</h3>
    </div>

    <dashboard-summary
      :orders="orders"
      :is-loading="isLoading"
      :has-errors="hasErrors"
    />
    <hr>
    <div class="d-flex flex-row flex-wrap justify-content-center">
      <div v-for="(item, index) in dashboard" :key="`ìtem-${index}`" class="card-option">
        <template v-if="item.mobile">
          <card-option :title="item.name" :icon="item.icon" :route="item.link" size="small" />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import dashboard from './../../../utils/dashboard-module';

export default {
  name: 'dashboardItems',

  components: {
    dashboardSummary: () => import('../components/dashboard-summary-mobile/DashboardSummaryMobile.vue'),
  },
  props: {
    orders: { type: Object, default: () => ({}) },
    isLoading: { type: Boolean, default: false },
    hasErrors: { type: Boolean, default: false },
  },
  data() {
    return {
      dashboard,
    };
  },
};
</script>

<style lang="scss" scoped>
.root-dashboard-items {
  h3 {
    color: rgb(126, 126, 126);
  }
}
</style>
