<template>
  <div class="root-dashboard-items">
    <div class="p-3 text-center">
      <hr>
      <h3>Atalhos</h3>
    </div>
    <div class="d-flex flex-row flex-wrap">
      <div v-for="(item, index) in dashboard" :key="`ìtem-${index}`">
        <template v-if="item.mobile">
          <card-option :title="item.name" :icon="item.icon" :route="item.link" size="small"/>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import dashboard from './../../utils/dashboard-module'
export default {
  name: 'dashboardItems',

  data() {
    return {
      dashboard,
    };
  },

  methods: {

  }
}
</script>

<style lang="scss" scoped>
.root-dashboard-items {
  h3 {
    color: rgb(126, 126, 126);
  }
}
</style>