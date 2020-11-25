<template>
  <div class="ordem-manutencao-wrapper-root">
    <back-button @goBack="goBack" />
    
    <div>
      <div class="select-order-text">
        <span>Escolha o tipo de ordem que deseja cadastrar:</span>
      </div>
      <div class="maintance-menu">
        <div
          class="maintance-menu-items"
          :class="state.view === 'Corretiva' ? 'selected' : ''"
          @click="selectOrderType('corretiva')"
        >
          <span>Corretiva</span>
        </div>
        <div
          class="maintance-menu-items"
          :class="state.view === 'Preventiva' ? 'selected' : ''"
          @click="selectOrderType('preventiva')"
        >
          <span>Preventiva</span>
        </div>
        <div
          class="maintance-menu-items"
          :class="state.view === 'Rota' ? 'selected' : ''"
          @click="selectOrderType('rota')"
        >
          <span>Rota</span>
        </div>
        <div
          class="maintance-menu-items"
          :class="state.view === 'Lista' ? 'selected' : ''"
          @click="selectOrderType('lista')"
        >
          <span>Lista</span>
        </div>
      </div>
    </div>

    <transition name="slide-side" mode="out-in">
      <template v-if="state.view === 'Corretiva'">
        <CorrectivePreventiveOrder
          key="corretiva"
          order-type="corretiva"
          @reset:closeOrderMaintenance="resetOrder"
        />
      </template>

      <template v-if="state.view === 'Preventiva'">
        <CorrectivePreventiveOrder
          key="preventiva"
          order-type="preventiva"
          @reset:closeOrderMaintenance="resetOrder"
        />
      </template>

      <template v-if="state.view === 'Rota'">
        <RouteOrder
          key="rota"
          @reset:closeOrderMaintenance="resetOrder"
        />
      </template>

      <template v-if="state.view === 'Lista'">
        <ListOrder
          key="lista"
          @reset:closeOrderMaintenance="resetOrder"
        />
      </template>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'OrdemManutencaoWrapper',

  components: {
    ListOrder: () => import('./OrdemManutencaoLista.vue'),
    RouteOrder: () => import('./OrdemManutencaoRota.vue'),
    CorrectivePreventiveOrder: () => import('./OrdemManutencaoCorretiva.vue'),
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
    resetOrder() {
      this.$set(this.state, 'view', '');
    },
    goBack() {
      this.$router.push('/cadastros');
    },
  },
};
</script>

<style lang="scss" scoped>
.ordem-manutencao-wrapper-root {
  width: 100%;
  .select-order-text {
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      font-family: 'roboto';
      font-size: 22px;
      color: var(--duas-rodas-soft)
    }
  }
  .maintance-menu {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px 0;
    .maintance-menu-items {
      padding: 15px 20px;
      margin: 0 5px;
      background-color: #ddd;
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
    .selected {
      background-color: var(--duas-rodas-soft) !important;
      span {
        color: white !important;
      }
    }
  }
}
</style>
