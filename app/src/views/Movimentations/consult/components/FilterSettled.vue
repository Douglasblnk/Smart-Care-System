<template>
  <section class="root-web-filter-settled" :class="isMobile ? '' : 'px-3'">
    <transition name="fade" mode="out-in">
      <div
        v-if="isMobile && !isFilterSettled"
        key="search"
        class="text-center d-flex align-items-center justify-content-center m-3"
      >
        <i class="fa fa-search fa-fw text-muted" />
        <span class="text-muted bg-dark-gray p-2 rounded-lg">Pesquise por ordens de manutenção</span>
      </div>

      <div
        v-if="isFilterSettled"
        key="filterSettled"
        :class="isMobile ? '' : 'd-flex justify-content-between mb-2'"
      >
        <div v-if="!isMobile" key="web" class="d-flex align-items-center">
          <span class="mx-2">Filtros selecionados: </span>

          <span v-if="filters.status" class="mx-1">
            <strong>Status: </strong> {{ filters.status }}
          </span>

          <span v-if="filters.data" class="mx-1">
            <strong>Data: </strong> {{ $moment(filters.data).format('DD-MM-YYYY') }}
          </span>

          <span v-if="filters.priority" class="mx-1">
            <strong>Prioridade: </strong> {{ filters.priority }}
          </span>

          <span v-if="filters.orderType" class="mx-1">
            <strong>Tipo de manutenção: </strong> {{ filters.orderType }}
          </span>

          <span v-if="filters.myOrders" class="mx-1">
            <strong>Manutentor: </strong> {{ filters.myOrders }}
          </span>
        </div>

        <div v-else key="mobile" class="d-flex flex-column">
          <span class="text-muted">Filtros selecionados: </span>

          <div class="d-flex flex-wrap">
            <span v-if="filters.status" class="selected-filters">
              <i class="fa fa-check-circle fa-fw" />{{ filters.status }}
            </span>

            <span v-if="filters.data" class="selected-filters">
              <i class="fa fa-calendar fa-fw" /> {{ $moment(filters.data).format('DD-MM-YYYY') }}
            </span>

            <span v-if="filters.priority" class="selected-filters">
              <i class="fa fa-exclamation-circle fa-fw" /> {{ filters.priority }}
            </span>

            <span v-if="filters.orderType" class="selected-filters">
              <i class="fa fa-tools fa-fw" /> {{ filters.orderType }}
            </span>

            <span v-if="filters.myOrders" class="selected-filters">
              <i class="fa fa-user-circle fa-fw" /> {{ filters.myOrders }}
            </span>
          </div>
        </div>

        <div class="my-2">
          <smart-button :small="isMobile" :mobile="isMobile" @click.native="clearFilters()">
            <span>Limpar Filtros</span>
          </smart-button>
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'WebFilterSettled',
  props: {
    isFilterSettled: { type: Boolean, default: false },
    filters: { type: Object, default: () => ({}) },
  },
  computed: {
    ...mapGetters({
      isMobile: 'getIsMobile',
    }),
  },
  methods: {
    clearFilters() {
      this.$emit('update:clearFilters');
    },
  },
};
</script>

<style lang="scss" scoped>
.root-web-filter-settled {
  .selected-filters {
    padding: 5px 10px;
    margin: 5px;
    background-color: #ddd;
    border-radius: 100px;
  }
}
</style>
