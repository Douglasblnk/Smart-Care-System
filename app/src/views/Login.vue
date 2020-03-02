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
              <save-button label="Entrar" />
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
        senha: ''
      },
    };
  },

  computed: {
    isMobile() {
      if (window.innerWidth <= '600') return true;
      return false;
    },
  },

  methods: {
    loginValidation() {
      this.$http.methodPost('users', localStorage.getItem('token'), this.inputValues)
        .then(async json => {
          if (json.status !== 200) return this.$swal({
            type: 'error',
            title: `${json.err}`,
            confirmButtonColor: '#F34336',
          })
          try {
            this.$setActivity(
              'login',
              {
                nome: json.nome,
                email: json.email,
                cracha: json.numeroCracha,
                date: this.$moment().format('DD-MM-YYYY HH-mm')
              },
              'unnecessaryToken'
            );
            
            this.$store.commit('addUser', { email: json.email, nome: json.nome, nivelAcesso: json.nivelAcesso, cracha: json.numeroCracha });
            
            await this.setTokenLocalStorage(json.token);

            this.$swal({
              position: 'top',
              type: 'success',
              toast: 'true',
              title: 'Autenticado com sucesso!',
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              console.log('statre :', this.$store.state.user);
              this.$router.replace('dashboard')
            });
          } catch (err) {
            this.$swal({
              position: 'top',
              type: 'error',
              toast: 'true',
              title: `Ocorreu um erro!`,
            })
          }
        }).catch(err => {
          console.log(err);
          this.$swal({
            type: 'error',
            title: `Algo deu errado! Falha na requisição!`,
          })
      })
    },

    setTokenLocalStorage(token) {    
      console.log(token);  
      return new Promise((resolve, reject) => {
        if (this.$_.isEmpty(token)) reject();
        localStorage.setItem('token', token)
        resolve();
      })
    },

    testingDevelopmentRoutes() {
      this.$router.push('dashboard')
    }

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