<template>
  <div class="content-consult-verification">
    <transition name="slide-side" mode="out-in">
      <div v-if="state.view === 'verifications'" key="verifications" class="content-verifications">
        <div class="card-title d-flex justify-content-center align-items-center">
          <h3>Análise de Verificações</h3>
        </div>
        <card full-width>
          <div class="table-verifications">
            <v-client-table
              ref="table_verification"
              v-model="listVerificationsStatus"
              :columns="verificationsData.columns"
              :options="verificationsData.options"
            >
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
                <h3>Situação de Verificações</h3>
              </div>
              <div class="my-3 d-flex flex-column">
                <div v-if="rowModalOpen.ordemServico_idOrdemServico !== undefined">
                  <div v-for="(item, index) in modalData" :key="`ìtem-${index}`">
                    <h3>
                      {{ item.user_description }}:
                    </h3>
                    <div v-if="item.problemaResolvido !== undefined">
                      <span class="user_detail_verification">
                        <i class="fas fa-calendar-alt"></i>
                        {{ item.dataVerificacao }}
                      </span>
                      <div>
                        <span class="user_detail_verification">
                          <i class="fas fa-lightbulb"></i>
                          Problema: {{ item.problemaResolvidoDescricao }}
                        </span>
                      </div>
                    </div>
                    <div v-if="item.problemaResolvido == undefined" class="user_detail_verification">
                      <p>Verificação Pendente</p>
                    </div>
                  </div>
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
                <smart-button label="Fechar" @click.native="closeModal()">
                  Fechar
                </smart-button>
              </div>
            </div>
          </b-modal>
        </card>
      </div>
    </transition>
  </div>
</template>

<script>
import { getErrors, getToken } from '../../../../utils/utils';
export default {
  name: 'PendingVerificationsWeb',
  props: {
    verificationsData: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  data() {
    return {
      state: {
        view: 'verifications',
      },
      detail: {
        order: {},
      },
      data_modal: [],
      rowModalOpen: {},
      typeVerifications: [1, 2, 3],
      modalHasError: false,
    };
  },
  computed: {
    listVerificationsStatus() {
      const orders = this.verificationsData.verifications_list.map(i => ( i.ordemServico_idOrdemServico));

      const orders_exist = [...new Set(orders)];

      const data_table = orders_exist.map(i => this.verificationsData.verifications_list.find(j => j.ordemServico_idOrdemServico === i));

      for (const order of orders_exist) {
        for (const round_order of this.typeVerifications) {
          const exist = this.verificationsData.verifications_list.find(i => i.ordemServico_idOrdemServico === order &&
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
    modalData() {
      const data_modal = [];
      if (this.rowModalOpen.ordemServico_idOrdemServico !== undefined) {
        for (const i of this.typeVerifications) {
          data_modal.push({ ...this.verificationsData.verifications_list.find(
            j => j.ordemServico_idOrdemServico === this.rowModalOpen.ordemServico_idOrdemServico &&
                j.tipoVerificacao === i) });
          if (data_modal[i-1] !== undefined) {
            data_modal[i-1].dataVerificacao = this.$moment(data_modal[i-1].dataVerificacao)
              .format('DD-MM-YYYY');
          }
          if (data_modal[i-1].problemaResolvido === '0')
            data_modal[i-1].problemaResolvidoDescricao = 'Não Resolvido';
          else if (data_modal[i-1].problemaResolvido === '1')
            data_modal[i-1].problemaResolvidoDescricao = 'Resolvido';
          
          if (i === 1)
            data_modal[i-1].user_description = 'Administrador';
          if (i === 2)
            data_modal[i-1].user_description = 'Manutentor';
          if (i === 3)
            data_modal[i-1].user_description = 'Solicitante';
        }
        return data_modal;
      }
      return false;
    },
  },

  mounted() {
    console.log('verificationsData: ', this.verificationsData);
    this.$store.commit('addPageName', 'Verificações');
  },

  methods: {
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

        const { result } = await this.$http.post('ordem-manutencao/detail', {
          order,
        });

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
    async openModalDetailVerifications(row) {
      this.rowModalOpen = row;
      this.showVerificationModal();
    },
    async showVerificationModal() {
      this.$refs['my-modal'].show();
    },
    closeModal() {
      this.$refs['my-modal'].hide();
    },
    closeDetail() {
      this.$store.commit('addPageName', 'Verificações');
      this.$set(this.state, 'view', 'verifications');
    },
  },
};
</script>

<style lang="scss">
  .user_detail_verification{
    font-size: 20px;
  }
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
          li {
            width:50px;
          }
        }
        //.VuePagination__pagination-item page-item
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
          h3 {
            font-family: 'roboto';
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
