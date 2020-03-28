<template>
  <div class="root-consulta-view">
    <transition name="slide-side" mode="out-in">
      <div v-if="state.view === 'list'" key="list">
        <div class="p-3" style="max-width: 600px">
          <simple-input
            white
            v-model="filters.search"
            placeholder="Buscar por ordem de manutenção..."
            label="Buscar: "
          />
          <div class="p-2 filters">
            <p>Filtros: </p>

            <span
              @click="setFilters('status')"
              :class="(filters.status.idStatus || option === 'status') ? 'selected' : ''"
            >
              Status
            </span>

            <span
              @click="setFilters('data')"
              :class="(filters.data || option === 'data') ? 'selected' : ''"
            >
              Data
            </span>

            <span
              @click="setFilters('priority')"
              :class="(filters.priority.idPrioridade || option === 'priority') ? 'selected' : ''"
            >
              Prioridade
            </span>

            <span>Minhas OS</span>
          </div>
          
          <transition name="slide-down" mode="out-in">
            <div v-if="showOptions" key="status" class="options-container p-3">
              <transition name="slide-side" mode="out-in">
                <div v-if="option === 'status'" key="status" class="d-flex flex-row">
                  <div v-for="(status, index) in optionsData.status" :key="`status-${index}`">
                    <div class="filters">
                      <span
                        @click="setStatusFilter(status)"
                        :class="filters.status.idStatus === status.idStatus ? 'selected' : ''"
                        style="border: 1px solid #dddddd"
                      >
                        {{ status.tipoStatus }}
                      </span>
                    </div>
                  </div>
                </div>

                <div v-if="option === 'data'" key="data" class="col-md-12">
                  <simple-button @btn-click="() => filters.data = ''" label="Limpar campo"/>
                  <simple-input v-model="filters.data" white type="date" />
                </div>

                <div v-if="option === 'priority'" key="priority" class="d-flex flex-row">
                  <div v-for="(priority, index) in optionsData.priority" :key="`status-${index}`">
                    <div class="filters">
                      <span
                      @click="setPriorityFilter(priority)"
                      :class="filters.priority.idPrioridade === priority.idPrioridade ? 'selected' : ''"
                      style="border: 1px solid #dddddd">{{ priority.descricaoPrioridade }}</span>
                    </div>
                  </div>
                </div>
                
                <div v-if="option === 'myOrders'" key="myOrders" class="d-flex flex-row">
                  // todo
                </div>
              </transition>
            </div>
          </transition>
        </div>

        <div class="p-3 col-md-12">
          <div v-if="isFilterSetted" class="mx-2 d-flex justify-content-between">
            <div>
              <span class="mx-2">Filtros selecionados: </span>

              <span class="mx-1">
                {{ filters.status.tipoStatus ? `Status: ${filters.status.tipoStatus}` : '' }}
              </span>

              <span class="mx-1">
                {{ filters.data ? `Data: ${$moment(filters.data).format('DD-MM-YYYY')}` : '' }}
              </span>

              <span class="mx-1">
                {{ filters.priority.descricaoPrioridade ? `Prioridade: ${filters.priority.descricaoPrioridade}` : '' }}
              </span>
            </div>
            <div class="mx-2">
              <simple-button @btn-click="clearFilters()" label="Limpar filtros"/>
            </div>
          </div>

          <div class="orders-container m-2 p-3">
            <template v-if="!maintenainceOrders">
              <div class="d-flex justify-content-center">
                <span style="color: #E66E6D">Não há nenhuma Ordem de Manutenção cadastrada no sistema.</span>
              </div>
            </template>

            <template v-if="maintenainceOrders">
              <div class="orders-header">
                <div v-for="(items, index) in tableHeader" :key="`items-${index}`" :class="items.class">
                  <span>{{ items.title }}</span>
                </div>
              </div>

              <template v-if="getFilteredOrders.length === 0 && !isLoading">
                <div class="m-4 d-flex justify-content-center">
                  <strong class="text-muted">Nenhuma ordem de manutenção encontrada!</strong>
                </div>
              </template>

              <template v-if="isLoading">
                <div class="m-4 d-flex justify-content-center">
                  <div class="mx-2 d-flex align-items-center justify-content-center">
                    <i class="fa fa-spinner fa-spin text-muted" />
                  </div>
                  <strong class="text-muted">
                    Buscando as ordens...
                  </strong>
                </div>
              </template>

              <div v-for="(order, index) in getFilteredOrders" :key="`order-${index}`" class="order-body">
                <div class="col-md-1">
                  {{ order.idOrdemServico }}
                </div>

                <div class="col-md-3">
                  {{ order.resumo }}
                </div>

                <div class="col-md-1">
                  {{ order.Prioridade_idPrioridade }}
                </div>

                <div class="col-md-2">
                  {{ $moment(order.dataEmissao).format('DD-MM-YYYY') }}
                </div>

                <div class="col-md-1">
                  {{ order.Status_idStatus }}
                </div>

                <div class="col-md-2 m-2">
                  <div class="">
                    <simple-button
                      prefix="fa-file-alt"
                      label="Detalhar"
                      @click.native="openOrder(order)"
                    />

                    <simple-button
                      prefix="fa-eye"
                      label="Resumo"
                      @click.native="openSummary(order)"
                    />
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
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
import Detalhamento from './Detalhamento.vue';
import { getLocalStorageToken } from '../utils/utils';

export default {
  name: 'Consulta',
  
  components: {
    Detalhamento,
  },

  data() {
    return {
      state: {
        view: 'list',
      },
      detail: {
        order: {},
      },
      isLoading: false,
      maintenainceOrders: [],
      filters: {
        search: '',
        status: {},
        data: '',
        priority: {},
      },
      showOptions: false,
      option: '',
      optionsData: {
        status: {},
      },
      tableHeader: [
        { title: 'Ordem', class: 'col-md-1' },
        { title: 'Titulo', class: 'col-md-3' },
        { title: 'Prioridade', class: 'col-md-1' },
        { title: 'Emissão', class: 'col-md-2' },
        { title: 'Status', class: 'col-md-1' },
        { title: 'Ações', class: 'col-md-2' },
      ],
    };
  },

  mounted() {
    this.getOrderMaintence();
    this.getStatus();
    this.getPriority();
  },

  computed: {
    getFilteredOrders() {
      let filteredOrder = this.maintenainceOrders;

      if (this.filters.status.idStatus)
        filteredOrder = filteredOrder.filter(order => order.Status_idStatus === this.filters.status.idStatus);

      if (this.filters.data)
        filteredOrder = filteredOrder.filter(
          order => this.$moment(order.dataEmissao).isSame(this.$moment(this.filters.data))
        );
      
      if (this.filters.priority.idPrioridade)
        filteredOrder = filteredOrder.filter(
          order => order.Prioridade_idPrioridade === this.filters.priority.idPrioridade
        );

      return filteredOrder.filter(order => {
        const searchableString = this.getSearchableString(order);

        if (searchableString.match(this.filters.search.toLowerCase()))
          return order;
      });
    },
    isFilterSetted() {
      if (this.filters.status.idStatus)
        return true;
      if (this.filters.data)
        return true;
      if (this.filters.priority.idPrioridade)
        return true;
      
      return false;
    },
  },

  methods: {
    async setFilters(type) {
      if (!this.option) this.option = type;

      if (this.showOptions === false)
        return this.showOptions = true;

      if (this.option === type) {
        this.option = '';
        return this.showOptions = false;
      }

      this.option = type;
    },
    setStatusFilter(status) {
      if (this.filters.status.idStatus === status.idStatus)
        return this.filters.status = {};
      this.filters.status = status;
    },
    setPriorityFilter(priority) {
      console.log('priority :', priority);
      if (this.filters.priority.idPrioridade === priority.idPrioridade)
        return this.filters.priority = {};
      this.filters.priority = priority;
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
            <div class="d-flex flex-column my-2">
              <label class="no-margin"><strong>Ordem: </strong></label>
              <span>
                ${order.idOrdemServico}
              </span>
            </div>
            <div class="d-flex flex-column my-2">
              <label class="no-margin"><strong>Descrição: </strong></label>
              <span>
                ${order.descricao}
              </span>
            </div>
          </div>
        `,
        confirmButtonColor: '#F34336',
      });
    },
    openOrder(order) {
      this.$set(this.state, 'view', 'detail');
      this.$set(this.detail, 'order', order);
    },
    closeDetail() {
      this.$set(this.state, 'view', 'list');
    },
    getOrderMaintence() {
      this.isLoading = true;
      this.$http.methodGet('ordem-manutencao', getLocalStorageToken())
        .then(res => {
          if (res.result.length === 0) return;

          if (res.result.length === undefined)
            this.maintenainceOrders.push(res.result);
          else this.maintenainceOrders = [ ...res.result ];

          this.isLoading = false;

          this.$setActivity(
            'orderMaintanceQuery',
            {
              ...this.$store.state.user,
              date: this.$moment().format('DD-MM-YYYY HH-mm'),
              descricao: `${this.$store.state.user.nome} fez uma consulta de ordem de manutenção`,
            },
            getLocalStorageToken(),
          );
        });
    },
    async getStatus() {
      this.$http.methodGet('status/get', getLocalStorageToken())
        .then(res => {
          if (res.result.length === 0) return this.$swal({
            type: 'warning',
            title: 'Não foi possível carregar os status!',
            confirmButtonColor: '#F34336',
          });
          return this.optionsData.status = res.result;
        });
    },
    async getPriority() {
      this.$http.methodGet('prioridade/get', getLocalStorageToken())
        .then(res => {
          if (res.result.length === 0) return this.$swal({
            type: 'warning',
            title: 'Não foi possível carregar os status!',
            confirmButtonColor: '#F34336',
          });
          return this.optionsData.priority = res.result;
        });
    },
    clearFilters() {
      this.$set(this.filters, 'status', {});
      this.$set(this.filters, 'data', '');
      this.$set(this.filters, 'priority', {});

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
  },
};
</script>

<style lang="scss" scoped>
.root-consulta-view {
  .options-container {
    display: flex;
    border-top: 1px solid #dddddd;
    border-bottom: 1px solid #dddddd;
  }
  .filters {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    span {
      margin: 5px 5px;
      padding: 10px 20px;
      background-color: rgb(255, 255, 255);
      border-radius: 50px;
      cursor: pointer;
      &:hover {
        background-color: var(--duas-rodas-soft);
        color: white;
      }
    }
    p {
      margin: 0;
    }
  }
  .orders-container {
    background-color: white;
    border-radius: 10px;
    .orders-header {
      background-color: var(--duas-rodas);
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      padding: 20px 0;
      span{color: white;}
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid rgb(216, 216, 216);
    }
    .order-body {
      background-color: rgb(241, 241, 241);
      // border-radius: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &:nth-child(odd) {
        background-color: white;
      }
      &:hover {
        background-color: #ebebeb;
      }
    }
  }
  .selected {
    background-color: var(--duas-rodas-soft) !important;
    color: white;
  }
  span {
    color: var(--gray)
  }
}
</style>