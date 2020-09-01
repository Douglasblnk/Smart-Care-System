<template>
  <div class="root-topbar">
    <div class="container-wrapper">
      <div class="tituloTop">
        <span>
          {{ getPageName }}
        </span>
      </div>

      <div class="name-notification">
        <i class="fas fa-bell" />
        <div class="pipe" />

        <b-dropdown size="lg" right variant="link" toggle-class="text-decoration-none p-0" no-caret>
          <template v-slot:button-content>
            <i class="fas fa-user" />
          </template>

          <b-dropdown-item @click="openProfile()">
            <i class="fas fa-id-card-alt" />
            <span>
              Meu perfil
            </span>
          </b-dropdown-item>

          <b-dropdown-item @click="logoff()">
            <i class="fas fa-sign-out-alt" />
            <span>
              Sair
            </span>
          </b-dropdown-item>
        </b-dropdown>
        <div class="user-login">
          <span class="text-muted">
            {{ $store.state.user.nome }}
          </span>
          <small class="text-danger">
            {{ $store.state.user.funcao }}
          </small>
        </div>
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
  },

  methods: {
    logoff() {
      this.$swal({
        type: 'question',
        title: 'Deseja realmente sair do sistema?',
        showCancelButton: true,
        cancelButtonText: 'Não',
        confirmButtonText: 'Sair',
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
      
      this.$router.push({ path: '/perfil' });
    },
  },
};
</script>

<style lang="scss" scoped>
.root-topbar {
  width: 100%;
  min-height: 65px;
  padding: 20px;
  background: #ffff;
  box-shadow: 1px 2px 4px -1px rgb(194, 194, 194);
  border-radius: 42px;
  .container-wrapper {
    display: flex;
    justify-content: space-between;
    .tituloTop {
      margin: 0 10px;
      span {
        font-size: 20px;
        font-family: 'roboto';
        color: #979797
      }
      .small-text {
        font-size: 16px;
      }
    }
    .name-notification {
      display: flex;
      align-items: center;
      .pipe {
        height: 100%;
        border-right: 1px solid #dddddd;
      }
      .user-login{
        display: flex;
        flex-direction: column;
        span, small {
          font-family: 'roboto';
          line-height: 1;
        }
      }
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
  i {
    margin: 0px 20px;
    color: #acacac;
    font-size: 20px;
  }
}
</style>
