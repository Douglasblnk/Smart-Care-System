<template>
  <div class="root-dashboard-view">
    <template v-if="isMobile">
      <mobile-dashboard-items />
    </template>
    <template v-else>
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
      <div class="Chart__container" v-if="loaded">
        <div class="Chart__title">
          Ordens por Semana dos Últimos 30 dias
        </div>
        <div class="chart__content">
          <line-chart v-if="loaded" :styles="myStyles" :chart-data="quantity" :chart-labels="labels" :optionStyle="style" ></line-chart>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { getLocalStorageToken } from '../utils/utils';
import LineChart from '../../src/components/chart/chartLine.vue';

export default {

  components: {
    LineChart
  },
  
  data() {
    return {
      orders: {},
      hasErrors: false,
      isLoading: false,
      loaded: false,
      quantity: [],
      labels: [],
      style: {
        label: 'Ordens',
        borderColor: '#F34336',
        pointBackgroundColor: '#F34336',
        borderWidth: 2,
        pointBorderColor: '#F34336',
        backgroundColor: 'rgb(243,67,54,0.7)',
        responsive: true,
        maintainAspectRatio: false,
        legend: true,
        ticksY: true,
        gridLinesY: true,
        gridLinesX: false
      },
      myStyles: {
          height: '300px',
          width: '62vw'
      }
    };
  },

  mounted () {
    this.$store.commit('addPageName', 'Dashboard');

    this.getOrdersSummary();
    this.getLastOrderByMonth();
  },

  computed: {
    isMobile() {
      if (window.innerWidth <= '600') return true;
      return false;
    },
  },

  methods: {
    async getOrdersSummary() {
      try {
        this.isLoading = true;
        
        const orders = await this.$http.microserviceAnalisis('analysis/order-summary', getLocalStorageToken());

        if (!orders || orders === undefined)
          return this.hasErrors = true;
        
        this.orders = orders;
      } catch (err) {
        console.log('err dashboard => ', err);
        this.hasErrors = true;
      } finally {
        this.isLoading = false;
      }
    },
    async getLastOrderByMonth (){
      try {
        this.resetState()
        const response = await this.$http.microserviceAnalisis('analysis/last-month', getLocalStorageToken());
        this.quantity = response.map(order => order.Quantity);
        this.labels = response.map(order => this.$moment(order.OpeningDate).format('DD-MM-YYYY'));
        this.loaded = true;
      } catch (error) {
        console.log(error);
      }
    },
    resetState () {
      this.loaded = false
    }
  },
};
</script>

<style lang="scss" scoped>
.root-dashboard-view {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
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
      border-radius: 8px;
      box-shadow: 1px 1px 5px -4px black;
    }
  }
  .Chart__container{
    .Chart__title{
      display: flex;
      justify-content: center;
    }
    .chart__content{
      padding-left: 20px;
    }
  }
}
</style>
