<template>
  <div class="root-consulta-view">
    <transition name="slide-side" mode="out-in">
      <div v-if="state.view === 'list'" key="list">
        <div class="d-flex align-items-center">
          <div class="back-button ml-3" @click="goBack">
            <i
              class="fa fa-arrow-left fa-fw"
              title="Retornar"
            />
            <span>Voltar</span>
          </div>
        </div>

        <div class="p-3">
          <div class="p-2 filters">
            <p>Filtros: </p>

            <span
              :class="(filters.status || option === 'status') ? 'selected' : ''"
              @click="setFiltersType('status')"
            >
              Status
            </span>

            <span
              :class="(filters.data || option === 'data') ? 'selected' : ''"
              @click="setFiltersType('data')"
            >
              Data
            </span>

            <span
              :class="(filters.priority || option === 'priority') ? 'selected' : ''"
              @click="setFiltersType('priority')"
            >
              Prioridade
            </span>

            <span
              :class="(filters.orderType || option === 'orderType') ? 'selected' : ''"
              @click="setFiltersType('orderType')"
            >
              Tipo de Manutenção
            </span>

            <span
              :class="(filters.myOrders) ? 'selected' : ''"
              @click="setFilter('myOrders', $store.state.user.cracha)"
            >
              Minhas OS
            </span>
          </div>

          <transition name="slide-down" mode="out-in">
            <div v-if="showOptions" key="status" class="options-container p-3">
              <transition name="slide-side" mode="out-in">
                <div v-if="option === 'status'" key="status" class="d-flex flex-row">
                  <div v-for="(status, index) in optionsData.status" :key="`status-${index}`">
                    <div class="filters">
                      <span
                        :class="filters.status === status.tipoStatus ? 'selected' : ''"
                        style="border: 1px solid #dddddd"
                        @click="setFilter('status', status.tipoStatus)"
                      >
                        {{ status.tipoStatus }}
                      </span>
                    </div>
                  </div>
                </div>

                <div v-if="option === 'data'" key="data" class="col-md-3">
                  <simple-input v-model="filters.data" white type="date" />
                </div>

                <div v-if="option === 'priority'" key="priority" class="d-flex flex-row">
                  <div v-for="(priority, index) in optionsData.priority" :key="`status-${index}`">
                    <div class="filters">
                      <span
                        :class="filters.priority === priority.descricaoPrioridade ? 'selected' : ''"
                        style="border: 1px solid #dddddd"
                        @click="setFilter('priority', priority.descricaoPrioridade)"
                      >
                        {{ priority.descricaoPrioridade }}
                      </span>
                    </div>
                  </div>
                </div>

                <div v-if="option === 'orderType'" key="orderType" class="d-flex flex-row">
                  <div v-for="(type, index) in optionsData.orderType" :key="`status-${index}`">
                    <div class="filters">
                      <span
                        :class="filters.orderType === type.tipoManutencao ? 'selected' : ''"
                        style="border: 1px solid #dddddd"
                        @click="setFilter('orderType', type.tipoManutencao)"
                      >
                        {{ type.tipoManutencao }}
                      </span>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </transition>
        </div>

        <div class="p-3 col-md-12">
          <div v-if="isFilterSettled" class="mx-2 d-flex justify-content-between mb-2">
            <div>
              <span class="mx-2">Filtros selecionados: </span>

              <span v-if="filters.status" class="mx-1">
                <strong>Status: </strong> {{ filters.status }}
              </span>

              <span v-if="filters.data" class="mx-1">
                <strong>Data: </strong> {{ $moment(filters.data).format('DD-MM-YYYY') }}
              </span>

              <span v-if="filters.priority" class="mx-1">
                <strong>Prioridade: </strong> {{ filters.priority }}
              </span>

              <span v-if="filters.orderType" class="mx-1">
                <strong>Tipo de manutenção: </strong> {{ filters.orderType }}
              </span>

              <span v-if="filters.myOrders" class="mx-1">
                <strong>Manutentor: </strong> {{ filters.myOrders }}
              </span>
            </div>
            <smart-button primary @click.native="clearFilters()">
              <span>Limpar Filtros</span>
            </smart-button>
          </div>

          <div v-if="!maintenainceOrders">
            <card centered>
              <span style="color: #E66E6D">Não há nenhuma Ordem de Manutenção cadastrada no sistema.</span>
            </card>
          </div>

          <div v-if="isLoading">
            <card centered>
              <div class="d-flex align-items-center">
                <i style="color: #E66E6D" class="fa fa-spinner fa-spin mr-2 fa-lg" />
                <span style="color: #E66E6D">Buscando ordens de manutenção, aguarde...</span>
              </div>
            </card>
          </div>

          <div v-if="maintenainceOrders && !isLoading" class="custom-orders-table">
            <card fullWidth>
              <v-client-table
                ref="consultOrderTable"
                v-model="getFilteredOrders"
                :columns="consultOrderTable.fields"
                :options="consultOrderTable.options"
              >
                <template slot="resumo" slot-scope="{ row }">
                  <div class="d-flex flex-column">
                    <span>{{ row.resumo }}</span>
                    <div class="d-flex">
                      <small class="order-type">{{ row.tipo_manutencao }}</small>
                    </div>
                  </div>
                </template>

                <template slot="dataEmissao" slot-scope="{ row }">
                  <span>{{ moment(row.dataEmissao).format('DD-MM-YYYY') }}</span>
                </template>

                <template slot="prioridade" slot-scope="{ row }">
                  <i class="fa fa-circle fa-fw" :class="getPriorityClass(row.prioridade)" />
                  <span :class="getPriorityClass(row.prioridade)">{{ row.prioridade }}</span>
                </template>

                <template slot="actions" slot-scope="{ row }">
                  <smart-button
                    simple
                    class="mb-2"
                    :loading="isLoadingOrder[String(row.idOrdemServico)]"
                    @click.native="openOrder(row)"
                  >
                    <i class="fa fa-file-alt mr-2" />
                    <span>Detalhar</span>
                  </smart-button>

                  <smart-button
                    simple
                    @click.native="openSummary(row)"
                  >
                    <i class="fa fa-eye mr-2" />
                    <span>Resumo</span>
                  </smart-button>
                </template>
              </v-client-table>
            </card>
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
import { getLocalStorageToken, getErrors, getPriorityClass } from '../../utils/utils';
import { consultOrderTable } from './utils/tableConfig';

export default {
  name: 'Consulta',

  components: {
    Detalhamento: () => import('./Detalhamento.vue'),
  },

  data() {
    return {
      moment: this.$moment,
      getPriorityClass,
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
      consultOrderTable,
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
        this.filters.status ||
        this.filters.data ||
        this.filters.priority ||
        this.filters.myOrders ||
        this.filters.orderType
      )
        return true;

      return false;
    },
  },
  
  mounted() {
    this.$store.commit('addPageName', 'Consultas');

    this.getOrdersMaintences();
    this.getStatus();
    this.getPriority();
    this.getOrderType();
  },

  methods: {
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
      this.$set(this.state, 'view', 'list');
    },
    async getOrderDetail(order) {
      if (this.isLoadingOrder[String(order.idOrdemServico)]) return;

      try {
        this.isLoadingOrder[String(order.idOrdemServico)] = true;

        const { result } = await this.$http.post('ordem-manutencao/detail', getLocalStorageToken(), {
          order,
        });

        this.$set(this.state, 'view', 'detail');
        this.$set(this.detail, 'order', result);
      } catch (err) {
        console.log('err getOrderDetail :>> ', err.response || err);

        this.$swal({
          type: 'warning',
          text: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      } finally {
        this.isLoadingOrder[String(order.idOrdemServico)] = false;
      }
    },
    async getOrdersMaintences() {
      try {
        this.isLoading = true;

        const response = await this.$http.get('ordem-manutencao/summary', getLocalStorageToken());

        if (response.result.length === 0) return;

        if (response.result.length === undefined)
          this.maintenainceOrders.push(response.result);
        else this.maintenainceOrders = [...response.result];

        this.$http.setActivity(
          'orderMaintanceQuery',
          {
            ...this.$store.state.user,
            date: this.$moment().format('DD-MM-YYYY HH-mm'),
            descricao: `${this.$store.state.user.nome} fez uma consulta de ordem de manutenção`,
          },
          getLocalStorageToken(),
        );
      } catch (err) {
        this.isLoading = false;
        console.log('error getOrderMaintence =>', err.response);

        this.$swal({
          type: 'error',
          text: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      } finally {
        this.isLoading = false;
      }
    },
    async getStatus() {
      try {
        const response = await this.$http.get('status/get', getLocalStorageToken());

        if (response.result.length === 0)
          throw 'Não foi possível buscar os status ou não há nenhuma status cadastrado';

        this.optionsData.status = [...response.result];
      } catch (err) {
        console.log('error getStatus :', err.response || err);

        this.$swal({
          type: 'warning',
          text: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    async getPriority() {
      try {
        const response = await this.$http.get('prioridade/get', getLocalStorageToken());

        this.optionsData.priority = [...response.result];
      } catch (err) {
        console.log('err getPriority => :', err.response || err);

        return this.$swal({
          type: 'warning',
          text: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    async getOrderType() {
      try {
        const response = await this.$http.get('tipo-ordem/get', getLocalStorageToken());

        this.optionsData.orderType = [...response.result];
      } catch (err) {
        console.log('err getOrderType => :', err.response || err);

        return this.$swal({
          type: 'warning',
          text: getErrors(err),
          confirmButtonColor: '#F34336',
        });
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
    getSearchableString(order) {
      const string = `
        ${order.resumo.toLowerCase()}
        ${order.descricao.toLowerCase()}
        ${String(order.idOrdemServico).toLowerCase()}
      `;
      return string;
    },
    goBack() {
      this.$router.push('/dashboard');
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
  .priority-pointer {
    border-radius: 100%;
    padding: 5px;
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

<style lang="scss">
.custom-orders-table {
  table {
    border-radius: 8px;
    thead {
      th {
        background-color: var(--duas-rodas-soft);
        span {
          cursor: pointer;
          color: white !important;
        }
        border: 0 !important;
        outline: none;
      }
    }
    tbody {
      tr {
        td {
          border: 0 !important;
          vertical-align: middle;
          outline: none;
        }
      }
    }
  }
  .order-type {
    background-color: #d9534f;
    padding: 0 10px;
    color: white !important;
    border-radius: 8px;
  }
  .col-md-12 {
    justify-content: space-between;
    display: flex !important;
    .VueTables__search-field {
      width: 30vw !important;
      input {
        width: 100%;
      }
    }
  }
  .VuePagination {
    display: flex;
    justify-content: center;
    p {
      display: flex;
      justify-content: center;
    }
  }
  .page-item .active {
    color: white !important;
    border-color: #ddd !important;
    background-color: var(--duas-rodas-soft) !important;
    &:focus {
      box-shadow: none !important;
    }
  }
  .page-link {
    color: #555 !important;
    &:focus {
      box-shadow: none !important;
    }
  }
  .idOrdemServico-class {
    width: 100px !important;
  }
  .resumo-class {
    width: 300px !important;
    min-width: 200px !important;
  }
  .prioridade-class {
    width: 130px !important;
  }
  .dataEmissao-class {
    width: 100px !important;
  }
  .status-class {
    width: 100px !important;
  }
  .actions-class {
    width: 100px !important;
  }
}

</style>
