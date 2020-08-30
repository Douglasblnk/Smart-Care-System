<template>
  <div class="root-topbar">
    <div class="container-wrapper">
      <div class="main-text">
        <i class="fa" :class="mainIcon" />
        <span class="font-weight-light">
          {{ pageName }}
        </span>
      </div>

      <div class="name-notification" @click="openProfile()">
        <i class="fas fa-user fa-sm" />
        <small>{{ getUserName }}</small>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters({
      mainIcon: 'getMainIcon',
      pageName: 'getPageName',
      userBadge: 'getUser',
    }),
    getUserName() {
      return this.userBadge?.nome?.split(' ')[0];
    },
  },
  methods: {
    async openProfile() {
      if (this.$route.matched.some(({ name }) => name === 'Meu Perfil')) return;
      
      this.$router.push({ path: '/perfil' });
    },
  },
};
</script>


<style lang="scss" scoped>
.root-topbar {
  padding: 10px 20px;
  display: flex;
  align-items: center;
  background: var(--duas-rodas-soft);
  box-shadow: 1px 2px 4px -1px rgb(194, 194, 194);
  .container-wrapper {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .main-text {
      display: flex;
      justify-items: center;
      span {
        font-size: 20px;
        font-family: 'roboto';
        color: #ffffff
      }
      i {
        color: #fff;
        display: flex;
        align-items: center;
        margin: 0 10px;
      };
    }
    .name-notification {
      display: flex;
      align-items: center;
      small { color: white; }
      i { color: white; margin: 0 5px;}
    }
  }
}
</style>
