<template>
  <div class="root-sidebar">
    <div class="image-wrapper p-5 d-flex justify-content-center align-items-center">
      <img src="../../assets/logo.png" class="img-fluid">
    </div>
    <div class="hr" />
    
    <div class="items-wrapper p-3 w-100 d-flex flex-column justify-content-center">
      <div v-for="(routes, index) in dashboard" :key="`routes-${index}`" class="button-wrapper">
        <div v-if="routes.web" @click="goToRoute(routes)">
          <menu-button
            :label="routes.name"
            :active="currentRoute(routes.name, $route)"
            :icon="routes.icon"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dashboard from '../../utils/dashboard-module';

export default {

  data() {
    return {
      dashboard,
    };
  },

  methods: {
    currentRoute(routes, router) {
      return routes === this.getRouteName(router);
    },
    getRouteName(router) {
      if (router.matched.length)
        return router.matched[0].name;
    },
    goToRoute(routes) {
      if (routes)
        this.$router.push(routes.link);
      else this.$router.push('/');
    },
  },
};
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
