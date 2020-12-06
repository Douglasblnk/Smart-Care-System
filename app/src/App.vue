<template>
  <div id="app">
    <div
      class="content"
      :class="isLoginScreen ? 'justify-content-center align-items-center' : ''"
    >
      <transition
        name="sidebar-slide"
        @after-leave="afterLeaveSidebar()"
        @before-enter="beforeEnterSidebar()"
      >
        <div
          v-if="!state.isMobile && !isLoginScreen"
          class="sidebar-content shadow"
          :class="isSidebarHided ? 'hided-sidebar' : ''"
        >
          <sidebar />
        </div>
      </transition>
      <div class="wrapper">
        <transition name="header-slide">
          <div v-if="!state.isMobile && !isLoginScreen" key="header" class="topbar-content">
            <Header />
          </div>
        </transition>

        <transition name="header-slide">
          <div v-if="state.isMobileAfterSidebarLeave && !isLoginScreen" key="mobileHeader" class="mobile-topbar-content">
            <mobile-header />
          </div>
        </transition>
        <div
          key="router"
          :class="state.isMobile && isLoginScreen ? 'content justify-content-center align-items-center' : 'router-content'"
        >
          <transition
            name="slide-fade"
            mode="out-in"
            v-on:after-enter="afterEnterRouter()"
          >
            <router-view />
          </transition>
        </div>

        <transition name="fade">
          <div v-if="validateVisibility && !isLoginScreen" class="bottom-navigation">
            <bottom-navigation
              :show-options="state.showOptions"
              @update:openCloseConfigs="openCloseConfigs()"
              @update:closeConfig="closeConfig"
            />
          </div>
        </transition>
      </div>
    </div>

    <transition name="fade">
      <div v-show="state.showOptions" class="config-blurred-background" />
    </transition>

    <transition name="fade">
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
        isLoginScreen: false,
        isMobileAfterSidebarLeave: false,
      },
    };
  },
  computed: {
    ...mapGetters({
      showConsultFilter: 'getShowConsultFilter',
      isSidebarHided: 'isSidebarHided',
      isDetailRoute: 'isDetailRoute',
    }),
    isLoginScreen() {
      if (this.$route.name === 'login') return true;
      return false;
    },
    validateVisibility() {
      if (!this.state.isMobile) return false;
      if (this.isDetailRoute) return false;
      return true;
    },
  },
  mounted() {
    this.systemResponsivity(window);
    window.addEventListener('resize', this.systemResponsivity); 

    this.state.isMobileAfterSidebarLeave = this.isMobile;
  },
  methods: {
    afterEnterRouter() {
      if (this.isLoginScreen) this.state.isLoginScreen = true;
      else this.state.isLoginScreen = false;
    },
    afterLeaveSidebar() {
      this.state.isMobileAfterSidebarLeave = true;
    },
    beforeEnterSidebar() {
      this.state.isMobileAfterSidebarLeave = false;
    },
    systemResponsivity({ target }) {
      const width = target ? target.innerWidth : window.innerWidth;

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

<style scoped>
.sidebar-slide-enter-active {
  transition: all .2s ease;
}
.sidebar-slide-leave-active {
  transition: all .2s;
}
.sidebar-slide-enter,
.sidebar-slide-leave-to {
  transform: translateX(-15px);
  opacity: 0;
}

.header-slide-enter-active {
  transition: all .2s ease;
}
.header-slide-leave-active {
  transition: all .2s;
}
.header-slide-enter,
.header-slide-leave-to {
  transform: translateY(-15px);
  opacity: 0;
}
</style>
