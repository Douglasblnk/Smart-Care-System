<template>
  <div class="root-detalhamento-view">
    <div class="w-100 bg-white p-4 detalhamento-view">
      <h3 style="margin-bottom: 30px; color: #F34336">{{order.resumo}}</h3>
      <div style="display: flex; flex-direction: column">
        <span><strong>Inicio planejado: </strong>{{order.inicioPlanejado}}</span>
        <span><strong>Fim planejado: </strong>{{order.fimPlanejado}}</span>
        <p><strong>Descrição: </strong>{{order.descricao}}</p>
        <p><strong>Requer para: </strong>{{getRequerParada(order.requerParada)}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    resumo: { type: String, default: '' }
  },

  data: () => ({
    order: {}
  }),

  mounted() {
    this.order = JSON.parse(localStorage.getItem('ordem'));
  },

  methods: {
    getRequerParada(parada) {
      if (parada === 1) return 'Sim'
      return 'Não'
    }
  }
}
</script>

<style lang="scss" scoped>
.root-detalhamento-view {
  width: 90%;
  .detalhamento-view {
    border-radius: 20px;
  }
}
</style>