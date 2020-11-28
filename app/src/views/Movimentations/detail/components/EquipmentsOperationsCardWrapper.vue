<template>
  <section class="root-equipments-operations-card">
    <component
      :is="getComponent"
      v-bind="$props"
    />
  </section>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'EquipmentsOperationsCardWrapper',
  components: {
    WebEquipmentsOperationsCard: () => import('./web/WebEquipmentsOperationsCard.vue'),
    MobileEquipmentsOperationsCard: () => import('./mobile/MobileEquipmentsOperationsCard.vue'),
  },
  props: {
    equipmentsOperations: { type: Object, default: () => ({}) },
    masterMaintainer: { type: Object, default: () => ({}) },
    isOrderAssumed: { type: Boolean, default: false },
    orderType: { type: String, default: '' },
    orderId: { type: Number, default: null },
  },
  computed: {
    ...mapGetters({
      isMobile: 'getIsMobile',
    }),
    getComponent() {
      return this.isMobile ? 'MobileEquipmentsOperationsCard' : 'WebEquipmentsOperationsCard';
    },
  },
};
</script>
