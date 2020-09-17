<template>
  <div class="root-detalhamento-view">
    <transition name="slide-side" mode="out-in">
      <div v-if="state.view === 'detail'" class="detail-content">
        <detail-card-wrapper
          :order="order"
          :is-order-assumed="isOrderAssumed"
          :order-manutentor="getOrderManutentor"
          :is-loading="isLoading"
          @update:orderMovimentations="orderMovimentations"
          @update:excludeOrder="excludeOrder"
          @update:openIntiveTechnician="openIntiveTechnician"
          @update:openOrderNote="openOrderNote"
          @update:openOrderVerification="openOrderVerification"
        />
      </div>

      <div v-if="state.view === 'Verification'" key="Verification">
        <order-verification
          :order="order"
          @state-list="changeViewToDetail"
          @change-status="changeOrderVerificationStatus"
        />
      </div>

      <div v-if="state.view === 'Note'" key="Note">
        <order-note
          :order="order"
          @state-list="changeViewToDetail"
        />
      </div>
    </transition>

    <b-modal
      ref="my-modal"
      centered
      hide-footer
      hide-header
      title="Verificação de EPIs"
      @hide="resetModal()"
      @show="checkSelectedEpis()"
    >
      <div class="d-block text">
        <div class="text-center">
          <h3>Verificação de EPIs na ordem</h3>
          <span>
            Informe quais EPIs você esta utilizando
          </span>
        </div>
        <div class="m-3">
          <b-form-checkbox-group
            id="checkbox-group-1"
            v-model="selectedEpis"
            :options="getEpiOptions()"
            name="flavour-1"
            stacked
          />
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
        <smart-button @click.native="closeModal()">
          <span>Fechar</span>
        </smart-button>
        <smart-button @click.native="alterEpiCheck()">
          <span>Enviar</span>
        </smart-button>
      </div>
    </b-modal>

    <!-- modalConvida tecnico -->
    <b-modal
      ref="convidaTecnico"
      size="lg"
      title="Convidar Tecnico"
      hide-header
      hide-footer
      centered
      class="d-block text-center"
    >
      <div>
        <h3 class="text-center">Convidar Tecnico</h3>
        <b-tabs content-class="mt-3">
          <b-tab title="First" active>
            <template v-slot:title>
              <i class="fa fa-list fa-fw mr-1 fa-sm" aria-hidden="true" style="color:#555" />
              <span>Listagem dos técnicos</span>
            </template>

            <b-container fluid>
              <!-- User Interface controls -->
              <b-row class="filter-mecanic">
                <b-col lg="6" class="my-1">
                  <b-form-group
                    label="Usuario"
                    label-cols-sm="3"
                    label-align-sm="right"
                    label-size="sm"
                    label-for="filterInput"
                    class="mb-0"
                  >
                    <b-input-group size="sm" class="filter-mecanic-add-in-order">
                      <b-form-input
                        id="filterInput"
                        v-model="filterUser"
                        type="search"
                        placeholder="Pesquisar mecânico"
                      ></b-form-input>
                      <b-input-group-append>
                        <b-button :disabled="!filter" @click="filter = ''">Limpar</b-button>
                      </b-input-group-append>
                    </b-input-group>
                  </b-form-group>
                </b-col>
              </b-row>

              <!-- Main table element -->
              <b-table
                id="my-table"
                show-empty
                small
                fixed
                stacked="md"
                responsive
                :items="manutentores"
                :fields="fields"
                :current-page="currentPage"
                :per-page="perPage"
                :filter="filter"
                :filterIncludedFields="filterOn"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :sort-direction="sortDirection"
                @filtered="onFiltered"
              >
                <p v-show="visibleMessage" class="Span_lerta">
                  O manutentor já está presente na ordem, verifique a listagem dos manutentores
                </p>
                <template v-slot:cell(name)="row">
                  {{ row.item.nome }}
                </template>

                <template v-if="showAddButton" v-slot:cell(actions)="row">
                  <smart-button @click.native="addManutentor(row.item, row.index, $event.target)">
                    Adicionar
                  </smart-button>
                </template>
                <template v-slot:row-details="row">
                  <b-card>
                    <ul>
                      <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
                    </ul>
                  </b-card>
                </template>
              </b-table>
              <div class="overflow-auto">
                <div>
                  <b-pagination
                    v-model="currentPage"
                    :total-rows="rows"
                    :per-page="perPage"
                    align="center"
                    pills
                    class="my-0 "
                    aria-controls="my-table"
                  ></b-pagination>
                </div>
              </div>
              <!-- Info modal -->
            </b-container>
          </b-tab>
          <b-tab title="Second">
            <template v-slot:title>
              <i class="fa fa-users fa-fw mr-1" aria-hidden="true" style="color:#555" />
              <span>Técnicos convidados</span>
            </template>
            <template v-slot:title>
              <i class="fa fa-list fa-fw mr-1 fa-sm" aria-hidden="true" style="color:#555" />
              <span>Listagem dos técnicos</span>
            </template>

            <b-container fluid>
              <!-- User Interface controls -->
              <b-row class="filter-mecanic">
                <b-col lg="6" class="my-1">
                  <b-form-group
                    label="Usuario"
                    label-cols-sm="3"
                    label-align-sm="right"
                    label-size="sm"
                    label-for="filterInput"
                    class="mb-0"
                  >
                    <b-input-group size="sm" class="filter-mecanic-add-in-order">
                      <b-form-input
                        id="filterInput"
                        v-model="filterUser"
                        type="search"
                        placeholder="Pesquisar mecânico"
                      ></b-form-input>
                      <b-input-group-append>
                        <b-button :disabled="!filter" @click="filter = ''">Limpar</b-button>
                      </b-input-group-append>
                    </b-input-group>
                  </b-form-group>
                </b-col>
              </b-row>

              <!-- Main table element -->
              <b-table
                id="my-table"
                show-empty
                small
                fixed
                stacked="md"
                responsive
                :items="listManutentorInOrdem"
                :fields="fields"
                :current-page="currentPage"
                :per-page="perPage"
                :filter="filter"
                :filterIncludedFields="filterOn"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :sort-direction="sortDirection"
                @filtered="onFiltered"
              >
                <template v-slot:cell(name)="row">
                  {{ row.item.nome }}
                  <!-- {{ row }} -->
                </template>

                <template v-if="showAddButton" v-slot:cell(actions)="row">
                  <smart-button @click.native="removeManutentor(row.item, row.index, $event.target)">
                    Remover
                  </smart-button>
                <!-- <b-button size="sm" @click="row.toggleDetails">
                  {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
      </b-button> -->
                </template>
                <template v-slot:row-details="row">
                  <b-card>
                    <ul>
                      <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
                    </ul>
                  </b-card>
                </template>
              </b-table>
              <div class="overflow-auto">
                <div>
                  <b-pagination
                    v-model="currentPage"
                    :total-rows="rowsManutentorInOrder"
                    :per-page="perPage"
                    align="center"
                    pills
                    class="my-0 "
                    aria-controls="my-table"
                  ></b-pagination>
                </div>
              </div>
              <!-- Info modal -->
            </b-container>
          </b-tab>
        </b-tabs>
      </div>
      <div class="container-button-modal">
        <smart-button primary @click.native="closeAddModal()">Ok</smart-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import DetailCardWrapper from './components/DetailCardWrapper.vue';
import { getErrors, getPriorityClass } from '../../../utils/utils';

export default {
  name: 'Detalhamento',

  components: {
    orderVerification: () => import('./components/Verification.vue'),
    orderNote: () => import('./components/Notes.vue'),
    DetailCardWrapper,
  },

  props: {
    order: { type: Object, default: () => ({}) },
  },

  data() {
    return {
      // por classe em name apra deixar um padding igual a do action:
      fields: [
        { key: 'name', label: 'Nome' },
        
        // { key: 'age', label: 'Person age', sortable: true, class: 'text-center' },
        { key: 'actions', label: 'Ações', class: 'modal-th-td-style' },
      ],
      totalRows: 5,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 5, 5],
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      filterUser: null,
      filterOn: [],
      infoModal: {
        id: 'info-modal',
        title: '',
        content: '',
      },
      state: {
        view: 'detail',
      },
      visibleMessage: false,
      valuesInput: {
        idOrdemServico: this.order.idOrdemServico,
        idUsuario: '',
        user: this.$store.state.user,
        // excluded: '',
      },
      showAddButton: true,
      opcao: '',
      manutentores: [],
      manutentorInOrdem: [],
      report_requester: [],
      listManutentorInOrdem: [],
      epiList: [],
      dialogVisible: false,
      modalHasError: false,
      search: '',
      isLoading: {},
      selectedEpis: [],
      getPriorityClass,
    };
  },

  computed: {
    rows() {
      return this.manutentores.length;
    },
    rowsManutentorInOrder() {
      return this.listManutentorInOrdem.length;
    },
    getOrderManutentor() {
      const order = this.manutentorInOrdem.find(i => i.is_master);
      
      return order ? order.nome : '';
    },
    isOrderAssumed() {
      return this.manutentorInOrdem.some(i => i.is_master);
    },
  },
  
  mounted() {
    this.setActivity();
    this.getManutentoresInOrdem();
    this.getReportRequester();
    this.getEpis();
  },

  methods: {

    verifyUserActions() {
      const user = this.$store.state.user;

      if (user.nivelAcesso === 3) {
        this.showAddButton = false;
        return;
      }
      this.showAddButton = true;
    },
    info(item, index, button) {
      this.infoModal.title = `Row index: ${index}`;
      this.infoModal.content = JSON.stringify(item, null, 2);
      this.$root.$emit('bv::show::modal', this.infoModal.id, button);
    },
    closeAddModal() {
      this.$refs['convidaTecnico'].hide();
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1 ;
    },
    resetModal() {
      this.modalHasError = false;
      this.modalErrorMessage = '';
      this.selectedEpis = [];
    },
    setActivity() {
      this.$http.setActivity(this.$activities.ORDER_DETAIL, JSON.stringify({ order: this.order.idOrdemServico }))
    },
    openOrderVerification() {
      this.$set(this.state, 'view', 'Verification');
    },
    openOrderNote() {
      this.$set(this.state, 'view', 'Note');
    },
    changeViewToDetail() {
      this.$set(this.state, 'view', 'detail');
    },
    changeOrderVerificationStatus(status) {
      this.$set(this.order, 'status', status);
      this.changeViewToDetail();
    },
    async openIntiveTechnician() {
      try {
        if (this.isLoading.convidar) return;

        this.$set(this.isLoading, 'convidar', true);
        await this.getManutentor();

        this.$refs['convidaTecnico'].show();
      } catch (err) {
        console.log('err openIntiveTechnician :>> ', err.response || err);

        return this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      } finally {
        this.$set(this.isLoading, 'convidar', false);
      }
    },
    // busca todos os manutentores do sistema
    async getManutentor() {
      try {
        const response = await this.$http.post('detalhamento/get-geral-user', this.valuesInput);

        if (response.result.length === undefined)
          this.manutentores.push(response.result);
        else this.manutentores = [...response.result];
      } catch (err) {
        throw err;
      }
    },
    // Busca os manutentores na ordem
    async getManutentoresInOrdem() {
      try {
        const response = await this.$http.post('detalhamento', this.valuesInput);
        if (response.result.length === undefined) {
          this.manutentorInOrdem.push(response.result);
          this.listManutentorInOrdem = this.manutentorInOrdem.filter( i => {
            return i.is_master === 0 ;
          });
        }
        else {
          this.manutentorInOrdem = [...response.result];
          this.listManutentorInOrdem = this.manutentorInOrdem.filter( i => {
            return i.is_master === 0 ;
          });
        }
      } catch (err) {
        throw err;
      }
    },
    // Busca o reporte e o solicitante da ordem
    async getReportRequester() {
      try {
        const response = await this.$http.post('detalhamento/get-report-requester', this.valuesInput);
        if (response.result.length === undefined)
          this.report_requester.push(response.result);
        else this.report_requester = [...response.result];
      } catch (err) {
        throw err;
      }
    },
    validateAddManutentor(User) {
      return this.manutentorInOrdem.find(element => element.idUsuario === User.idUsuario);
    },
    async addManutentor(index, row) {
      try {
        const validManutentorAdd = this.validateAddManutentor(row);

        if (validManutentorAdd === undefined) {
          this.dialogVisible = false;
          this.visibleMessage = false;
          this.valuesInput.excluded = 0;
          this.valuesInput.idUsuario = index.idUsuario;

          const response = await this.$http.post('detalhamento/register', this.valuesInput);

          this.$swal({
            type: 'success',
            title: response.result,
            confirmButtonColor: '#F34336',
          }),

          this.getManutentoresInOrdem();

          this.$http.setActivity(this.$activities.INVITE_USER_TO_ORDER, JSON.stringify({ invitedUser: row.nome }));
        } else {
          this.visibleMessage = true;
        }
      } catch (err) {
        return this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    async removeManutentor(row) {
      try {
        this.valuesInput.idUsuario = row.idUsuario;
        this.valuesInput.excluded = 1;
        this.dialogVisible = false;

        const response = await this.$http.update('detalhamento', this.valuesInput, this.valuesInput.idOrdemServico);

        this.$swal({
          type: 'success',
          title: `${response.result}`,
          confirmButtonColor: '#F34336',
        }),

        this.manutentorInOrdem = [],
        this.getManutentoresInOrdem(),

        this.$http.setActivity(this.$activities.REMOVE_INVITED_USER, JSON.stringify({ removedInvitedUser: row.idUsuario }));
      } catch (err) {
        return this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#f34336',
        });
      }
    },
    orderMovimentations(type) {
      if (this.$store.state.user.nivelAcesso !== 2) return;
      
      switch (type) {
      case 'assume':
        this.assumeOrder();
        break;
      case 'init':
        this.initiateOrder();
        break;
      case 'pause':
        this.pauseOrder();
        break;
      }
    },
    async assumeOrder() {
      if (this.isLoading.assume || this.isOrderAssumed) return;
      try {
        this.$set(this.isLoading, 'assume', true);

        const { result } = await this.$http.post('initiate/assume', {
          ...this.$store.state.user,
          order: this.order.idOrdemServico,
        });

        this.$swal({
          type: 'success',
          title: result,
        });

        await this.getManutentoresInOrdem();
        this.$set(this.order, 'status', 'Assumida');
      } catch (err) {
        this.$set(this.isLoading, 'assume', false);

        return this.$swal({
          type: 'success',
          title: 'Ordem iniciada com sucesso!',
          confirmButtonColor: '#f34336',
        });
      }
    },
    async initiateOrder() {
      try {
        console.log('INITIATE ORDER');
        if (this.isLoading.init) return;
        this.$set(this.isLoading, 'init', true);

        const manutentor = await this.validateActualManutentor();


        this.showEpiModal();
      } catch (err) {
        console.log('initiateOrder :>> ', err);
        this.$set(this.isLoading, 'init', false);

        this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    async pauseOrder() {
      try {
        this.$set(this.isLoading, 'pause', true);

        const response = await this.$http.post('initiate/pause', { ...this.$store.state.user, isMaster: true, order: this.order.idOrdemServico });

        this.$set(this.isLoading, 'pause', false);

        this.$set(this.order, 'status', 'Pausada');
      } catch (err) {
        this.$set(this.isLoading, 'init', false);
        this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    async listEpiCheck() {
      const epiSelects = [];
      for (const epiSelect of this.selectedEpis) {
        console.log('epiSelect: ', epiSelect);
        const epiOrder = this.epiList.find(i => i.Epi_idEpi === epiSelect);
        console.log('epiOrder: ', epiOrder);
        epiSelects.push(epiOrder);
      }
      return epiSelects;
    },
    async alterEpiCheck() {
      try {
        const listEpiCheck = await this.listEpiCheck();

        if (listEpiCheck.length === this.epiList.length) {
          await this.$http.post('epi/register', listEpiCheck);
        
          await this.$http.post('initiate/init',
            { ...this.$store.state.user, isMaster: true, order: this.order.idOrdemServico });
          
          this.$set(this.order, 'status', 'Em Andamento');

          this.$swal({
            type: 'success',
            title: 'EPIs checadas e Ordem iniciada com sucesso!',
            confirmButtonColor: '#f34336',
          }).then(() => {
            this.$set(this.isLoading, 'init', false);
            console.log('Status Andamento: ', this.order);
            this.closeModal();
          });
        } else {
          this.$swal({
            type: 'warning',
            title: 'Faltam EPIs, ordem não pode ser iniciada!',
            confirmButtonColor: '#F34336',
          });
          this.withoutEPIs();
        }
      } catch (err) {
        this.$set(this.isLoading, 'init', false);

        this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    async validateActualManutentor() {
      try {
        await this.getManutentoresInOrdem();

        const user = this.$store.state.user;
        return this.manutentorInOrdem.find(i => i.numeroCracha === user.cracha);
      } catch (err) {
        throw err;
      }
    },
    getEpiOptions() {
      return this.epiList.map(i => ({ text: i.descricaoEpi, value: i.idEpi }));
    },
    checkSelectedEpis() {
      // if (this.inputValues.epis.length > 0)
      //   this.selectedEpis = [...this.inputValues.epis];
    },
    async showEpiModal() {
      await this.getEpis();

      this.$refs['my-modal'].show();
    },
    closeModal() {
      this.$refs['my-modal'].hide();
    },
    withoutEPIs() {
      this.$set(this.isLoading, 'init', false);
      this.$set(this.order, 'status', 'Assumida');
      this.closeModal();
    },
    confirmModal() {
      this.$refs['my-modal'].toggle('#toggle-btn');
      this.resetModal();
    },
    async getEpis() {
      try {
        const { result } = await this.$http.post('epi/order', { order: this.order.idOrdemServico });
        
        if (result.length !== undefined)
          this.epiList = [...result];
        else this.epiList = [result];
      } catch (err) {
        console.log('err :>> ', err.response || err);

        return this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    excludeOrder() {
      this.$swal({
        title: 'Excluir ordem de manutenção',
        text: `Tem certeza que deseja excluir a ordem ${this.order.idOrdemServico}`,
        showCancelButton: true,
        reverseButtons: true,
        cancelButtonText: 'Não, sair.',
        confirmButtonText: 'Sim, excluir!',
      }).then( async res => {
        console.log(this.order);
        if (res.value) {
          const manutentor = await this.validateActualManutentor();
          
          const response = await this.$http.update('ordem-manutencao', { ...this.$store.state.user }, this.order.idOrdemServico);

          this.$swal({
            type: 'success',
            title: 'Ordem excluída',
            confirmButtonColor: '#F34336',
          });
          this.$emit('state-list');
        }
      }).catch(err => {
        return this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.root-detalhamento-view {
  margin: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  .detail-content {
    width: 60vw;
  }
  .Button_close {
    color:#030303;
  }
  @media screen and (max-width: 1366px) {
    .detail-content {
      width: 90vw;
    }
  }
}

.container-button-modal {
  padding: 1rem;
  display: flex;
  justify-content: center;
}

.Span_lerta {
  color: #ff0303;
  font-family: 'Montserrat';
}
</style>

<style lang="scss">
.page-item.active, .page-link {
  border-color: #ddd !important;
}
.pagination > li.active > a,
.pagination > li > a:hover {
  color: white !important;
  background-color: var(--duas-rodas-soft) !important;
}
.page-link {
  color: #555 !important;
  &:focus {
    background-color: var(--duas-rodas-soft) !important;
    box-shadow: none !important;
  }
}
.filter-mecanic-add-in-order {
  display: flex !important;
  justify-content:center !important;
}
v-link {
  color: #555 !important
}
// @media (min-width: 576px)
.filter-mecanic {
  margin-right: 15px !important;
  margin-left: -43px !important;
}
.table th, .table td {
  vertical-align: middle !important;

}
.table-sm td {
  min-height: 55px !important;
}
.modal-th-td-style {
  // color: purple;
  display: flex;
  justify-content: flex-end;

  // align-items: center !important;
  
}
// .table-sm th {
//   text-align: center;
// }
// .table thead th  {
//   text-align: center;
// }
.table th {
   // margin-right: 0.5rem;
   padding-right: 2rem !important;
}

</style>
