<template>
  <section class="root-web-consult-filter">
    <div class="p-3">
      <div class="p-2 filters">
        <p>Filtros: </p>

        <span
          :class="(filters.status || option === 'status') ? 'selected' : ''"
          @click="setFiltersType('status')"
        >
          <i class="fa fa-check-circle fa-fw" />
          Status
        </span>

        <span
          :class="(filters.data || option === 'data') ? 'selected' : ''"
          @click="setFiltersType('data')"
        >
          <i class="fa fa-calendar fa-fw" />
          Data
        </span>

        <span
          :class="(filters.priority || option === 'priority') ? 'selected' : ''"
          @click="setFiltersType('priority')"
        >
          <i class="fa fa-exclamation-circle fa-fw" />
          Prioridade
        </span>

        <span
          :class="(filters.orderType || option === 'orderType') ? 'selected' : ''"
          @click="setFiltersType('orderType')"
        >
          <i class="fa fa-tools fa-fw" />
          Tipo de Manutenção
        </span>

        <span
          :class="(filters.myOrders) ? 'selected' : ''"
          @click="setFilter('myOrders', store.state.user.cracha)"
        >
          <i class="fa fa-user-circle fa-fw" />
          Minhas OS
        </span>
      </div>

      <transition name="slide-down" mode="out-in">
        <div v-if="showOptions" key="status" class="options-container p-3">
          <transition name="slide-side" mode="out-in">
            <div v-if="option === 'status'" key="status" class="d-flex flex-row">
              <div v-for="(status, index) in optionsData.status" :key="`status-${index}`">
                <div class="filters">
                  <span
                    :class="filters.status === status.tipoStatus ? 'selected' : ''"
                    style="border: 1px solid #dddddd"
                    @click="setFilter('status', status.tipoStatus)"
                  >
                    {{ status.tipoStatus }}
                  </span>
                </div>
              </div>
            </div>

            <div v-if="option === 'data'" key="data" class="col-md-3">
              <simple-input v-model="filters.data" white type="date" />
            </div>

            <div v-if="option === 'priority'" key="priority" class="d-flex flex-row">
              <div v-for="(priority, index) in optionsData.priority" :key="`status-${index}`">
                <div class="filters">
                  <span
                    :class="filters.priority === priority.descricaoPrioridade ? 'selected' : ''"
                    style="border: 1px solid #dddddd"
                    @click="setFilter('priority', priority.descricaoPrioridade)"
                  >
                    {{ priority.descricaoPrioridade }}
                  </span>
                </div>
              </div>
            </div>

            <div v-if="option === 'orderType'" key="orderType" class="d-flex flex-row">
              <div v-for="(type, index) in optionsData.orderType" :key="`status-${index}`">
                <div class="filters">
                  <span
                    :class="filters.orderType === type.tipoManutencao ? 'selected' : ''"
                    style="border: 1px solid #dddddd"
                    @click="setFilter('orderType', type.tipoManutencao)"
                  >
                    {{ type.tipoManutencao }}
                  </span>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </transition>
    </div>
  </section>
</template>

<script>
export default {
  name: 'WebConsultFilter',
  props: {
    filters: { type: Object, default: () => ({}) },
    option: { type: String, default: '' },
    showOptions: { type: Boolean, default: false },
    optionsData: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      store: this.$store,
    };
  },
  methods: {
    setFiltersType(type) {
      this.$emit('update:setFiltersType', type);
    },
    setFilter(type, filter) {
      this.$emit('update:setFilter', type, filter);
    },
  },
};
</script>

<style lang="scss" scoped>
.root-web-consult-filter {
  .options-container {
    display: flex;
    border-top: 1px solid #dddddd;
    border-bottom: 1px solid #dddddd;
  }
  .filters {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    span {
      margin: 5px 5px;
      padding: 10px 20px;
      background-color: rgb(255, 255, 255);
      border-radius: 50px;
      cursor: pointer;
      &:hover {
        background-color: var(--duas-rodas-soft);
        color: white;
      }
    }
    p {
      margin: 0;
    }
  }
  .priority-pointer {
    border-radius: 100%;
    padding: 5px;
  }
  .selected {
    background-color: var(--duas-rodas-soft) !important;
    color: white;
  }
  span {
    color: var(--gray)
  }
}
</style>
