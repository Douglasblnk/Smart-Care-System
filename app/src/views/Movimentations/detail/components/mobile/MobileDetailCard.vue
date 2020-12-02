<template>
  <section class="root-mobile-detail-card">
    <div class="d-flex justify-content-center align-items-center" style="margin: 20px 0;">
      <i class="fa fa-info-circle mr-2 fa-lg" style="color: var(--duas-rodas-soft)" />
      <p class="smart" style="font-size: 20px;">
        Informações da ordem
      </p>
    </div>
    
    <card full-width>
      <div style="position: relative">
        <div class="order-title">
          <span>Resumo: {{ order.resumo }}</span>
        </div>

        <div
          v-if="order.descricao && (order.tipo_manutencao === 'Corretiva' || order.tipo_manutencao === 'Preventiva')"
          class="my-3"
        >
          <span>Descrição: {{ order.descricao }}</span>
        </div>

        <div class="detailed-information m-2">
          <div class="my-3 d-flex align-items-center">
            <i class="fa mr-2" :class="getStatusIcon(order)" />
            <span>Status: {{ order.status }}</span>
          </div>
          <div
            v-if="isOrderAssumed"
            class="my-3 d-flex align-items-center"
          >
            <i class="fa fa-user mr-2" />
            <span>Manutentor: {{ orderMasterMaintainer }}</span>
          </div>
          <div
            v-if="orderInvitedMaintainers.length"
            class="my-3 d-flex align-items-center"
          >
            <i class="fa fa-users mr-2" />
            <span>Manutentores convidados: {{ orderInvitedMaintainers.join(', ') }}</span>
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
            <i class="fa fa-tools mr-2" />
            <span>Tipo de Manutenção: {{ order.tipo_manutencao }}</span>
          </div>
          <div class="my-3 d-flex align-items-center">
            <i class="fa fa-calendar-alt mr-2" />
            <div class="d-flex flex-column">
              <span>
                Inicio planejado:
                {{ $moment(order.inicioPlanejado).format('DD-MM-YYYY') }}
              </span>
              <span>
                Fim planejado:
                {{ $moment(order.fimPlanejado).format('DD-MM-YYYY') }}
              </span>
            </div>
          </div>
        </div>

        <div class="options-wrapper" @click="() => (showDetailOptions = true)">
          <i class="fa fa-plus fa-lg" />
        </div>
      </div>
    </card>

    <MobileDetailOptionsModal
      v-if="showDetailOptions"
      :is-loading="isLoading"
      :order="order"
      @update:orderMovimentations="type => $emit('update:orderMovimentations', type)"
      @update:excludeOrder="$emit('update:excludeOrder')"
      @update:delegateOrder="$emit('update:delegateOrder')"
      @update:openIntiveTechnician="$emit('update:openIntiveTechnician')"
      @update:openOrderNote="$emit('update:openOrderNote')"
      @update:openOrderVerification="$emit('update:openOrderVerification')"
      @update:toggleShowEpiModal="$emit('update:toggleShowEpiModal')"
      @update:closeModal="closeModal"
    />
  </section>
</template>

<script>
import { getPriorityClass } from '../../../../../utils/utils';
import { getStatusIcon } from '../../utils/utils';

export default {
  name: 'MobileDetailCard',
  components: {
    MobileDetailOptionsModal: () => import('../modal/MobileDetailOptionsModal.vue'),
  },
  props: {
    order: { type: Object, default: () => ({}) },
    isLoading: { type: Object, default: () => ({}) },
    isOrderAssumed: { type: Boolean, default: false },
    orderMasterMaintainer: { type: String, default: '' },
    orderInvitedMaintainers: { type: [String, Array], default: '' },
  },
  data() {
    return {
      showDetailOptions: false,
    };
  },
  methods: {
    getStatusIcon(icon) {
      return getStatusIcon(icon);
    },
    getPriorityClass(priority) {
      return getPriorityClass(priority);
    },
    orderMovimentations(type) {
      this.$emit('update:orderMovimentations', type);
    },
    excludeOrder() {
      this.$emit('update:excludeOrder');
    },
    delegateOrder() {
      this.$emit('update:delegateOrder');
    },
    openIntiveTechnician() {
      this.$emit('update:openIntiveTechnician');
    },
    openOrderNote() {
      this.$emit('update:openOrderNote');
    },
    openOrderVerification() {
      this.$emit('update:openOrderVerification');
    },
    toggleShowEpiModal() {
      this.$emit('update:toggleShowEpiModal');
    },
    closeModal() {
      setTimeout(() => {
        this.showDetailOptions = false;
      }, 120);
    },
  },
};
</script>

<style lang="scss" scoped>
.root-mobile-detail-card {
  margin: 0 10px;
  .order-title {
    span {
      font-size: 20px;
      color: var(--duas-rodas)
    }
  }
  .detailed-information {
    i {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      color: var(--duas-rodas-soft)
    }
  }
  .options-wrapper {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    right: -34px;
    bottom: -37px;
    width: 54px;
    height: 54px;
    border-radius: 100px;
    background-color: var(--duas-rodas-soft);
    cursor: pointer;
    transition: .1s transform;
    &:active {
      transform: scale(0.9);
    }
    i {
      color: white;
    }
  }
}
</style>
