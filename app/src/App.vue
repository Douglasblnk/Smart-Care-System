<template>
  <div id="app">
    <div v-if="routes" class="content">
      <div v-if="!isMobile" class="sidebar-content shadow">
        <sidebar />
      </div>

      <div class="wrapper">
        <div v-if="!isMobile" class="topbar-content">
          <topbar />
        </div>
        <div v-else class="mobile-topbar-content">
          <mobile-topbar />
        </div>

        <div class="router-content">
          <transition name="slide-fade" mode="out-in">
            <router-view />
          </transition>
        </div>
      </div>
    </div>

    <div v-else class="content justify-content-center align-items-center">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  components: {
    sidebar: () => import('./components/side-bar/sidebar.vue'),
    topbar: () => import('./components/top-bar/topbarDash.vue'),
  },
  data() {
    return {
      isMobile: false,
    };
  },
  computed: {
    routes() {
      if (this.$route.name === 'login') return false;
      if (this.$route.name === '404') return false;
      return true;
    },
  },
  mounted() {
    this.systemResponsivity();
  },
  methods: {
    systemResponsivity() {
      const width = window.innerWidth;

      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) &&
        width <= 1024
      )
        this.isMobile = true;
      else this.isMobile = false;

      this.$store.dispatch('setIsMobile', this.isMobile);
    },
  },
};

</script>

<style src="./app.scss" lang="scss"></style>
