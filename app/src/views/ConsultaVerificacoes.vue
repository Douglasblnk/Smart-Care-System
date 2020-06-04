<template>
  <div class="content-verifications">
    <div class="card-title d-flex justify-content-center align-items-center">
      <span>Análise de Verificações</span>
    </div>
    <div class="table-verifications">
      <v-client-table v-model="listVerificationsStatus" :columns="columns" :options="options">
        <span slot="Solicitante" slot-scope="{row}">
          <i :class="row.icon_requester"></i>
        </span>
        <span slot="Reporte" slot-scope="{row}">
          <i :class="row.icon_report"></i>
        </span>
        <span slot="Manutentor" slot-scope="{row}">
          <i :class="row.icon_maintainer"></i>
        </span>
        
        <div slot="actions" slot-scope="props">
          <a target="_blank" :href="props.row.link" class="fas fa-eye fa-lg mb-2 eye"></a>
          <i class="fas fa-edit fa-lg mb-2" @click="openModalDetailVerifications(props.row)"></i>
        </div>
      </v-client-table>
    </div>
    
    <b-modal ref="my-modal" centered
             hide-footer hide-header title="Verificação de EPIs" @hide="resetModal()"
    >
      <div class="d-block text">
        <div class="text-center">
          <h3>Detalhes</h3>
        </div>
        <h4>
          Solicitante:
        </h4>
        <div class="my-3 d-flex flex-column">
          <span>
            Data Verificação:
            {{ this.$moment().format('DD-MM-YYYY') }}
          </span>
          <span>
            Problema Resolvido: Sim
          </span>
          <div class="pt-2">
            <h4>
              Administrador:
            </h4>
          </div>
          <div class="my-3 d-flex flex-column">
            <span>
              Data Verificação:
              {{ this.$moment().format('DD-MM-YYYY') }}
            </span>
            <span>
              Problema Resolvido: Sim
            </span>
          </div>
          <div class="pt-2">
            <h4>
              Manutentor:
            </h4>
          </div>
          <div class="my-3 d-flex flex-column">
            <span>
              Data Verificação:
              {{ this.$moment().format('DD-MM-YYYY') }}
            </span>
            <span>
              Problema Resolvido: Sim
            </span>
          </div>
        </div>
        <div v-if="modalHasError">
          <div class="d-flex justify-content-center w-100 p-2 rounded"
               style="background-color: #ff4a4a5c; border: 1px solid #ff4a4aa6"
          >
            <span style="color: black">{{ modalErrorMessage }}</span>
          </div>
        </div>
        <div class="d-flex justify-content-center">
          <cancel-button label="Fechar" @click.native="closeModal()" />
          <save-button label="Enviar" @click.native="alterEpiCheck()" />
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { getErrors, getLocalStorageToken } from '../utils/utils';

export default {
  data() {
    return {
      columns: ['ordemServico_idOrdemServico', 'Solicitante', 'Reporte', 'Manutentor','actions'],
      verifications_list: [],
      options: {
        headings: {
          ordemServico_idOrdemServico: create => create('span', {
            domProps: { innerHTML: 'Ordem <i class="fas fa-sort"></i>' },
          }),
          Solicitante: 'Solicitante',
          Reporte: 'Reporte',
          Manutentor: 'Manutentor',
          actions: 'Ações',
        },
        texts: {
          filter: '',
          filterPlaceholder: 'Buscar',
          count: 'Mostrando {from} até {to} de {count} registros|{count} Registros|Um Registro',
          limit: 'Registros:',
          page: 'Páginas:',
          noResults: 'Nenhum registro encontrado',
          loading: 'Carregando...',
        },
        sortable: ['ordemServico_idOrdemServico'],
      },
      typeVerifications: [1,2,3],
      modalHasError: false,
    };
  },
  computed: {
    listVerificationsStatus() {
      const orders = this.verifications_list.map(i => ( i.ordemServico_idOrdemServico));

      const orders_exist = [...new Set(orders)];

      const data_table = orders_exist.map(i => ({ ordemServico_idOrdemServico: i }));

      for (const order of orders_exist) {
        for (const round_order of this.typeVerifications) {
          const exist = this.verifications_list.find(i => i.ordemServico_idOrdemServico === order &&
                                                        i.tipoVerificacao === round_order);
          const order_id = data_table.findIndex(i => i.ordemServico_idOrdemServico === order);
          if (exist !== undefined && round_order === 1)
            data_table[order_id].icon_report = 'fas fa-check';
          else if (exist === undefined && round_order === 1)
            data_table[order_id].icon_report = 'fas fa-times';
          else if (exist !== undefined && round_order === 2)
            data_table[order_id].icon_maintainer = 'fas fa-check';
          else if (exist === undefined && round_order === 2)
            data_table[order_id].icon_maintainer = 'fas fa-times';
          else if (exist !== undefined && round_order === 3)
            data_table[order_id].icon_requester = 'fas fa-check';
          else if (exist === undefined && round_order === 3)
            data_table[order_id].icon_requester = 'fas fa-times';
          data_table[order_id].link = 'https://www.google.com.br/';
        }
      }

      return data_table;
    },
  },
  mounted() {
    this.listVerifications();
  },

  methods: {
    async listVerifications() {
      try {
        const { result } = await this.$http.get('verificacao/list-verification', getLocalStorageToken());
        if (result.length !== undefined)
          this.verifications_list = [...result];
        else this.verifications_list = [result];
        console.log('RESULT2', this.verifications_list);
      } catch (err) {
        console.log('err :>> ', err.response || err);
        return this.$swal({
          type: 'warning',
          title: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    openModalDetailVerifications(props) {
      this.showVerificationModal();
    },
    async showVerificationModal() {
      this.$refs['my-modal'].show();
    },
    resetModal() {
      this.modalHasError = false;
    },
  },
};
</script>

<style lang="scss">
    .content-verifications {
        font-family: "Avenir", Helvetica, Arial, sans-serif;
        text-align: center;
        color: #2c3e50;
        .card-title{
          span {
            font-family: 'roboto';
            font-size: 23px;
            color: #E66E6D;
          }
        }
        .eye{
            padding-left: 20px;
            padding-right: 20px;
        }
        .fa-check {
          font-size: 20px;
          color: rgb(174, 214, 183)
        }
        .fa-times {
          font-size: 20px;
          color: var(--duas-rodas)
        }
    }
</style>
