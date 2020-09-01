<template>
  <div id="app">
    <div v-if="routes" class="content">
      <div v-if="!state.isMobile" class="sidebar-content shadow">
        <sidebar />
      </div>

      <div class="wrapper">
        <div v-if="!state.isMobile" class="topbar-content">
          <Header />
        </div>

        <div v-else class="mobile-topbar-content">
          <mobile-header />
        </div>

        <div class="router-content">
          <transition name="slide-fade" mode="out-in">
            <router-view />
          </transition>
        </div>

        <transition name="fade" mode="out-in">
          <div v-if="validateVisibility" class="bottom-navigation">
            <bottom-navigation
              :show-options="state.showOptions"
              @update:openCloseConfigs="openCloseConfigs()"
              @update:closeConfig="closeConfig"
            />
          </div>
        </transition>
      </div>
    </div>

    <div v-else class="content justify-content-center align-items-center">
      <router-view />
    </div>

    <transition name="fade" mode="out-in">
      <div v-show="state.showOptions" class="config-blurred-background" />
    </transition>

    <transition name="fade" mode="out-in">
      <div v-show="showConsultFilter" class="filter-dark-background" @click="closeConsultFilter" />
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  components: {
    Sidebar: () => import('./components/web/sidebar/Sidebar.vue'),
    Header: () => import('./components/web/header/Header.vue'),
    MobileHeader: () => import('./components/mobile/header/MobileHeader.vue'),
    BottomNavigation: () => import('./components/mobile/bottom-navigation/BottomNavigation'),
  },
  data() {
    return {
      state: {
        isMobile: false,
        showOptions: false,
      },
    };
  },
  computed: {
    ...mapGetters({
      showConsultFilter: 'getShowConsultFilter',
    }),
    routes() {
      if (this.$route.name === 'login') return false;
      if (this.$route.name === '404') return false;
      return true;
    },
    validateVisibility() {
      return !this.state.isMobile ? false : true;
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
        this.state.isMobile = true;
      else this.state.isMobile = false;

      this.$store.dispatch('setIsMobile', this.state.isMobile);
    },
    openCloseConfigs() {
      this.state.showOptions = !this.state.showOptions;
    },
    closeConfig() {
      this.state.showOptions = false;
    },
    closeConsultFilter() {
      this.$store.commit('setShowConsultFilter', false);
    },
  },
};

</script>

<style src="./app.scss" lang="scss"></style>
