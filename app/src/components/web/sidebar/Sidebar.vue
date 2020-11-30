<template>
  <div class="root-sidebar">
    <div class="image-wrapper" :style="isSidebarHided ? 'padding: 50px 0 10px 0 !important' : ''">
      <img
        v-show="!isSidebarHided"
        key="not-hided"
        src="../../../assets/Logo-completa-dark.gif"
        class="img-fluid"
      >

      <img
        v-show="isSidebarHided"
        key="hided"
        width="30"
        src="../../../assets/logo-s.gif"
        class="img-fluid"
      >
    </div>
    
    <div class="d-flex justify-content-center">
      <div class="menu-bars-wrapper" @click="toggleHideSidebar()">
        <div
          class="menu-bars"
          style="transform-origin: left top;"
          :class="{ 'menu-bar-rotate-left': !isSidebarHided }"
        />
        <div
          class="menu-bars"
          :class="{ 'menu-bar-hide': !isSidebarHided }"
        />
        <div
          class="menu-bars"
          style="transform-origin: left bottom;"
          :class="{ 'menu-bar-rotate-right': !isSidebarHided }"
        />
      </div>
    </div>
    
    <div class="items-wrapper">
      <div v-for="(routes, index) in dashboard" :key="`routes-${index}`">
        <div v-if="routes.web">
          <menu-button
            :label="!isSidebarHided ? routes.name : ''"
            :active="currentRoute(routes.name, $route)"
            :icon="routes.icon"
            :is-sidebar-hided="isSidebarHided"
            :title="routes.name"
            @clicked="goToRoute(routes)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import dashboard from '../../../utils/dashboard-module';

export default {
  data() {
    return {
      dashboard,
    };
  },
  computed: {
    ...mapGetters({
      isSidebarHided: 'isSidebarHided',
    }),
  },
  methods: {
    ...mapActions(['hideSidebar']),
    currentRoute(selectedRoute, { name, matched }) {
      return selectedRoute === name || matched[0]?.name.includes(selectedRoute);
    },
    goToRoute({ link }) {
      if (link && this.$route.path !== link)
        this.$router.push(link);
    },
    toggleHideSidebar() {
      console.log('object');
      this.hideSidebar(!this.isSidebarHided);
    },
  },
};
</script>

<style lang="scss" scoped>
.root-sidebar {
  display: flex;
  flex-direction: column;

  .image-wrapper {
    flex: 1;
    padding: 50px 40px 0px 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .items-wrapper {
    flex: 20;
    width: 100%;
    padding-bottom: 10vh;
    display: flex;
    flex-direction: column;
    justify-content: center;

    @media (max-height: 768px) {
      padding-bottom: 0;
    }
  }

  .menu-bars-wrapper {
    position: relative;
    margin-bottom: 20px;
    cursor: pointer;

    .menu-bars {
      width: 20px;
      border: 1px solid #aaa;
      border-radius: 10px;
      margin: 4px 0;
      transition: .3s;
      &.menu-bar-rotate-left {
        transform: rotatez(40deg);
      }
      &.menu-bar-rotate-right {
        transform: rotatez(-40deg);
      }
      &.menu-bar-hide {
        border: 1px solid transparent;
      }
    }
  }
  .hide-sidebar-enter-active {
    transition: all 0.3s ease;
  }
  .hide-sidebar-leave-active {
    transition: all 0.3s ease;
  }
  .hide-sidebar-enter,
  .hide-sidebar-leave-to {
    opacity: 0;
  }
}
</style>
