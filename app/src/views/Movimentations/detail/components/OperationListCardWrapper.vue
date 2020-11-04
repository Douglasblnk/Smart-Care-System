<template>
  <section class="root-operation-list-card">
    <component
      :is="getComponent"
      v-bind="$props"
    />
  </section>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'OperationListCard',
  components: {
    WebOperationListCard: () => import('./web/WebOperationListCard'),
  },
  props: {

  },
  computed: {
    ...mapGetters({
      isMobile: 'getIsMobile',
    }),
    getComponent() {
      return this.isMobile ? '' : 'WebOperationListCard';
    },
  },
};
</script>
