<template>
  <div class="root-detalhamento-view">
    <transition name="slide-side" mode="out-in">
      <div v-if="isLoading.order" key="loadingOrder">
        <div class="loading-state">
          <i class="fa fa-spinner fa-spin fa-lg mx-3" />
          <h3 class="user-select-none">
            Buscando informações da ordem...
          </h3>
        </div>
      </div>
      
      <div
        v-if="!isLoading.order && state.view === 'detail'"
        key="orderDetail"
        class="detail-content"
      >
        <DetailCardWrapper
          :order="order"
          :is-order-assumed="isOrderAssumed"
          :order-master-maintainer="getOrderMasterMaintainer.nome"
          :order-invited-maintainers="getOrderInvitedMaintainers"
          :is-loading="isLoading"
          @update:orderMovimentations="orderMovimentations"
          @update:excludeOrder="excludeOrder"
          @update:delegateOrder="openChooseMaintainerModal"
          @update:openIntiveTechnician="openIntiveTechnician"
          @update:openOrderNote="openOrderNote"
          @update:openOrderVerification="openOrderVerification"
          @update:toggleShowEpiModal="toggleShowEpiModal"
        />

        <EquipmentsOperationsCard
          :order-id="order.idOrdemServico"
          :is-order-assumed="isOrderAssumed"
          :master-maintainer="getOrderMasterMaintainer"
          :equipments-operations="orderEquipmentsOperations"
          :order-type="order.tipo_manutencao"
        />
      </div>

      <div v-if="state.view === 'Verification' && !isLoading.order" key="Verification">
        <OrderVerification
          :order="order"
          @state-list="changeViewToDetail"
          @change-status="changeOrderVerificationStatus"
        />
      </div>

      <div v-if="state.view === 'Note' && !isLoading.order" key="Note">
        <OrderNote
          :order="order"
          @state-list="changeViewToDetail"
        />
      </div>
    </transition>

    <!-- Modal de Verificação de EPI -->
    <!-- // todo validar abrir modal no iniciar ordem -->
    <EpiVerificationModal
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
    <InviteMaintainer
      v-if="showInviteMaintainer"
      :available-maintainers="availableMaintainers"
      :maintainers-in-order="maintainersInOrder"
      @update:resetModal="resetModal"
      @update:addMaintainer="addMaintainer"
    />

    <ChooseMaintainerToDelegateModal
      v-if="showChooseMaintainers"
      :available-maintainers="availableMaintainers"
      :maintainers-in-order="maintainersInOrder"
      @update:resetModal="resetModal"
      @update:closeModal="closeModal"
      @update:chooseMaintainer="chooseMaintainersToDelegate"
    />
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
    EquipmentsOperationsCard: () => import('./components/EquipmentsOperationsCardWrapper.vue'),
    ChooseMaintainerToDelegateModal: () => import('./components/modal/ChooseMaintainerToDelegateModal.vue'),
    DetailCardWrapper,
  },

  props: {
    order: { type: Object, default: () => ({}) },
  },

  data() {
    return {
      state: {
        view: 'detail',
      },
      isOperationsChecked: false,
      orderEquipmentsOperations: {},
      valuesInput: {
        idOrdemServico: this.order.idOrdemServico,
        idUsuario: '',
        user: this.$store.state.user,
        // excluded: '',
      },
      showEpiModal: false,
      showInviteMaintainer: false,
      showChooseMaintainers: false,
      availableMaintainers: [],
      maintainersInOrder: [],
      epiList: [],
      modalHasError: false,
      modalErrorMessage: '',
      isLoading: {
        order: true,
      },
      selectedEpis: [],
      getPriorityClass,
    };
  },

  computed: {
    getOrderMasterMaintainer() {
      const maintainer = this.maintainersInOrder.find(maintainer => maintainer.is_master);

      return maintainer ? maintainer : {};
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
    this.getOrdersDependencies();
  },

  methods: {
    async getOrdersDependencies() {
      try {
        await this.getMaintainersInOrder();
        await this.getEquipmentsAndOperations();
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
      const response = await this.$http.get('users', {
        headers: {
          type: 'maintainerInOrder',
          order_id: this.order.idOrdemServico,
        },
      });

      if (response.length === undefined)
        this.maintainersInOrder.push(response);
      else this.maintainersInOrder = [...response];
    },
    async getEquipmentsAndOperations() {
      const response = await this.$http.get('ordem-manutencao/equipments-operations', {
        headers: {
          order: this.order.idOrdemServico,
          order_type: this.order.tipo_manutencao,
        },
      });

      this.orderEquipmentsOperations = { ...response };
    },
    toggleOperationsChecked() {
      this.isOperationsChecked = true;
    },
    toggleOperationsUnchecked() {
      this.isOperationsChecked = false;
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
        await this.getAvailableMaintainers();

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
    async getAvailableMaintainers() {
      try {
        const response = await this.$http.get('users', {
          headers: {
            type: 'maintainer',
            order_id: this.valuesInput.idOrdemServico,
          },
        });

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

          this.getMaintainersInOrder();

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
        this.getMaintainersInOrder(),

        this.$http.setActivity(this.$activities.REMOVE_INVITED_USER, JSON.stringify({ removedInvitedUser: row.idUsuario }));
      } catch (err) {
        return this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#f34336',
        });
      }
    },
    async openChooseMaintainerModal() {
      try {
        if (this.isLoading.chooseMaintainer) return;

        this.$set(this.isLoading, 'chooseMaintainer', true);
        
        await this.getAvailableMaintainers();

        this.showChooseMaintainers = true;
      } catch (err) {
        console.log('err openChooseMaintainerModal :>> ', err);

        return this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#f34336',
        });
      } finally {
        this.$set(this.isLoading, 'chooseMaintainer', false);
      }
    },
    async chooseMaintainersToDelegate({ nome, numeroCracha }) {
      try {
        await this.$http.post('delegar-manutentor', { nome, numeroCracha, orderId: this.order.idOrdemServico }),

        this.closeModal();

        await this.$swal({
          type: 'success',
          title: 'Ordem delegada com sucesso',
          html: `<p class="smart">O manutentor <strong>${nome}</strong> agora está assumindo esta a ordem</p>`,
        });

        this.$emit('state-list');
      } catch (err) {
        console.log('err chooseMaintainersToDelegate :>> ', err);

        this.closeModal();

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
      
        await this.$http.post('movimentacao-etapa/assumir', {
          order: this.order.idOrdemServico,
        });

        this.$swal({
          type: 'success',
          text: 'Ordem assumida com sucesso!',
        });

        this.$set(this.order, 'status', 'Assumida');
        await this.getMaintainersInOrder();
      } catch (err) {
        this.$set(this.isLoading, 'assume', false);

        return this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#f34336',
        });
      } finally {
        this.$set(this.isLoading, 'assume', false);
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
        await this.getMaintainersInOrder();

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
        this.showChooseMaintainers = false;
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
        if (this.isLoading.epi) return;
        if (this.epiList.length > 0) return;

        this.$set(this.isLoading, 'epi', true);

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
        this.$set(this.isLoading, 'epi', false);
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
  display: flex;
  justify-content: flex-end;
}
.table th {
   padding-right: 2rem !important;
}

</style>
