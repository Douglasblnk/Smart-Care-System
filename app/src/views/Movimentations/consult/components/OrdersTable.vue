<template>
  <section class="root-orders-table">
    <component
      :is="getComponent"
      v-bind="$props"
      @update:openOrder="row => $emit('update:openOrder', row)"
      @update:openSummary="row => $emit('update:openSummary', row)"
    />
  </section>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'OrdersTable',
  components: {
    WebOrdersTable: () => import('./web/WebOrdersTable.vue'),
    MobileOrdersTable: () => import('./mobile/MobileOrdersTable'),
  },
  props: {
    maintenainceOrders: { type: Array, default: () => [] },
    getFilteredOrders: { type: Array, default: () => [] },
    isLoading: { type: Boolean, default: false },
    isLoadingOrder: { type: Object, default: () => ({}) },
  },
  computed: {
    ...mapGetters({
      isMobile: 'getIsMobile',
    }),
    getComponent() {
      return this.isMobile ? 'MobileOrdersTable' : 'WebOrdersTable';
    },
  },
};
</script>
