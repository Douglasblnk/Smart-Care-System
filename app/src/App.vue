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

  data(){
    return {
      
    };
  },

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

<style lang="scss">
:root {
  --duas-rodas: #F34336;
  --duas-rodas-soft: #E66E6D;
  --shadow-gray: rgb(160, 160, 160);
  --gray: rgb(92, 92, 92);
  --button-gray: #eee;
}

body {
  background-color: #f1f1f1 !important;
  box-sizing: border-box;
}

span, p, strong {
  color: var(--gray)
}

@font-face {
  font-family: "roboto";
  src: url("./assets/fonts/Roboto-Light.ttf");
  src: url("./assets/fonts/Roboto-Regular.ttf");
}

@font-face {
  font-family: "roboto-thin";
  src: url("./assets/fonts/Roboto-Light.ttf");
}

.swal2-styled.swal2-confirm {
  background-color: #F34336 !important;
}

.no-padding {
  padding: 0 !important;
}

.content {
  width: 100vw;
  height: 100vh;
  display: flex;
  .wrapper {
    display: flex;
    overflow: auto;
    flex-direction: column;
    width: 100%;
    .topbar-content {
      width: 100%;
      padding: 20px;
    }
    .mobile-topbar-content{
      width: 100%;
    }
    .router-content {
      box-sizing: border-box;
      padding: 20px;
      width: 100%;
      height: 100%;
    }
  }
  .sidebar-content {
    overflow: auto;
    max-width: 20rem;
    background-color: white;
    height: 100%;
  }
  
}

@media screen and (max-width: 1366px) {
  .content > .sidebar-content {
    min-width: 16rem;
  }
}

.cursor-pointer {
  cursor: pointer;
}

.link {
  cursor: pointer;
  text-decoration: underline;
  color: rgb(60, 70, 131)
}

.slide-fade-enter-active {
  transition: all 0.1s ease;
}
.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

.slide-down-enter-active {
  transition: all 0.2s ease;
}
.slide-down-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-down-enter,
.slide-down-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-side-enter-active {
  transition: all 0.2s ease;
}
.slide-side-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-side-enter,
.slide-side-leave-to {
  transform: translateX(10px);
  opacity: 0;
}

</style>
