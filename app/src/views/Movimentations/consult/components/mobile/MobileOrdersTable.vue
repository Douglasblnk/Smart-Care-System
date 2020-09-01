<template>
  <section class="root-mobile-orders-table">
    <div v-if="!maintenainceOrders.length && !isLoading" class="d-flex align-items-center">
      <div class="text-center mb-5">
        <h4 class="font-weight-lighter" style="line-height: 40px; color: #adadad">Não há nenhuma Ordem de Manutenção cadastrada no sistema.</h4>
      </div>
    </div>

    <div v-if="isLoading">
      <card centered>
        <div class="d-flex align-items-center">
          <i style="color: #E66E6D" class="fa fa-spinner fa-spin mr-2 fa-lg" />
          <span style="color: #E66E6D">Buscando ordens de manutenção, aguarde...</span>
        </div>
      </card>
    </div>

    <div v-if="maintenainceOrders.length && !isLoading" class="custom-orders-table">
      <card full-width>
        <v-client-table
          ref="consultOrderTable"
          v-model="getFilteredOrders"
          :columns="MobileConsultOrderTable.fields"
          :options="MobileConsultOrderTable.options"
        >
          <template slot="idOrdemServico" slot-scope="{ row }">
            <div class="d-flex flex-column" @click.self="openOrder(row)">
              <strong>{{ row.resumo }}</strong>
              <div class="d-flex justify-content-between">
                <span>GRT12131DA{{ row.idOrdemServico }}</span>
                <small class="order-type">{{ row.tipo_manutencao }}</small>
              </div>
              <div class="my-2 d-flex flex-column">
                <div class="d-flex justify-content-between">
                  <span>Status: {{ row.status }}</span>
                  <span>{{ moment(row.dataEmissao).format('DD/MM/YYYY') }}</span>
                </div>
                <div class="d-flex align-items-center">
                  <span :class="getPriorityClass(row)">Prioridade: {{ row.prioridade }}</span>
                </div>
              </div>
              <div class="d-flex justify-content-end">
                <smart-button small class="mx-1" @click.native="openOrder(row)">
                  <span>Detalhar</span>
                </smart-button>
                <smart-button small @click.native="openSummary(row)">
                  <span>Resumo</span>
                </smart-button>
              </div>
            </div>
          </template>
        </v-client-table>
      </card>
    </div>
  </section>
</template>

<script>
import { getPriorityClass } from '../../../../../utils/utils';
import { MobileConsultOrderTable } from '../../utils/tableConfig';


export default {
  name: 'MobileOrdersTable',
  props: {
    maintenainceOrders: { type: Array, default: () => [] },
    getFilteredOrders: { type: Array, default: () => [] },
    isLoading: { type: Boolean, default: false },
    isLoadingOrder: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      moment: this.$moment,
      MobileConsultOrderTable,
    };
  },
  methods: {
    getPriorityClass({ prioridade }) {
      return getPriorityClass(prioridade);
    },
    openOrder(row) {
      this.$emit('update:openOrder', row);
    },
    openSummary(row) {
      this.$emit('update:openSummary', row);
    },
  },
};
</script>

<style lang="scss">
.root-mobile-orders-table {
  margin: 20px 0;
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
      line-height: 24px;
    }
    .col-md-12 {
      justify-content: space-between;
      display: flex !important;
      .VueTables__search {
        width: 100% !important;
        .VueTables__search-field {
          width: 100% !important;
          label {
            display: block !important;
          }
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
      &.row {
        margin: 0 !important;
      }
    }
    .pagination {
      flex-wrap: wrap;
      justify-content: center;
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
  }
}
</style>
