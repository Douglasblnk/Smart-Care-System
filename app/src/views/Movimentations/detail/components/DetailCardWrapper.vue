<template>
  <section class="root-detail-card">
    <component
      :is="getComponent"
      v-bind="$props"
      @update:orderMovimentations="type => $emit('update:orderMovimentations', type)"
      @update:excludeOrder="$emit('update:excludeOrder')"
      @update:openIntiveTechnician="$emit('update:openIntiveTechnician')"
      @update:openOrderNote="$emit('update:openOrderNote')"
      @update:openOrderVerification="$emit('update:openOrderVerification')"
      @update:toggleShowEpiModal="$emit('update:toggleShowEpiModal')"
    />
  </section>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'DetailCardWrapper',
  components: {
    WebDetailCard: () => import('./web/WebDetailCard.vue'),
    MobileDetailCard: () => import('./mobile/MobileDetailCard.vue'),
  },
  props: {
    order: { type: Object, default: () => ({}) },
    isLoading: { type: Object, default: () => ({}) },
    isOrderAssumed: { type: Boolean, default: false },
    orderMasterMaintainer: { type: String, default: '' },
    orderInvitedMaintainers: { type: [String, Array], default: '' },
  },
  computed: {
    ...mapGetters({
      isMobile: 'getIsMobile',
    }),
    getComponent() {
      return this.isMobile ? 'MobileDetailCard' : 'WebDetailCard';
    },
  },
};
</script>
