<template>
  <div class="root-sidebar">
    <div class="image-wrapper p-5 d-flex justify-content-center align-items-center">
      <img src="../../assets/logo.png" class="img-fluid">
    </div>
    <div class="hr" />
    
    <div class="items-wrapper p-3 w-100 d-flex flex-column justify-content-center">
      <div v-for="(routes, index) in dashboard" :key="`routes-${index}`" class="button-wrapper">
        <router-link :to="routes.link ? routes.link : '/'">
          <div v-if="routes.web">
            <menu-button
              :label="routes.name"
              :active="currentRoute(routes.name, $route)"
              :icon="routes.icon"
            />
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import dashboard from "../../utils/dashboard-module";

export default {

  data() {
    return {
      dashboard
    }
  },

  methods: {
    currentRoute(routes, router) {
      return routes.toLowerCase() === router.name.toLowerCase();
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