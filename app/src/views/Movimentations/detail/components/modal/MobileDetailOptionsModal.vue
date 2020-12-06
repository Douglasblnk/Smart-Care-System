<template>
  <b-modal
    ref="DetailOptions"
    centered
    hide-footer
    hide-header
    @hide="closeModal()"
  >
    <div class="root-mobile-detail-options-modal">
      <div class="text-center">
        <h3 class="smart" style="margin-bottom: 20px !important">Ações</h3>
      </div>

      <div class="detail-options">
        <div
          v-if="verifyOrderStatus === 'open'"
          class="options"
          @click="orderMovimentations('assume')"
        >
          <i class="fa fa-hard-hat fa-lg mb-2" />

          <i v-if="isLoading.assume" class="fa fa-spinner fa-spin fa-lg m-2" />
          <span v-else>Assumir</span>
        </div>

        <div
          v-if="verifyOrderStatus === 'assumed' || verifyOrderStatus === 'paused'"
          class="options"
          @click="orderMovimentations('init')"
        >
          <i class="fa fa-play fa-lg mb-2" />

          <i v-if="isLoading.init" class="fa fa-spinner fa-spin fa-lg m-2" />
          <span v-else>Iniciar</span>
        </div>

        <div
          v-if="verifyOrderStatus === 'running'"
          class="options"
          @click="orderMovimentations('pause')"
        >
          <i class="fa fa-play fa-lg mb-2" />

          <i v-if="isLoading.pause" class="fa fa-spinner fa-spin fa-lg m-2" />
          <span v-else>Pausar</span>
        </div>

        <div class="options" @click="delegateOrder()">
          <i class="fa fa-hand-point-right fa-lg mb-2" />
          <i v-if="isLoading.chooseMaintainer" class="fa fa-spinner fa-spin fa-lg m-3" />
          <span v-else>Delegar</span>
        </div>

        <div
          class="options"
          @click="openIntiveTechnician()"
        >
          <i class="fa fa-users fa-lg mb-2" />
          <i v-if="isLoading.inviteMaintainer" class="fa fa-spinner fa-spin fa-lg m-3" />
          <span v-else>Convidar técnico</span>
        </div>

        <div
          class="options"
          @click="openOrderNote()"
        >
          <i class="fa fa-file-signature fa-lg mb-2" />
          <span>Apontar</span>
        </div>

        <div
          class="options"
          @click="toggleShowEpiModal()"
        >
          <i class="fa fa-user-shield fa-lg mb-2" />
          <i v-if="isLoading.epi" class="fa fa-spinner fa-spin fa-lg m-1" />
          <span v-else>EPIs</span>
        </div>

        <div
          class="options"
          @click="openOrderVerification()"
        >
          <i class="fa fa-clipboard-check fa-lg mb-2" />
          <span>Verificar</span>
        </div>
      </div>

      <div class="d-flex justify-content-center smart-modal-footer">
        <smart-button
          primary
          class="mx-1"
          @click.native="closeModal()"
        >
          <span>Fechar</span>
        </smart-button>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { verifyOrderStatus } from '../../utils/utils';

export default {
  name: 'MobileDetailOptionsModal',
  props: {
    order: { type: Object, default: () => ({}) },
    isLoading: { type: Object, default: () => ({}) },
  },
  computed: {
    verifyOrderStatus() {
      return verifyOrderStatus(this.order);
    },
  },
  mounted() {
    this.$refs['DetailOptions'].show();
  },
  beforeDestroy() {
    this.$refs['DetailOptions'].hide();
  },
  methods: {
    closeModal() {
      this.$refs['DetailOptions'].hide();
      this.$emit('update:closeModal');
    },
    orderMovimentations(type) {
      this.closeModal();
      this.$emit('update:orderMovimentations', type);
    },
    excludeOrder() {
      this.closeModal();
      this.$emit('update:excludeOrder');
    },
    delegateOrder() {
      this.closeModal();
      this.$emit('update:delegateOrder');
    },
    openIntiveTechnician() {
      this.closeModal();
      this.$emit('update:openIntiveTechnician');
    },
    openOrderNote() {
      this.closeModal();
      this.$emit('update:openOrderNote');
    },
    openOrderVerification() {
      this.closeModal();
      this.$emit('update:openOrderVerification');
    },
    toggleShowEpiModal() {
      this.closeModal();
      this.$emit('update:toggleShowEpiModal');
    },
  },
};
</script>

<style lang="scss">
.root-mobile-detail-options-modal {

  .detail-options {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    .options {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 10px;
      width: 110px;
      height: 90px;
      padding: 10px;
      background-color: #eee;
      border-radius: 20px;
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
      i {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        color: var(--duas-rodas-soft)
      }
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
</style>
