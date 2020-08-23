<template>
  <section>
    <dashboard-summary
      :orders="orders"
      :is-loading="isLoading"
      :has-errors="hasErrors"
    />
    <div  v-if="loaded" class="Chart__container">
      <div class="Chart__title">
        Ordens por Semana dos Últimos 30 dias
      </div>
      <div class="chart__content">
        <line-chart
          v-if="loaded"
          :styles="customStyles"
          :chart-data="quantity"
          :chart-labels="labels"
          :optionStyle="chartStyle"
        />
      </div>
    </div>
  </section>
</template>

<script>
import LineChart from '../../../components/chart/chartLine.vue';

export default {
  name: 'DashboardWeb',
  components: {
    dashboardSummary: () => import('../components/dashboard-summary/DashboardSummary.vue'),
    LineChart,
  },
  props: {
    orders: { type: Object, default: () => ({}) },
    customStyles: { type: Object, default: () => ({}) },
    chartStyle: { type: Object, default: () => ({}) },
    quantity: { type: Array, default: () => ([]) },
    labels: { type: Array, default: () => ([]) },
    isLoading: { type: Boolean, default: false },
    hasErrors: { type: Boolean, default: false },
    loaded: { type: Boolean, default: false },
  },
};
</script>

<style lang="scss" scoped>
.Chart__container{
  .Chart__title{
    display: flex;
    justify-content: center;
  }
  .chart__content{
    display: flex;
    justify-content: center;

  }
}
</style>
