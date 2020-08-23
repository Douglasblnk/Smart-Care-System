<template>
  <div class="root-login-view">
    <div class="conteiner">
      <div class="login-wrapper">
        <div v-if="!isMobile">
          <div v-if="!isMobile" class="d-flex justify-content-center">
            <img src="../../assets/Logo-completa-dark.gif" width="300px" class="img-fluid" />
          </div>
          <form @submit.prevent="loginValidation">
            <div class="hold-login shadow-sm mt-4 p-4 bg-white">
              <div class="login-text d-flex justify-content-center mb-4">
                <h4>Login</h4>
              </div>
              <div>
                <advanced-input v-model="inputValues.numeroCracha" label="Crachá:" type="text" />
              </div>
              <div>
                <advanced-input v-model="inputValues.senha" label="Senha:" type="password" />
              </div>
            </div>
            <div class="d-flex justify-content-center m-3">
              <smart-button :loading="isLoading" primary>
                <span>Entrar</span>
              </smart-button>
            </div>
          </form>
        </div>

        <div v-if="isMobile">
          <div v-if="isMobile" class="d-flex justify-content-center">
            <img src="../../assets/Logo-completa.gif" width="300px" class="img-fluid" />
          </div>
          <form @submit.prevent="loginValidation">
            <div class="hold-login mt-5 p-4 bg-white">
              <mobile-input v-model="inputValues.numeroCracha" placeholder="Crachá" icon="fa-user" type="text" />
              <mobile-input v-model="inputValues.senha" placeholder="Senha" icon="fa-lock" type="password" />

              <mobile-save-button id="entrar" label="Entrar" />
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getErrors } from '../../utils/utils';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      inputValues: {
        numeroCracha: '',
        senha: '',
      },
      isLoading: false,
    };
  },

  computed: {
    ...mapGetters({
      isMobile: 'getIsMobile',
    }),
  },
  
  methods: {
    async loginValidation() {
      if (this.isLoading === true) return;

      try {
        this.isLoading = true;

        const response = await this.$http.post('users', localStorage.getItem('token'), this.inputValues);

        this.$http.setActivity(
          'login',
          {
            nome: response.nome,
            email: response.email,
            cracha: response.numeroCracha,
            date: this.$moment().format('DD-MM-YYYY HH-mm'),
          },
          'unnecessaryToken'
        );

        this.$store.commit('addUser', {
          email: response.email,
          nome: response.nome,
          nivelAcesso: response.nivel_acesso,
          funcao: response.funcao,
          cracha: response.numeroCracha,
          userId: response.idUsuario,
        });

        this.setTokenLocalStorage(response.token);

        this.$swal({
          position: 'top',
          type: 'success',
          toast: 'true',
          title: 'Autenticado com sucesso!',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          this.isLoading = false;
          this.$router.replace('dashboard');
        });
      } catch (err) {
        console.log('err login => :', err.response || err);

        this.isLoading = false;

        return this.$swal({
          type: 'error',
          title: 'Não foi possível realizar o login',
          text: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    setTokenLocalStorage(token) {
      return localStorage.setItem('token', token);
    },
    testingDevelopmentRoutes() {
      this.$router.push('dashboard');
    },
  },
};
</script>

<style lang="scss" scoped>
.root-login-view {
  .conteiner {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .login-wrapper {
    min-width: 20vw;
    min-height: 100px;
    padding: 10px;
    .hold-login { border-radius: 10px !important }
  }
  @media screen and (max-width: 1366px) {
    .login-wrapper {
      min-width: 30vw;
    }
  }
  .login-text {
    h4 {
      color: #777777;
    }
    border-bottom: 1px solid #e4e4e4;
    width: 100%;
  }
}
@media screen and (max-width: 1024px) {
    .hold-login {
      border-radius: 10px !important;
      box-shadow: 1px 1px 10px -2px rgb(75, 75, 75) !important;
    }
    .root-login-view {
      width: 100%;
      height: 100%;
      background-color: var(--duas-rodas-soft);
    }
    .conteiner {
      margin: 50px 0;
    }
    .login-wrapper{
      width: 100%;
    }
  }
</style>
