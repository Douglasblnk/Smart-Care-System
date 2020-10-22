<template>
  <section class="root-web-detail-card">
    <card
      full-width
      advanced-card
      custom-title="Informações da ordem"
      icon="fa-info-circle"
    >
      <div class="detail-container d-flex">
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
                  {{ $moment(order.inicioPlanejado).format('DD-MM-YYYY') }}
                </span>
                <span>
                  Fim planejado:
                  {{ $moment(order.fimPlanejado).format('DD-MM-YYYY') }}
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

                <div class="options">
                  <i class="fa fa-hand-point-right fa-lg mb-2" />
                  <span>Delegar</span>
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
                  <span>Apontamentos</span>
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
                  <span>Verificação</span>
                </div>
              </div>
            </div>
          </div>

          <div class="order-options-wrapper">
            <div class="exclude-order" @click="excludeOrder()">
              <i class="fa fa-trash fa-fw" />
              <span>Excluir ordem</span>
            </div>
          </div>
        </div>
      </div>
    </card>
  </section>
</template>

<script>
import { getPriorityClass } from '../../../../../utils/utils';
import {
  getStatusIcon,
  verifyOrderStatus,
} from '../../utils/utils';

export default {
  name: 'WebDetailCard',
  props: {
    order: { type: Object, default: () => ({}) },
    isLoading: { type: Object, default: () => ({}) },
    isOrderAssumed: { type: Boolean, default: false },
    orderMasterMaintainer: { type: String, default: '' },
    orderInvitedMaintainers: { type: [String, Array], default: '' },
  },
  data() {
    return {

    };
  },
  computed: {
    verifyOrderStatus() {
      return verifyOrderStatus(this.order);
    },
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
  },
};
</script>

<style lang="scss" scoped>
.root-web-detail-card {
  .detail-container {
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
  }
}
</style>
