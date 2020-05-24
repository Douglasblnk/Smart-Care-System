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
import sidebar from './components/side-bar/sidebar.vue';
import topbar from './components/top-bar/topbarDash.vue';

export default {
  components: {
    sidebar,
    topbar,
  },

  data: () => ({}),

  computed: {
    routes() {
      if (this.$route.name === 'login') return false;
      if (this.$route.name === '404') return false;
      return true;
    },
    isMobile() {
      if (window.innerWidth <= '600') return true;
      return false;
    },
  },
};

</script>

<style src="./app.scss" lang="scss"></style>
