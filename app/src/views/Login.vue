<template>
  <div class="root-login-view">
    <div class="conteiner">
      <div class="login-wrapper">
        <div v-if="!isMobile">
          <div v-if="!isMobile" class="d-flex justify-content-center">
            <img src="../assets/logo.png" class="img-fluid w-50" />
          </div>
          <form @submit.prevent="loginValidation">
            <div class="hold-login mt-4 p-4 rounded-lg bg-white shadow-sm">
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
              <save-button label="Entrar" :loading="isLoading" />
            </div>
          </form>
        </div>

        <div v-if="isMobile">
          <div v-if="isMobile" class="d-flex justify-content-center">
            <img src="../assets/logo_white.png" class="img-fluid w-50" />
          </div>
          <form @submit.prevent="loginValidation">
            <div class="hold-login mt-5 p-4 bg-white">
              <mobile-input v-model="inputValues.numeroCracha" placeholder="Crachá" icon="fa-user" type="text" />
              <mobile-input v-model="inputValues.senha" placeholder="Senha" icon="fa-lock" type="password" />

              <mobile-save-button label="Entrar" />
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
    isMobile() {
      if (window.innerWidth <= '600') return true;
      return false;
    },
  },
  methods: {
    async loginValidation() {
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
        const { response } = err;

        console.log('err login => :', response );

        this.isLoading = false;

        return this.$swal({
          type: 'error',
          title: 'Por favor, tente novamente mais tarde.',
          text: 'Ocorreu um erro ao tentar realizar o login.',
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
  }
  @media screen and (max-width: 1366px) {
    .login-wrapper {
      min-width: 30vw;
    }
  }
  @media screen and (max-width: 600px) {
    .hold-login {
      border-radius: 10px !important;
      box-shadow: 1px 1px 10px -2px rgb(75, 75, 75) !important;
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
@media screen and (max-width: 600px) {
  .root-login-view {
    width: 100%;
    height: 100%;
    background-color: var(--duas-rodas-soft);
  }
  .conteiner {
    margin: 50px 0;
  }
  .login-wrapper{
    width: 90%;
  }
}
</style>