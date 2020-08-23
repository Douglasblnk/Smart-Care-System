<template>
  <div class="root-topbar">
    <div class="container-wrapper">
      <div class="screen-icon">
        <router-link class="text-decoration-none text-muted" to="/dashboard">
          <i class="fa fa-home" />
        </router-link>
      </div>
      <div class="tituloTop">
        <span class="font-weight-light">
          {{ getPageName }}
        </span>
      </div>

      <div class="name-notification">
        <b-dropdown size="lg" right variant="link" toggle-class="text-decoration-none p-0" no-caret>
          <template v-slot:button-content>
            <i class="fas fa-user icon" />
          </template>

          <b-dropdown-item @click="openProfile()">
            <i class="fas fa-id-card-alt" />
            <span>
              Meu perfil
            </span>
          </b-dropdown-item>

          <b-dropdown-item toggle-class="red" @click="logoff()">
            <i class="fas fa-sign-out-alt" />
            <span>
              Sair
            </span>
          </b-dropdown-item>
        </b-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    getPageName() {
      return this.$store.state.page;
    },
    getUserBadge() {
      return this.$store.state.user.cracha;
    },
  },
  methods: {
    logoff() {
      this.$swal({
        type: 'question',
        title: 'Deseja realmente sair do sistema?',
        showCancelButton: true,
        cancelButtonText: 'Não!',
        confirmButtonText: 'Sim!',
        confirmButtonColor: '#F34336',
      }).then(res => {
        if (res.value) {
          localStorage.removeItem('token');
          this.$router.replace('/');
        }
      });
    },

    async openProfile() {
      if (this.$route.matched.some(({ name }) => name === 'Meu Perfil')) return;
      
      this.$router.push({ path: `/perfil/${this.getUserBadge}` });
    },
  },
};
</script>


<style lang="scss" scoped>
.root-topbar {
  width: 100%;
  min-height: 65px;
  padding: 15px;
  background: var(--duas-rodas-soft);
  box-shadow: 1px 2px 4px -1px rgb(194, 194, 194);
  .container-wrapper {
    display: flex;
    justify-content: space-between;
    .screen-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      i { color: #fff }
    }
    .tituloTop {
      margin: 0 10px;
      span {
        font-size: 20px;
        font-family: 'roboto';
        color: #ffffff
      }
    }
    .name-notification {
      display: flex;
      align-items: center;
      .fa-user {
        &:hover {
          transform: scale(1.2);
        }
        &:active {
          transform: scale(1);
        }
      }
      .dropdown-item {
        align-items: center;
        i {
          margin: 0px !important;
        }
        &:active {
          background-color: #ec4d4d !important;
          i {
            color: white;
          }
        }
      }
    }
  }
  .icon {
    color: #ffffff;
  }
  i {
    margin: 0px 20px;
    color: #acacac;
    font-size: 20px;
  }
}
</style>
