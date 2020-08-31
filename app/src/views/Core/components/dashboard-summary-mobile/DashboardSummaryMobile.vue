<template>
  <section class="dashboard-summary-container">
    <!-- <div class="summary-content m-3">
    </div> -->
    <div class="summary-card p-3 mr-3">
      <div class="title-summary-card text-center">
        <span>Ordens abertas</span>
        <i v-if="isLoading" class="fa fa-spinner fa-spin fa-2x text-muted" />
        <i v-else-if="hasErrors" class="fa fa-exclamation-triangle fa-2x text-danger mb-2" />
        <h1 v-else class="text-muted">{{ orders.openOrders }}</h1>
      </div>
    </div>
    <div class="summary-card p-3 ml-3">
      <div class="wrapper">
        <div class="title-summary-card text-center">
          <span>Ordens em andamento</span>
          <i v-if="isLoading" class="fa fa-spinner fa-spin fa-2x text-muted" />
          <i v-else-if="hasErrors" class="fa fa-exclamation-triangle fa-2x text-danger mb-2" />
          <h1 v-else class="text-muted">{{ orders.currentOrders }}</h1>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'DashboardSummaryMobile',
  props: {
    orders: { type: Object, default: () => ({}) },
    isLoading: { type: Boolean, default: false },
    hasErrors: { type: Boolean, default: false },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-summary-container {
  display: flex;
  justify-content: center;
  .summary-card {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 120px !important;
    height: 140px !important;
    padding: 20px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 1px 1px 5px -4px black;
    .title-summary-card {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
    }
  }
}
</style>
