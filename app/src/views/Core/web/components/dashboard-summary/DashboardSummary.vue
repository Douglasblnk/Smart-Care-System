<template>
  <section class="dashboard-summary-container">
    <div class="summary-content m-3">
      <div class="summary-card p-3">
        <i v-if="isLoading" class="fa fa-spinner fa-spin fa-2x text-muted" />
        <i v-else-if="hasErrors" class="fa fa-exclamation-triangle fa-2x text-danger mb-2" />
        <h1 v-else class="text-muted">{{ orders.openOrders }}</h1>
        <span>Ordens abertas</span>
      </div>
      <div class="summary-card p-3">
        <i v-if="isLoading" class="fa fa-spinner fa-spin fa-2x text-muted" />
        <i v-else-if="hasErrors" class="fa fa-exclamation-triangle fa-2x text-danger mb-2" />
        <h1 v-else class="text-muted">{{ orders.currentOrders }}</h1>
        <span>Ordens em andamento</span>
      </div>
      <div class="summary-card p-3">
        <i v-if="isLoading" class="fa fa-spinner fa-spin fa-2x text-muted" />
        <i v-else-if="hasErrors" class="fa fa-exclamation-triangle fa-2x text-danger mb-2" />
        <h1 v-else class="text-muted">{{ orders.finishOrders }}</h1>
        <span>Ordens finalizadas</span>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'DashboardSummary',
  props: {
    orders: { type: Object, default: () => ({}) },
    isLoading: { type: Boolean, default: false },
    hasErrors: { type: Boolean, default: false },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-summary-container {
  .summary-content {
    width: 70vw;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 20px;
    .summary-card {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 200px;
      height: 180px;
      background-color: white;
      border-radius: 25px;
      box-shadow: 1px 1px 5px -4px black;
    }
  }
}
</style>
