<template>
  <div class="root-detalhamento-view">
    <transition name="slide-side" mode="out-in">
      <div v-if="state.view === 'detail'" class="detail-content">
        <div class="d-flex">
          <div>
            <smart-button
              simple
              class="mb-2 back-button"
              @click.native="() => $emit('state-list')"
            >
              <i class="fa fa-arrow-left mr-2" />
              <span>Voltar</span>
            </smart-button>
          </div>
        </div>
        <div class="detail-container bg-white p-3 d-flex">
          <div class="col-md-7">
            <div class="order-title">
              <span>Resumo: {{ order.resumo }}</span>
            </div>
            <div class="my-3">
              <span>Descrição: {{ order.descricao }}</span>
            </div>
            <div class="my-3">
              <div class="my-3 d-flex align-items-center">
                <i class="fa mr-2" :class="getStatusIcon(order)" />
                <span>Status: {{ order.status }}</span>
              </div>
              <div
                v-if="isOrderAssumed"
                class="my-3 d-flex align-items-center"
              >
                <i class="fa fa-user mr-2" />
                <span>Manutentor: {{ getOrderManutentor }}</span>
              </div>
              <div class="my-3 d-flex align-items-center">
                <i class="fa fa-map-marker-alt mr-2" />
                <span>Setor: {{ order.local }}</span>
              </div>
              <div class="my-3 d-flex align-items-center">
                <i class="fa fa-ban mr-2" />
                <span>Requer parada: {{ order.requerParada === 1 ? 'Sim' : 'Não' }}</span>
              </div>
              <div class="my-3 d-flex align-items-center">
                <i class="fa fa-exclamation-triangle mr-2" :class="getPriorityClass(order.prioridade)" />
                <span :class="getPriorityClass(order.prioridade)">Prioridade: {{ order.prioridade }}</span>
              </div>
              <div class="my-3 d-flex align-items-center">
                <i class="fa fa-laptop mr-2" />
                <span>Equipamento: {{ order.equipamento }}</span>
              </div>
              <div class="my-3 d-flex align-items-center">
                <i class="fa fa-tools mr-2" />
                <span>Tipo de Manutenção: {{ order.tipo_manutencao }}</span>
              </div>
              <div class="my-3 d-flex align-items-center">
                <i class="fa fa-calendar-alt mr-2" />
                <div class="d-flex flex-column">
                  <span>
                    Inicio planejado:
                    {{ this.$moment(order.inicioPlanejado).format('DD-MM-YYYY') }}
                  </span>
                  <span>
                    Fim planejado:
                    {{ this.$moment(order.fimPlanejado).format('DD-MM-YYYY') }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-5 d-flex justify-content-between flex-column">
            <div>
              <div class="col-md-12 text-center">
                <span style="font-size: 20px">Ações</span>
              </div>
              <div class="d-flex justify-content-center">
                <div class="options-wrapper">
                  <!-- // ? CARD PARA QUANDO A ORDEM ESTIVER COM STATUS ABERTA -->
                  <div
                    v-if="verifyOrderStatus === 'open'"
                    class="options"
                    @click="orderMovimentations('assume')"
                  >
                    <i class="fa fa-hard-hat fa-lg mb-2" />

                    <i v-if="isLoading.assume" class="fa fa-spinner fa-spin fa-lg m-2" />
                    <span v-else>Assumir</span>
                  </div>

                  <!-- // ? CARD PARA QUANDO A ORDEM FOR ASSUMIDA POR ALGUÉM -->
                  <div
                    v-if="verifyOrderStatus === 'assumed' || verifyOrderStatus === 'paused'"
                    class="options"
                    :class="verifyUserAccess ? '' : 'disable'"
                    @click="orderMovimentations('init')"
                  >
                    <i class="fa fa-play fa-lg mb-2" />

                    <i v-if="isLoading.init" class="fa fa-spinner fa-spin fa-lg m-2" />
                    <span v-else>Iniciar</span>
                  </div>

                  <!-- // ? CARD PARA QUANDO FOR INICIAR POR ALGUÉM -->
                  <div
                    v-if="verifyOrderStatus === 'running'"
                    class="options"
                    :class="verifyUserAccess ? '' : 'disable'"
                    @click="orderMovimentations('pause')"
                  >
                    <i class="fa fa-play fa-lg mb-2" />

                    <i v-if="isLoading.pause" class="fa fa-spinner fa-spin fa-lg m-2" />
                    <span v-else>Pausar</span>
                  </div>

                  <div
                    class="options"
                    :class="verifyUserAccess ? '' : 'disable'"
                  >
                    <i class="fa fa-hand-point-right fa-lg mb-2" />
                    <span>Delegar</span>
                  </div>

                  <div
                    class="options"
                    :class="verifyUserAccess ? '' : 'disable'"
                    @click="openIntiveTechnician()"
                  >
                    <i class="fa fa-users fa-lg mb-2" />
                    <i v-if="isLoading.convidar" class="fa fa-spinner fa-spin fa-lg m-3" />
                    <span v-else>Convidar técnico</span>
                  </div>

                  <div
                    class="options"
                    :class="verifyUserAccess ? '' : 'disable'"
                    @click="openOrderNote()"
                  >
                    <i class="fa fa-file-signature fa-lg mb-2" />
                    <span>Apontamentos</span>
                  </div>

                  <div
                    class="options"
                    :class="verifyUserAccess ? '' : 'disable'"
                  >
                    <i class="fa fa-check-double fa-lg mb-2" />
                    <span>Checklist</span>
                  </div>
                  <div
                    class="options"
                    :class="verifyUserAccess ? '' : 'disable'"
                    @click="openOrderVerification()"
                  >
                    <i class="fa fa-clipboard-check fa-lg mb-2" />
                    <span>Verificação</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="order-options-wrapper">
              <!-- <div class="exclude-order">
                <i class="fa fa-edit fa-fw" />
                <span>Editar ordem</span>
              </div> -->

              <div class="exclude-order" @click="excludeOrder()">
                <i class="fa fa-trash fa-fw" />
                <span>Excluir ordem</span>
              </div>
            </div>
          </div>
        </div>
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
    <b-modal ref="my-modal" centered hide-footer hide-header title="Verificação de EPIs" @hide="resetModal()" @show="checkSelectedEpis()">
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
    <div class="invite-technical-modal">
      <!-- <smart-button @click.native="showAddModal()">convida tecnico</smart-button> -->

      <b-modal ref="convidaTecnico" size="lg" title="Convidar Tecnico" hide-header hide-footer centered class="d-block text-center">
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
  </div>
</template>

<script>
import orderVerification from './Verificacao.vue';
import OrderNote from './Apontamentos.vue';
import { getErrors, getToken, getPriorityClass } from '../../utils/utils';

export default {
  name: 'Detalhamento',

  components: {
    'order-verification': orderVerification,
    'order-note': OrderNote,
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
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key };
        });
    },
    verifyUserAccess() {
      const user = this.$store.state.user;
      if (user.nivelAcesso === 2) {
        const orderManutentor = this.manutentorInOrdem.find(i => i.is_master);
        const currentUser = this.$store.state.user;
        if (orderManutentor !== undefined && orderManutentor.numeroCracha === currentUser.cracha &&
            this.order.status !== 'Pendente' && this.order.status !== 'Encerrada')
          return true;
      } else if (this.order.status !== 'Encerrada' && (user.nivelAcesso === 1 || user.nivelAcesso === 3)) {
        const reportRequester = this.report_requester.find(i => i.nivel_acesso === user.nivelAcesso &&
                                                          i.idUsuario === user.userId);
        if (reportRequester !== undefined)
          return true;
      }
      
      return false;
    },
    verifyUserAccessLevel() {
      const user = this.$store.state.user;

      const userAccess = this.verifyUserAccess;

      if (userAccess === true && (user.nivelAcesso === 2 || user.nivelAcesso === 1))
        return true;
      
      return false;
    },
    verifyUserAccessLevelOpenOrder() {
      const user = this.$store.state.user;

      if (this.order.status === 'Aberto' && (user.nivelAcesso === 2 || user.nivelAcesso === 1))
        return true;
      
      return false;
    },
    verifyOrderStatus() {
      return this.translateStatus(this.order.status);
    },
    getOrderManutentor() {
      const user = this.manutentorInOrdem.find(i => i.is_master);
      
      return user.nome;
    },
    isOrderAssumed() {
      return this.manutentorInOrdem.some(i => i.is_master);
    },
  },
  
  mounted() {
    this.totalRows = this.items.length;
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
    translateStatus(status) {
      if (status === 'Aberto') return 'open';
      if (status === 'Assumida') return 'assumed';
      if (status === 'Em Andamento') return 'running';
      if (status === 'Encerrada') return 'closed';
      if (status === 'Pendente') return 'pending';
      if (status === 'Pausada') return 'paused';
    },
    getStatusIcon(order) {
      if (order.status === 'Aberto') return 'fa-clock';
      if (order.status === 'Assumida') return 'fa-user-check';
      if (order.status === 'Em Andamento') return 'fa-tasks';
      if (order.status === 'Encerrada') return 'fa-check-circle';
      if (order.status === 'Pendente') return 'fa-user-shield';
      if (order.status === 'Pausada') return 'fa-pause-circle';
    },
    openOrderVerification() {
      if (!this.verifyUserAccess) return;

      this.$set(this.state, 'view', 'Verification');
    },
    openOrderNote() {
      if (!this.verifyUserAccessLevel) return;

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
      if (!this.verifyUserAccessLevel) return;

      try {
        if (this.isLoading.convidar) return;

        this.$set(this.isLoading, 'convidar', true);
        await this.getManutentor();

        this.$refs['convidaTecnico'].show();
      } catch (err) {
        console.log('err openIntiveTechnician :>> ', err.response || err);

        return this.$swal({
          type: 'warning',
          title: getErrors(err),
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
          
          console.log(this.listManutentorInOrdem);
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
          title: getErrors(err),
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
          title: getErrors(err),
          confirmButtonColor: '#f34336',
        });
      }
    },
    orderMovimentations(type) {
      if (this.$store.state.user.nivelAcesso !== 2) return;
      console.log('TYPE: ', type);
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
          title: getErrors(err),
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
          title: getErrors(err),
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
          title: getErrors(err),
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
          title: getErrors(err),
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
          title: getErrors(err),
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
    .detail-container {
      border-radius: 10px;
      .order-title {
        span {
          font-size: 20px;
          color: var(--duas-rodas)
        }
      }
      i {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        color: var(--duas-rodas-soft)
      }
      .options-wrapper {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        max-width: 290px;
        .options {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 10px 10px;
          width: 120px;
          height: 100px;
          padding: 20px;
          background-color: #eee;
          border-radius: 7px;
          transition: .1s;
          user-select: none;
          &:hover {
            background-color: #e2e2e2;
            transform: scale(1.1);
          }
          &:active {
            transform: scale(1);
          }
          span {
            text-align: center;
          }
        }
        .disable {
          opacity: 0.7;
          cursor: not-allowed;
          &:hover {
            background-color: #eee !important;
            transform: scale(1) !important;
          }
        }
      }
    }
  }

  .order-options-wrapper {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0 20px;
    .exclude-order {
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      user-select: none;
      &:hover {
        span {
          color: var(--duas-rodas-soft)
        }
      }
      i {
        transition: .2s;
      }
      &:hover {
        i {
          transform: scale(1.18);
        }
      }
      &:active {
        i {
          transform: scale(1);
        }
      }
    }
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
