<template>
  <div class="ordem-manutencao-wrapper-root">
    <div class="cardMenu">
      <div class="containerMenu">
        <label class="span_question">Escolha o tipo de ordem que deseja cadastrar:</label>
        <div class="maintanceMenu">
          <div
            @click="selectOrderType('corretiva')"
            class="maintance-menu-items"
          >
            <span>Corretiva</span>
          </div>
          <div
            @click="selectOrderType('preventiva')"
            class="maintance-menu-items"
          >
            <span>Preventiva</span>
          </div>
          <div
            @click="selectOrderType('rota')"
            class="maintance-menu-items"
          >
            <span>Rota</span>
          </div>
          <div
            @click="selectOrderType('lista')"
            class="maintance-menu-items"
          >
            <span>Lista</span>
          </div>
        </div>
      </div>
    </div>
    <transition name="slide-fade" mode="out-in">
      <template v-if="state.view === 'Lista'">
        <ordem-lista />
      </template>

      <template v-if="state.view === 'Rota'">
        <ordem-rota />
      </template>

      <template v-if="state.view === 'Corretiva'">
        <ordem-corretiva />
      </template>
      <template v-if="state.view === 'Preventiva'">
        <ordem-preventiva />
      </template>
    </transition>
  </div>
</template>

<script>
export default {
	name: 'OrdemManutencaoWrapper',

	components: {
		'ordem-lista': () => import('./OrdemManutencaoLista.vue'),
		'ordem-rota': () => import('./OrdemManutencaoRota.vue'),
    'ordem-corretiva': () => import('./OrdemManutencaoCorretiva.vue'),
    'ordem-preventiva': () => import('./OrdemManutencaoPreventiva'),
	},

	data() {
		return {
      state: {
        view: '',
      },
		};
  },

  mounted() {
    this.$store.commit('addPageName', 'Cadastro de Ordem');
  },

	methods: {
    selectOrderType(type) {
      if (type === 'corretiva') this.$set(this.state, 'view', 'Corretiva');
      if (type === 'preventiva') this.$set(this.state, 'view', 'Preventiva');
      if (type === 'rota') this.$set(this.state, 'view', 'Rota');
      if (type === 'lista') this.$set(this.state, 'view', 'Lista');
      this.$store.commit('addPageName', `Cadastro de Ordem | ${this.state.view}`);
    },
	},
};
</script>

<style lang="scss" scoped>
.ordem-manutencao-wrapper-root {
  width: 100vw;
  height: 100%;
  .cardMenu {
    width:100%;
    background-color: #ffffff;
    border-radius: 10px;
    .containerMenu{
      display: grid;
      width: 100%;
      .maintanceMenu {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .maintance-menu-items {
          padding: 15px 20px;
          margin: 0 5px;
          background-color: #eee;
          border-radius: 8px;
          cursor: pointer;
          user-select: none;
          transition: .2s;
          &:hover {
            background-color: #ddd;
            transform: scale(1.1);
          }
          &:active {
            transform: scale(1);
          }
        }
      }
      .span_question {
        width: 100%;
        font-size: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #ff0303;
      }
    }
  }
}
@media (max-width: 1250px) {
  .ordem-manutencao-wrapper-root  {
    width: 100vw;
    height: 100vh;
    padding: 20px;
  }

}
</style>
