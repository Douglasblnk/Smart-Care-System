<template>
  <div class="root-detalhamento-view">
    <transition name="slide-side" mode="out-in">
      <div v-if="isLoading.order">
        <div class="loading-state">
          <i class="fa fa-spinner fa-spin fa-lg mx-3" />
          <h3>
            Buscando detalhamento da ordem...
          </h3>
        </div>
      </div>
      
      <div v-if="state.view === 'detail' && !isLoading.order" class="detail-content">
        <detail-card-wrapper
          :order="order"
          :is-order-assumed="isOrderAssumed"
          :order-master-maintainer="getOrderMasterMaintainer"
          :order-invited-maintainers="getOrderInvitedMaintainers"
          :is-loading="isLoading"
          @update:orderMovimentations="orderMovimentations"
          @update:excludeOrder="excludeOrder"
          @update:openIntiveTechnician="openIntiveTechnician"
          @update:openOrderNote="openOrderNote"
          @update:openOrderVerification="openOrderVerification"
          @update:toggleShowEpiModal="toggleShowEpiModal"
        />
      </div>

      <div v-if="state.view === 'Verification' && !isLoading.order" key="Verification">
        <order-verification
          :order="order"
          @state-list="changeViewToDetail"
          @change-status="changeOrderVerificationStatus"
        />
      </div>

      <div v-if="state.view === 'Note' && !isLoading.order" key="Note">
        <order-note
          :order="order"
          @state-list="changeViewToDetail"
        />
      </div>
    </transition>

    <!-- Modal de Verificação de EPI -->
    <!-- // todo validar abrir modal no iniciar ordem -->
    <epi-verification-modal
      v-if="showEpiModal"
      v-model="selectedEpis"
      :epi-list="epiList"
      :modal-has-error="modalHasError"
      :modal-error-message="modalErrorMessage"
      @update:resetModal="resetModal"
      @update:checkSelectedEpis="checkSelectedEpis"
      @update:closeModal="closeModal"
      @update:confirmEpi="confirmEpi"
    />

    <!-- modalConvida tecnico -->
    <invite-maintainer
      v-if="showInviteMaintainer"
      :available-maintainers="availableMaintainers"
      :maintainers-in-order="maintainersInOrder"
      @update:resetModal="resetModal"
      @update:addMaintainer="addMaintainer"
    />
    <!-- <invite-maintainer
      v-if="showInviteMaintainer"
      :filter-user="filterUser"
      :filter="filter"
      :maintainers="maintainers"
      :invite-maintainers-table-fields="inviteMaintainersTableFields"
      :current-page="currentPage"
      :per-page="perPage"
      :filter-on="filterOn"
      :sort-by="sortBy"
      :sort-desc="sortDesc"
      :sort-direction="sortDirection"
      :visible-message="visibleMessage"
      :show-add-button="showAddButton"
      :rows="rows"
      :list-manutentor-in-ordem="listmaintainersInOrder"
      :rows-manutentor-in-order="rowsManutentorInOrder"
      @update:onFiltered="onFiltered"
      @update:addMaintainer="addMaintainer"
      @update:removeMaintainer="removeMaintainer"
      @update:resetModal="resetModal"
    /> -->
  </div>
</template>

<script>
import DetailCardWrapper from './components/DetailCardWrapper.vue';
import { getErrors, getPriorityClass } from '../../../utils/utils';

export default {
  name: 'Detalhamento',

  components: {
    OrderVerification: () => import('./components/Verification.vue'),
    EpiVerificationModal: () => import('./components/modal/EpiVerificationModal.vue'),
    OrderNote: () => import('./components/Notes.vue'),
    InviteMaintainer: () => import('./components/modal/InviteMaintainerModal.vue'),
    DetailCardWrapper,
  },

  props: {
    order: { type: Object, default: () => ({}) },
  },

  data() {
    return {
      inviteMaintainersTableFields: [
        { key: 'name', label: 'Nome' },
        { key: 'actions', label: 'Ações', class: 'modal-th-td-style' },
      ],
      teste: false,
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
      showEpiModal: false,
      showInviteMaintainer: false,
      opcao: '',
      availableMaintainers: [],
      maintainersInOrder: [],
      report_requester: [],
      epiList: [],
      dialogVisible: false,
      modalHasError: false,
      modalErrorMessage: '',
      search: '',
      isLoading: {},
      selectedEpis: [],
      getPriorityClass,
    };
  },

  computed: {
    rows() {
      return this.availableMaintainers.length;
    },
    getOrderMasterMaintainer() {
      const maintainer = this.maintainersInOrder.find(maintainer => maintainer.is_master);

      return maintainer ? maintainer.nome : '';
    },
    getOrderInvitedMaintainers() {
      const maintainers = this.maintainersInOrder.filter(maintainer => !maintainer.is_master);

      return maintainers.length ? maintainers.map(maintainer => maintainer.nome) : '';
    },
    isOrderAssumed() {
      return this.maintainersInOrder.some(i => i.is_master);
    },
  },

  mounted() {
    this.$set(this.isLoading, 'order', true);
    this.getOrdersDependencies();
  },

  methods: {
    async getOrdersDependencies() {
      try {
        await this.getMaintainersInOrder();
      } catch (err) {
        console.log('getOrdersDependencies :>>', err.response || err);

        return this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      } finally {
        this.$set(this.isLoading, 'order', false);
      }
    },
    async getMaintainersInOrder() {
      const response = await this.$http.get('ordem-usuarios', {
        headers: { order_id: this.order.idOrdemServico },
      });

      if (response.length === undefined)
        this.maintainersInOrder.push(response);
      else this.maintainersInOrder = [...response];
    },
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
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1 ;
    },
    resetModal() {
      this.modalHasError = false;
      this.modalErrorMessage = '';
      this.selectedEpis = [];
      this.closeModal();
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
        if (this.isLoading.inviteMaintainer) return;

        this.$set(this.isLoading, 'inviteMaintainer', true);
        await this.getAvailableInvitedMaintainers();

        this.showInviteMaintainer = true;
      } catch (err) {
        console.log('err openIntiveTechnician :>> ', err.response || err);

        return this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      } finally {
        this.$set(this.isLoading, 'inviteMaintainer', false);
      }
    },
    async getAvailableInvitedMaintainers() {
      try {
        const response = await this.$http.get('users', {
          headers: {
            type: 'maintainer',
            ordeR_id: this.valuesInput.idOrdemServico,
          },
        });

        console.log('response :>> ', response);

        if (response.length === undefined)
          this.availableMaintainers.push(response);
        else this.availableMaintainers = [...response];
      } catch (err) {
        throw err;
      }
    },
    validateAddManutentor(User) {
      return this.maintainersInOrder.find(element => element.idUsuario === User.idUsuario);
    },
    async addMaintainer({ row, index }) {
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

          this.getOrderMaintainer();

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
    async removeMaintainer({ row, index }) {
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

        this.maintainersInOrder = [],
        this.getOrderMaintainer(),

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

        await this.getOrderMaintainer();
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
        if (this.isLoading.init) return;
        this.$set(this.isLoading, 'init', true);

        const manutentor = await this.validateActualManutentor();


        this.toggleShowEpiModal();
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
        const epiOrder = this.epiList.find(i => i.Epi_idEpi === epiSelect);

        epiSelects.push(epiOrder);
      }
      return epiSelects;
    },
    async confirmEpi() {
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
        this.closeModal();
        
        this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    async validateActualManutentor() {
      try {
        await this.getOrderMaintainer();

        const user = this.$store.state.user;
        return this.maintainersInOrder.find(i => i.numeroCracha === user.cracha);
      } catch (err) {
        throw err;
      }
    },
    checkSelectedEpis() {
      // todo
      // if (this.inputValues.epis.length > 0)
      //   this.selectedEpis = [...this.inputValues.epis];
    },
    async toggleShowEpiModal() {
      await this.getEpis();

      this.showEpiModal = true;
    },
    closeModal() {
      setTimeout(() => {
        this.showEpiModal = false;
        this.showInviteMaintainer = false;
      }, 120);
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
        if (this.isLoading.checklist) return;
        if (this.epiList.length > 0) return;

        this.$set(this.isLoading, 'checklist', true);

        const response = await this.$http.get('epi', {
          headers: { order_id: this.order.idOrdemServico },
        });
        
        if (response.length === undefined)
          this.epiList.push(response);
        else this.epiList = [...response];
      } catch (err) {
        console.log('err getEpis :>> ', err.response || err);

        return this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      } finally {
        this.$set(this.isLoading, 'checklist', false);
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
      }).then(async res => {
        console.log(this.order);
        if (res.value) {
          const manutentor = await this.validateActualManutentor();
          
          await this.$http.update('ordem-manutencao', { ...this.$store.state.user }, this.order.idOrdemServico);

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
  .loading-state {
    display: flex;
    align-items: center;
    height: 60vh;
    h3, i {
      color: rgb(163, 163, 163);
    }
    h3 {
      font-weight: 100;
    }
  }
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
