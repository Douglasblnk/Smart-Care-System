<template>
  <div class="content-consult-verification">
    <transition name="slide-side" mode="out-in">
      <div v-if="state.view === 'verifications'" key="verifications" class="content-verifications">
        <card fullWidth>
          <div class="card-title d-flex justify-content-center align-items-center">
            <span>Análise de Verificações</span>
          </div>
          <div class="table-verifications">
            <v-client-table v-model="listVerificationsStatus" :columns="columns" :options="options">
              <span slot="Solicitante" slot-scope="{row}" style="font-size: 2em;">
                <i :class="row.icon_requester"></i>
              </span>
              <span slot="Reporte" slot-scope="{row}" style="font-size: 2em;">
                <i :class="row.icon_report"></i>
              </span>
              <span slot="Manutentor" slot-scope="{row}" style="font-size: 2em;">
                <i :class="row.icon_maintainer"></i>
              </span>
              
              <div slot="actions" slot-scope="props">
                <a target="_blank" class="fas fa-eye fa-lg mb-2 eye"
                   @click="openOrder(props.row)"
                ></a>
                <i class="fas fa-edit fa-lg mb-2" @click="openModalDetailVerifications(props.row)"></i>
              </div>
            </v-client-table>
          </div>
          
          <b-modal ref="my-modal" centered
                   hide-footer hide-header title="Verificação de EPIs" @hide="resetModal()"
          >
            <div class="d-block text">
              <div class="text-center">
                <h3>Detalhes Verificações</h3>
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
                <div v-if="data_modal[1] != undefined" class="my-3 d-flex flex-column">
                  <span>
                    Data Verificação:
                    {{ data_modal[1].dataVerificacao }}
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
        </card>
      </div>
    </transition>
  </div>
</template>

<script>
import { getErrors, getLocalStorageToken } from '../utils/utils';

export default {
  data() {
    return {
      state: {
        view: 'verifications',
      },
      detail: {
        order: {},
      },
      data_modal: [],
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
          limit: '',
          page: 'Páginas:',
          noResults: 'Nenhum registro encontrado',
          loading: 'Carregando...',
        },
        perPage: 10,
        perPageValues: [10, 25, 50],
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

      const data_table = orders_exist.map(i => this.verifications_list.find(j => j.ordemServico_idOrdemServico === i));

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
        }
      }
      return data_table;
    },
  },
  mounted() {
    this.listVerifications();
    this.$store.commit('addPageName', 'Verificações');
  },

  methods: {
    async listVerifications() {
      try {
        const { result } = await this.$http.get('verificacao/list-verification', getLocalStorageToken());
        if (result.length !== undefined)
          this.verifications_list = [...result];
        else this.verifications_list.push(result);
      } catch (err) {
        console.log('err :>> ', err.response || err);
        return this.$swal({
          type: 'warning',
          title: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    openModalDetailVerifications(row) {
      for (let i = 1; i <= 3; i++) {
        this.data_modal.push({ ...this.verifications_list.find(
          j => j.ordemServico_idOrdemServico === row.ordemServico_idOrdemServico &&
               j.tipoVerificacao === i) });
        if (this.data_modal[i-1] !== undefined) {
          this.data_modal[i-1].dataVerificacao = this.$moment(this.data_modal[i-1].dataVerificacao)
            .format('DD-MM-YYYY');
        }
      }
      this.showVerificationModal();
    },
    async showVerificationModal() {
      this.$refs['my-modal'].show();
    },
    resetModal() {
      this.modalHasError = false;
      this.data_modal = [];
    },
    openOrder(props) {
      this.getOrderDetail(props);
    },
    async getOrderDetail(props) {
      try {
        const order = { idOrdemServico: props.ordemServico_idOrdemServico };

        const { result } = await this.$http.post('ordem-manutencao/detail', getLocalStorageToken(), {
          order,
        });

        console.log('result :>> ', result);

        this.$set(this.detail, 'order', result);
        this.$store.commit('addPageName', `Consultas | ${props.ordemServico_idOrdemServico}`);

        this.$router.push({
          name: 'Consultas',
          params: {
            type_route: 'verification',
            order_verification: result,
          },
        });
      } catch (err) {
        console.log('err getOrderDetail :>> ', err.response || err);

        this.$swal({
          type: 'warning',
          text: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    closeDetail() {
      this.$store.commit('addPageName', 'Verificações');
      this.$set(this.state, 'view', 'verifications');
    },
  },
};
</script>

<style lang="scss">
  .content-consult-verification{
    .content-verifications {
        font-family: "Avenir", Helvetica, Arial, sans-serif;
        text-align: center;
        color: #2c3e50;
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
  }
</style>
