<template>
  <div class="root-topbar">
    <div class="container-wrapper">
      <div class="tituloTop">
        <span v-if="$route.matched.length > 1">
          {{ $route.matched[0].name }} |
        </span>
        <span :class="{'small-text' : $route.matched.length > 1}">
          {{ $route.name }}
        </span>
      </div>

      <div class="name-notification">
        <i class="fas fa-bell" />
        <span>|</span>

        <b-dropdown size="lg" right variant="link" toggle-class="text-decoration-none p-0" no-caret>
          <template v-slot:button-content>
            <i class="fas fa-user" />
          </template>

          <b-dropdown-item href="#">
            <i class="fas fa-id-card-alt" />
            <span>
              Meu perfil
            </span>
          </b-dropdown-item>

          <b-dropdown-item @click="logoff()" toggle-class="red">
            <i class="fas fa-sign-out-alt" />
            <span>
              Sair
            </span>
          </b-dropdown-item>
        </b-dropdown>
        <!-- <div class="UserLogin">
          <ul>
            <li class="UserNameStyle">Ronei Roteski</li>
            <li class="text-danger">Administrador</li>
          </ul>
        </div> -->
        
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {

  },
  data() {
    return {
      // route: this.$route.name,
    }
  },

  mounted() {
    console.log(this.$route);
  },

  methods: {
    logoff() {
      console.log(this.$route);
      this.$swal({
        type: 'question',
        title: 'Deseja realmente sair do sistema?',
        showCancelButton: true,
        cancelButtonText: 'Não!',
        confirmButtonText: 'Sim!',
        confirmButtonColor: '#F34336'
      }).then(res => {
        if (res.value) {
          localStorage.removeItem('token');
          this.$router.replace('/')
        }
      })
    }
  }
}
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
        font-family: 'Montserrat';
        color: #979797
      }
      .small-text {
        font-size: 16px;
      }
    }
    .name-notification {
      display: flex;
      align-items: center;
      .UserLogin{
        ul{
          padding-left:0px;
          padding-right:30px;
          margin:0px;
          list-style-type: none;
          .UserNameStyle{
            color:rgb(160, 160, 160);
          }
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
