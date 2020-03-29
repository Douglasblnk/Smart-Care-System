<template>
  <div class="root-dashboard-view">
    <div v-if="isMobile">
      <mobile-dashboard-items />
    </div>
  </div>
</template>

<script>

export default {
  
  data() {
    return {

    };
  },

  mounted () {
    this.$store.commit('addPageName', 'Dashboard');
  },

  computed: {
    isMobile() {
      if (window.innerWidth <= '600') return true;
      return false;
    },
  },

  methods: {

  },
}
</script>

<style lang="scss" scoped>

</style>
