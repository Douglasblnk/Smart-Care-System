<template>
  <section class="root-my-component">
    <component
      :is="getComponent"
      v-bind="$props"
      @eventosPersonalizados="metodo"
    />
  </section>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'MyComponent', // nome do componente
  components: {
    // componentes utilizados
  },
  props: {
    // props
  },
  computed: {
    ...mapGetters({
      isMobile: 'getIsMobile',
    }),
    getComponent() {
      return this.isMobile ? 'MobileComponent' : 'WebComponent';
    },
  },
};
</script>
