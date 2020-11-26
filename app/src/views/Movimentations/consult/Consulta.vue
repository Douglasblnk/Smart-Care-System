<template>
  <div
    class="root-consulta-view"
    :class="(!maintenainceOrders.length && isMobile && !isLoading)
      ? 'd-flex justify-content-center align-items-center'
      : ''
    "
  >
    <back-button @goBack="goBack" />
    
    <transition name="slide-side" mode="out-in">
      <div v-if="state.view === 'list'" key="list" :class="isMobile ? '' : 'p-3'">
        <consult-filters
          :filters="filters"
          :option="option"
          :show-options="showOptions"
          :options-data="optionsData"
          @update:setFiltersType="setFiltersType"
          @update:setFilter="setFilter"
          @update:closeFilterOptions="closeFilterOptions"
        />

        <filter-settled
          v-if="maintenainceOrders.length > 0"
          :filters="filters"
          :is-filter-settled="isFilterSettled"
          @update:clearFilters="clearFilters"
        />

        <orders-table
          :maintenaince-orders="maintenainceOrders"
          :is-loading="isLoading"
          :get-filtered-orders="getFilteredOrders"
          :is-loading-order="isLoadingOrder"
          @update:openOrder="openOrder"
          @update:openSummary="openSummary"
        />
      </div>

      <div v-if="state.view === 'detail'" key="detail">
        <detalhamento
          :order="detail.order"
          @state-list="closeDetail"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ConsultFilters from './components/ConsultFilters.vue';
import FilterSettled from './components/FilterSettled.vue';
import OrdersTable from './components/OrdersTable.vue';
import { getErrors, getPriorityClass, isObjectEmpty } from '../../../utils/utils';

export default {
  name: 'Consulta',
  components: {
    Detalhamento: () => import('../detail/Detalhamento.vue'),
    ConsultFilters,
    FilterSettled,
    OrdersTable,
  },
  props: {
    type_route: { type: String, default: '' },
    order_verification: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      moment: this.$moment,
      state: {
        view: 'list',
      },
      detail: {
        order: {},
      },
      isLoading: false,
      isLoadingOrder: {},
      maintenainceOrders: [],
      filters: {
        status: '',
        data: '',
        priority: '',
        myOrders: '',
        orderType: '',
      },
      showOptions: false,
      option: '',
      optionsData: {
        status: [],
        priority: [],
        orderType: [],
      },
    };
  },
  computed: {
    getFilteredOrders() {
      let filteredOrder = this.maintenainceOrders;

      if (this.filters.status)
        filteredOrder = filteredOrder.filter(order => order.status === this.filters.status);

      if (this.filters.data) {
        filteredOrder = filteredOrder.filter(
          order => this.$moment(order.dataEmissao).isSame(this.$moment(this.filters.data))
        );
      }

      if (this.filters.priority) {
        filteredOrder = filteredOrder.filter(
          order => order.prioridade === this.filters.priority
        );
      }

      if (this.filters.myOrders) {
        filteredOrder = filteredOrder.filter(
          order => order.Manutentor === this.filters.myOrders,
        );
      }
      
      if (this.filters.orderType) {
        filteredOrder = filteredOrder.filter(
          order => order.tipo_manutencao === this.filters.orderType,
        );
      }

      return filteredOrder;
    },
    isFilterSettled() {
      if (
        this.filters.status
        || this.filters.data
        || this.filters.priority
        || this.filters.myOrders
        || this.filters.orderType
      )
        return true;

      return false;
    },
    getPriorityClass(priority) {
      return getPriorityClass(priority);
    },
    ...mapGetters({
      isMobile: 'getIsMobile',
    }),
  },

  created() {
    this.verifyRoute();
  },
  
  mounted() {
    this.$store.commit('addPageName', 'Consultas');
    this.$store.commit('setMainIcon', 'fa-search');

    this.getOrdersMaintenance();
    this.getStatus();
    this.getPriority();
    this.getOrderType();
  },

  methods: {
    async verifyRoute() {
      if (this.type_route === 'verification') {
        this.$set(this.detail, 'order', this.order_verification);
        this.setStateView('detail');
      }
    },
    async setFiltersType(type) {
      if (!this.option) this.option = type;

      if (this.showOptions === false) {
        this.showOptions = true;
        return;
      }

      if (this.option === type) {
        this.option = '';
        this.showOptions = false;
        return;
      }

      this.option = type;
    },
    setFilter(type, filter) {
      if (this.filters[type] === filter)
        this.filters[type] = '';
      else this.filters[type] = filter;
    },
    openSummary(order) {
      this.$swal({
        html: `
          <style>
            .no-margin { margin: 0 !important; }
          </style>
          <div>
            <h3>${order.resumo}</h3>
            <span>${this.$moment(order.dataEmissao).fromNow()}</span>
          </div>
          <div class="mt-5 mx-3" style="text-align: start">
            <div class="d-flex">
              <div class="col-md-6 no-padding">
                <div class="d-flex flex-column my-2">
                  <label class="no-margin"><strong>Ordem: </strong></label>
                  <span>
                    ${order.idOrdemServico}
                  </span>
                </div>
              </div>

              <div class="col-md-6 no-padding">
                <div class="d-flex flex-column my-2">
                  <label class="no-margin"><strong>Tipo da ordem: </strong></label>
                  <span>
                    ${order.tipo_manutencao}
                  </span>
                </div>
              </div>
            </div>

            <div class="d-flex flex-column my-2">
              <label class="no-margin"><strong>Descrição: </strong></label>
              <span>
                ${order.descricao}
              </span>
            </div>

            <hr>

            <div class="d-flex">
              <div class="col-md-6 no-padding">
                <div class="d-flex flex-column my-2">
                  <label class="no-margin"><strong>Prioridade: </strong></label>
                  <span class="${getPriorityClass(order.prioridade)}">
                    ${order.prioridade}
                  </span>
                </div>
              </div>
              <div class="col-md-6 no-padding">
                <div class="d-flex flex-column my-2">
                  <label class="no-margin"><strong>Prioridade: </strong></label>
                  <span>
                    ${order.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        `,
        confirmButtonColor: '#F34336',
      });
    },
    openOrder(order) {
      this.$store.commit('addPageName', `Consultas | ${order.idOrdemServico}`);

      this.getOrderDetail(order);
    },
    closeDetail() {
      this.$store.commit('addPageName', 'Consultas');
      this.setStateView('list');
    },
    async getOrderDetail(order) {
      if (this.isLoadingOrder[String(order.idOrdemServico)]) return;

      try {
        this.$set(this.isLoadingOrder, String(order.idOrdemServico), true);

        const response = await this.$http.get('ordem-manutencao', {
          headers: { order: order.idOrdemServico },
        });

        if (!response || isObjectEmpty(response))
          throw new Error(`Não foi possível buscar os detalhes da ordem ${order}`);

        this.setStateView('detail');
        this.$set(this.detail, 'order', response);
        
        this.$http.setActivity(this.$activities.ORDER_DETAIL, JSON.stringify({ order: order.idOrdemServico }));
      } catch (err) {
        console.log('err getOrderDetail :>> ', err.response || err);

        this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      } finally {
        this.$set(this.isLoadingOrder, String(order.idOrdemServico), false);
      }
    },
    async getOrdersMaintenance() {
      try {
        this.isLoading = true;

        const response = await this.$http.get('ordem-manutencao');

        if (response.length === 0) return;

        if (response.length === undefined)
          this.maintenainceOrders.push(response);
        else this.maintenainceOrders = [...response];

        this.$http.setActivity(this.$activities.ORDER_MAINTENANCE_QUERY);
      } catch (err) {
        this.isLoading = false;
        console.log('error getOrderMaintence =>', err.response || err);

        this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      } finally {
        this.isLoading = false;
      }
    },
    async getStatus() {
      try {
        const response = await this.$http.get('status');

        this.optionsData.status = [...response];
      } catch (err) {
        console.log('error getStatus :', err.response || err);
      }
    },
    async getPriority() {
      try {
        const response = await this.$http.get('prioridade');

        this.optionsData.priority = [...response];
      } catch (err) {
        console.log('err getPriority => :', err.response || err);
      }
    },
    async getOrderType() {
      try {
        const response = await this.$http.get('tipo-ordem');

        this.optionsData.orderType = [...response];
      } catch (err) {
        console.log('err getOrderType => :', err.response || err);
      }
    },
    clearFilters() {
      this.$set(this.filters, 'status', '');
      this.$set(this.filters, 'data', '');
      this.$set(this.filters, 'priority', '');
      this.$set(this.filters, 'myOrders', '');
      this.$set(this.filters, 'orderType', '');

      this.option = '';
      this.showOptions = false;
    },
    closeFilterOptions() {
      this.option = '';
      this.showOptions = false;
    },
    getSearchableString(order) {
      const string = `
        ${order.resumo.toLowerCase()}
        ${order.descricao.toLowerCase()}
        ${String(order.idOrdemServico).toLowerCase()}
      `;
      return string;
    },
    goBack() {
      if (this.state.view === 'detail') {
        this.$store.commit('addPageName', 'Consultas');
        return this.setStateView('list');
      }
      this.$router.push('/dashboard');
    },
    setStateView(view) {
      this.state.view = view;
    },
  },
};
</script>

<style lang="scss" scoped>
.root-consulta-view {
  height: 100%;
}
</style>
