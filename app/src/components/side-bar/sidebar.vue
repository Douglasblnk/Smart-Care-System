<template>
  <div class="root-sidebar">
    <div class="image-wrapper p-5 d-flex justify-content-center align-items-center">
      <img src="../../assets/logo.png" class="img-fluid">
    </div>
    <div class="hr" />
    
    <div class="items-wrapper p-3 w-100 d-flex flex-column justify-content-center">
      <div v-for="(routes, index) in dashboard" :key="`routes-${index}`" class="button-wrapper">
        <router-link :to="routes.link ? routes.link : '/'">
          <menu-button
            :label="routes.name"
            :active="currentRoute(routes.name)"
            :icon="routes.icon"
          />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import menuButton from '../button/menu-button';
import dashboard from "../../utils/dashboard-module";

export default {
  components: {
    'menu-button': menuButton,
  },

  data: () => ({
    dashboard
  }),

  // created() {
  //   console.log(this.$route.name);
  // },

  methods: {
    currentRoute(routes) {
      return routes.toLowerCase() === this.$route.matched[0].name.toLowerCase();
    }
  },
}
</script>

<style lang="scss" scoped>
.root-sidebar{
  .hr {
    margin: 0 auto;
    border-bottom: 1px solid rgb(216, 216, 216);
    width: 80%;
  }
  .button-wrapper {
    a {
      text-decoration: none;
      
    }
  }
}
</style>