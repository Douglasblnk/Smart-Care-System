<template>
  <section class="root-consult-filters">
    <component
      :is="getComponent"
      v-bind="$props"
      @update:setFiltersType="type => $emit('update:setFiltersType', type)"
      @update:setFilter="(type, filter) => $emit('update:setFilter', type, filter)"
      @update:closeFilterOptions="$emit('update:closeFilterOptions')"
    />
  </section>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ConsultFilters',
  components: {
    WebConsultFilter: () => import('./web/WebConsultFilter.vue'),
    MobileConsultFilter: () => import('./mobile/MobileConsultFilter.vue'),
  },
  props: {
    filters: { type: Object, default: () => ({}) },
    option: { type: String, default: '' },
    showOptions: { type: Boolean, default: false },
    optionsData: { type: Object, default: () => ({}) },
  },
  computed: {
    ...mapGetters({
      isMobile: 'getIsMobile',
    }),
    getComponent() {
      return this.isMobile ? 'MobileConsultFilter' : 'WebConsultFilter';
    },
  },
};
</script>
