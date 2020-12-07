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
              :columns="tableConfig.columns"
              :options="tableConfig.options"
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

              <div slot="actions" slot-scope="{row}" class="d-flex justify-content-center">
                <div class="d-flex flex-column">
                  <smart-button
                    primary
                    small
                    :loading="isLoading"
                    class="my-1"
                    @click.native="openOrder(row)"
                  >
                    <i class="fas fa-external-link-alt mx-1" />

                    <p class="smart">
                      Acessar
                    </p>
                  </smart-button>

                  <smart-button
                    small
                    class="my-1"
                    @click.native="openModalDetailVerifications(row)"
                  >
                    <i class="fas fa-eye mx-1" />
                    
                    <p class="smart">
                      Detalhar
                    </p>
                  </smart-button>
                </div>
              </div>
            </v-client-table>
          </div>

          <b-modal
            ref="verificationDetail"
            centered
            hide-header
            hide-footer
            @hide="resetModal()"
          >
            <div>
              <div class="text-center">
                <h3 style="font-family:'Avenir', Helvetica, Arial, sans-serif; padding:10px">Situação das Verificações</h3>
              </div>
              
              <b-tabs content-class="mt-3">
                <b-tab
                  v-for="(item, index) in modalData"
                  :key="`item-${index}`"
                  :title="item.user_description"
                  active
                  style="font-family:'Avenir', Helvetica, Arial, sans-serif; padding:10px"
                >
                  <div style="margin: 1em">
                    <div v-if="getUserName(item)">
                      <div class="d-flex">
                        <div style="flex: 1;font-family:'Avenir', Helvetica, Arial, sans-serif">
                          <strong>Nome:</strong>
                          <p>{{ getUserName(item) }}</p>
                        </div>

                        <div style="flex: 1; font-family:'Avenir', Helvetica, Arial, sans-serif">
                          <strong>Data da verificação:</strong>
                          <p>{{ $moment(item.dataVerificacao).format('DD/MM/YYYY') }}</p>
                        </div>
                      </div>

                      <div class="d-flex">
                        <div style="flex: 1; font-family:'Avenir', Helvetica, Arial, sans-serif">
                          <strong>Situação:</strong>
                          <p
                            :style="`color: ${(item.problemaResolvido === '1') ? 'green' : 'red'}`"
                          >
                            {{ (item.problemaResolvido === '1') ? 'Resolvido' : 'Não resolvido' }}
                          </p>
                        </div>

                        <div v-if="item.solucaoRealizada" style="flex: 1;font-family:'Avenir', Helvetica, Arial, sans-serif">
                          <strong>Observação:</strong>
                          <p>{{ item.solucaoRealizada }}</p>
                        </div>
                      </div>
                    </div>

                    <p v-else style="font-size: 1rem; font-family:'Avenir', Helvetica, Arial, sans-serif" class="text-center">
                      Não há verificações registradas.
                    </p>
                  </div>
                </b-tab>
              </b-tabs>

              <div class="d-flex justify-content-center" style="margin: 10px 0">
                <smart-button
                  class="mx-1"
                  circle
                  @click.native="closeModal()"
                >
                  <span>
                    Fechar
                  </span>
                </smart-button>

                <smart-button
                  primary
                  circle
                  :loading="isLoading"
                  class="mx-1"
                  @click.native="openOrder(modalData)"
                >
                  <i class="fa fa-external-link-alt fa-fw mr-2" />

                  <span>
                    Acessar Ordem
                  </span>
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
import { getErrors } from '../../../../utils/utils';

export default {
  name: 'PendingVerificationsWeb',
  props: {
    tableConfig: { type: Object, required: true, default: () => ({}) },
    verifications: { type: Array, required: true, default: () => [] },
  },
  data() {
    return {
      state: {
        view: 'verifications',
      },
      data_modal: [],
      rowModalOpen: {},
      typeVerifications: [1, 2, 3],
      modalHasError: false,
      isLoading: false,
    };
  },
  computed: {
    listVerificationsStatus() {
      const ordersId = this.getOrdersId();

      const data_table = ordersId.map(
        orderId => this.verifications.find(
          verification => verification.ordemServico_idOrdemServico === orderId,
        )
      );
    
      for (const orderId of ordersId) {
        for (const round_order of this.typeVerifications) {
          const exist = this.verifications.find(
            i => i.ordemServico_idOrdemServico === orderId
              && i.tipoVerificacao === round_order
          );

          const order_id = data_table.findIndex(i => i.ordemServico_idOrdemServico === orderId);

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
          const { name_maintainer, name_report, name_requester } = this.rowModalOpen;

          data_modal.push({
            ...this.verifications.find(
              j => j.ordemServico_idOrdemServico === this.rowModalOpen.ordemServico_idOrdemServico
                && j.tipoVerificacao === i
            ),
            ...{ name_maintainer, name_report, name_requester },
          });

          if (i === 1) data_modal[i-1].user_description = 'Administrador';
          if (i === 2) data_modal[i-1].user_description = 'Manutentor';
          if (i === 3) data_modal[i-1].user_description = 'Solicitante';
        }
        
        return data_modal;
      }
      return false;
    },
  },
  mounted() {
    this.$store.commit('addPageName', 'Verificações');
  },
  methods: {
    getOrdersId() {
      const ordersId = this.verifications.map(i => (i.ordemServico_idOrdemServico));
  
      return [...new Set(ordersId)];
    },
    resetModal() {
      this.modalHasError = false;
      this.data_modal = [];
    },
    async openOrder(order) {
      try {
        if (this.isLoading) return;
        this.isLoading = true;

        const { ordemServico_idOrdemServico } = this.getOrderId(order);
  
        const response = await this.getOrderDetail(ordemServico_idOrdemServico);

        this.$store.commit('addPageName', `Consultas | ${ordemServico_idOrdemServico}`);
  
        this.$router.push({
          name: 'Consultas',
          params: {
            type_route: 'verification',
            order_verification: response,
          },
        });
      } catch (err) {
        console.log('err openOrder :>> ', err.response || err);

        this.$swal({
          type: 'warning',
          text: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      } finally {
        this.isLoading = false;
      }
    },
    getOrderId(order) {
      if (Array.isArray(order) && order.length !== undefined)
        return order.find(i => i.ordemServico_idOrdemServico);
      
      return order;
    },
    async getOrderDetail(ordemServico_idOrdemServico) {
      const response = await this.$http.get('ordem-manutencao', {
        headers: { order: ordemServico_idOrdemServico },
      });

      return response;
    },
    async openModalDetailVerifications(row) {
      this.rowModalOpen = row;
      this.showVerificationModal();
    },
    async showVerificationModal() {
      this.$refs['verificationDetail'].show();
    },
    closeModal() {
      this.$refs['verificationDetail'].hide();
    },
    closeDetail() {
      this.$store.commit('addPageName', 'Verificações');
      this.$set(this.state, 'view', 'verifications');
    },
    getUserName({
      name_maintainer,
      name_report,
      name_requester,
      tipoVerificacao,
    }) {
      if (tipoVerificacao === 1) return name_report || undefined;
      if (tipoVerificacao === 2) return name_maintainer || undefined;
      if (tipoVerificacao === 3) return name_requester || undefined;
    },
  },
};
</script>

<style lang="scss">
.content-consult-verification {
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
        font-family: 'Nunito';
        color: #E66E6D;
      }
    }

    .eye {
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
