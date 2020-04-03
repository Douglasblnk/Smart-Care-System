<template>
  <div class="root-detalhamento-view">
    <div class="detail-content">
      <div class="my-3">
        <simple-button
          :no-margin="true"
          label="Voltar"
          prefix="fa-arrow-left"
          @click.native="() => $emit('state-list')"
        />
      </div>
      <div class="detail-container bg-white p-3 d-flex">
        <div class="col-md-6">
          <div class="order-title">
            <span>Resumo: {{ order.resumo }}</span>
          </div>
          <div class="my-3">
            <span>Descrição: {{ order.descricao }}</span>
          </div>
          <div class="my-3">
            <div class="my-3 d-flex align-items-center">
              <i class="fa fa-map-marker-alt mr-2" />
              <span>Setor: {{ order.setor }}</span>
            </div>
            <div class="my-3 d-flex align-items-center">
              <i class="fa fa-ban mr-2" />
              <span>Requer parada: {{ order.requerParada === 1 ? 'Sim' : 'Não' }}</span>
            </div>
            <div class="my-3 d-flex align-items-center">
              <i class="fa fa-exclamation-triangle mr-2" :class="getPriorityClass()" />
              <span>Prioridade: {{ order.prioridade }}</span>
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

        <div class="col-md-6">
          <div class="col-md-12 text-center">
            <span style="font-size: 20px">Ações</span>
          </div>
          <div class="d-flex justify-content-center">
            <div class="options-wrapper">
              <div class="options">
                <i class="fa fa-play fa-lg mb-2" />
                <span>Iniciar</span>
              </div>
              <div class="options">
                <i class="fa fa-hand-point-right fa-lg mb-2" />
                <span>Iniciar</span>
              </div>
              <div class="options">
                <i class="fa fa-users fa-lg mb-2" />
                <span>Iniciar</span>
              </div>
              <div class="options">
                <i class="fa fa-file-signature fa-lg mb-2" />
                <span>Iniciar</span>
              </div>
              <div class="options">
                <i class="fa fa-check-double fa-lg mb-2" />
                <span>Iniciar</span>
              </div>
              <div class="options">
                <i class="fa fa-clipboard-check fa-lg mb-2" />
                <span>Iniciar</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Detalhamento',
  
  props: {
    order: { type: Object, default: () => ({}) },
  },

  data() {
    return {

    };
  },

  methods: {
    getPriorityClass() {
      console.log(this.order.Prioridade_idPrioridade === 3);
      if (this.order.Prioridade_idPrioridade === 1) return 'low-priority';
      if (this.order.Prioridade_idPrioridade === 2) return 'medium-priority';
      if (this.order.Prioridade_idPrioridade === 3) return 'high-priority';
      if (this.order.Prioridade_idPrioridade === 4) return 'very-high-priority';
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
      .low-priority {
        color: #53c46d !important;
      }
      .medium-priority {
        color: #FFCC00 !important;
      }
      .high-priority {
        color: var(--duas-rodas-soft) !important;
      }
      .very-high-priority {
        color: var(--duas-rodas) !important;
      }
      .options-wrapper {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        max-width: 250px;
        .options {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 10px 10px;
          width: 90px;
          height: 80px;
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
        }
      }
    }
  }
  @media screen and (max-width: 1366px) {
    .detail-content {
      width: 90vw;
    }
  }
}
</style>