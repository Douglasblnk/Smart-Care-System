<template>
  <div class="root-login-view">
    <div class="conteiner">
      <div class="login-wrapper">
        <div class="d-flex justify-content-center">
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
            <login-button label="Acessar" />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import advancedInput from '../components/inputs/advanced-input'
import saveButton from '../components/button/save-button'

export default {
  components: {
    'advanced-input': advancedInput,
    'login-button': saveButton,
  },

  data() {
    return {
      inputValues: {
        numeroCracha: '',
        senha: '',
        aux: 0
      }
    };
  },

  methods: {
    loginValidation() {
        this.$http.methodPost('users', localStorage.getItem('token'), this.inputValues)
          .then(async json => {
            this.aux = 1;
            console.log("Ponto 1")
            if (json.status !== 200) return this.$swal({
              type: 'error',
              title: `${json.err}`,
              confirmButtonColor: '#F34336',
            })
            if (json.status == 429) return this.$swal({
                position: 'top',
                type: 'error',
                toast: 'true',
                title: `Houve um excesso de tentativas!`,
            })
            try {
              await this.setTokenLocalStorage(json.token);
              this.$swal({
                position: 'top',
                type: 'success',
                toast: 'true',
                title: 'Autenticado com sucesso!',
                showConfirmButton: false,
                timer: 1500
              }).then(() => {
                this.$router.replace('dashboard')
                console.log("Algo deu errado eu acho!")
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
            this.aux = 1;
            console.log(err);
            this.$swal({
              type: 'error',
              title: `Algo deu errado! Falha na requisição!`,
            })
        })
        if (this.aux == 0){ 
          this.$swal({
            type: 'error',
            title: `Houve um excesso de tentativas!`,
            html: `<b>Tente novamente em 5 minutos!</b>`,
            confirmButtonColor: '#F34336',
          })
        }
      this.aux = 0;
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

  .login-text {
    h4 {
      color: #777777;
    }
    border-bottom: 1px solid #e4e4e4;
    width: 100%;
  }
}

</style>