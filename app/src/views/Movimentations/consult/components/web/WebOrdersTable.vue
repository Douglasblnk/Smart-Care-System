<template>
  <section class="root-web-orders-table">
    <div v-if="!maintenainceOrders.length && !isLoading">
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

    <div v-if="maintenainceOrders.length && !isLoading" class="custom-orders-table">
      <card full-width>
        <v-client-table
          ref="consultOrderTable"
          v-model="getFilteredOrders"
          :columns="WebConsultOrderTable.fields"
          :options="WebConsultOrderTable.options"
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
              small
              primary
              class="mb-2"
              :loading="isLoadingOrder[String(row.idOrdemServico)]"
              @click.native="openOrder(row)"
            >
              <i class="fa fa-file-alt mr-2" />
              <span>Detalhar</span>
            </smart-button>

            <smart-button
              small
              @click.native="openSummary(row)"
            >
              <i class="fa fa-eye mr-2" />
              <span>Resumo</span>
            </smart-button>
          </template>
        </v-client-table>
      </card>
    </div>
  </section>
</template>

<script>
import { getPriorityClass } from '../../../../../utils/utils';
import { WebConsultOrderTable } from '../../utils/tableConfig';

export default {
  name: 'WebOrdersTable',
  props: {
    maintenainceOrders: { type: Array, default: () => [] },
    getFilteredOrders: { type: Array, default: () => [] },
    isLoading: { type: Boolean, default: false },
    isLoadingOrder: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      moment: this.$moment,
      WebConsultOrderTable,
    };
  },
  methods: {
    getPriorityClass(priority) {
      return getPriorityClass(priority);
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
.root-web-orders-table {
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
}
</style>
