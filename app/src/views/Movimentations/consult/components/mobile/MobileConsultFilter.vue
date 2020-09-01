<template>
  <section class="root-mobile-consult-filter">
    <transition name="slide-fade" mode="out-in">
      <div v-if="showConsultFilter" class="filters-container">
        <div class="filters">
          {{ option }}
          <span
            :class="{
              'selected': (filters.status || option === 'status'),
              'faded-filters': (option && option !== 'status'),
            }"
            @click="setFiltersType('status')"
          >
            <i class="fa fa-check-circle fa-fw mr-2" />
            Status
          </span>

          <transition name="slide-down" mode="out-in">
            <div
              v-if="option === 'status'"
              key="status"
              class="expanded-filter"
            >
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
          </transition>

          <span
            :class="{
              'selected': (filters.data || option === 'data'),
              'faded-filters': (option && option !== 'data'),
            }"
            @click="setFiltersType('data')"
          >
            <i class="fa fa-calendar fa-fw mr-2" />
            Data
          </span>

          <transition name="slide-down" mode="out-in">
            <div v-if="option === 'data'" key="data">
              <simple-input v-model="filters.data" type="date" />
            </div>
          </transition>

          <span
            :class="{
              'selected': (filters.priority || option === 'priority'),
              'faded-filters': (option && option !== 'priority'),
            }"
            @click="setFiltersType('priority')"
          >
            <i class="fa fa-exclamation-circle fa-fw mr-2" />
            Prioridade
          </span>

          <transition name="slide-down" mode="out-in">
            <div v-if="option === 'priority'" key="priority" class="expanded-filter">
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
          </transition>

          <span
            :class="{
              'selected': (filters.orderType || option === 'orderType'),
              'faded-filters': (option && option !== 'orderType'),
            }"
            @click="setFiltersType('orderType')"
          >
            <i class="fa fa-tools fa-fw mr-2" />
            Tipo de Manutenção
          </span>

          <transition name="slide-down" mode="out-in">
            <div v-if="option === 'orderType'" key="orderType" class="expanded-filter">
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

          <span
            :class="{
              'selected': filters.myOrders,
              'faded-filters': option,
            }"
            @click="setFilter('myOrders', store.state.user.cracha)"
          >
            <i class="fa fa-user-circle fa-fw mr-2" />
            Minhas OS
          </span>

          <smart-button mobile class="m-1" @click.native="closeFilters()">
            <p>Fechar</p>
          </smart-button>
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'MobileConsultFilter',
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
  computed: {
    ...mapGetters({
      showConsultFilter: 'getShowConsultFilter',
    }),
  },
  methods: {
    setFiltersType(type) {
      this.$emit('update:setFiltersType', type);
    },
    setFilter(type, filter) {
      this.$emit('update:setFilter', type, filter);
    },
    closeFilters() {
      this.$store.commit('setShowConsultFilter', false);
      this.$emit('update:closeFilterOptions');
    },
  },
};
</script>

<style lang="scss" scoped>
.root-mobile-consult-filter {
  .options-container {
    display: flex;
    border-top: 1px solid #dddddd;
    border-bottom: 1px solid #dddddd;
  }
  .filters-container {
    width: 100%;
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 100;
    .filters {
      display: flex;
      flex-direction: column;
      span {
        margin: 5px 5px;
        padding: 10px 10px;
        background-color: #eee;
        border-radius: 8px;
        cursor: pointer;
        &:active {
          background-color: var(--duas-rodas-soft);
          color: white;
        }
      }
      p {
        margin: 0;
      }
      .expanded-filter {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
      }
      .faded-filters {
        opacity: 0.5;
      }
    }
  }
  .selected {
    background-color: var(--duas-rodas-soft) !important;
    color: white;
  }
  span {
    transition: .2s;
    color: var(--gray)
  }
}
</style>
