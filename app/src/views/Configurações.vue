<template>
  <div class="root-configuracoes-view">
    <div class="wrapper-configuration p-3">

      <div class="label-text">
        <span class="text-muted">Usuários</span>
      </div>

      <div class="accordion-container mb-3">
        <accordion title="Gerenciar usuário" icon="fas fa-user-edit">
          <transition name="slide-fade" mode="out-in">
            <template v-if="!isEditing">
              <div class="accordion-content bg-white mt-3 p-4">
                <div class="table-responsive">
                  <table class="table table table-striped table-borderless table-hover" cellspacing="0">
                    <thead class="table-head">
                      <tr>
                        <th scope="col">Nome</th>
                        <th scope="col">Crachá</th>
                        <th scope="col">E-mail</th>
                        <th scope="col">Nível de acesso</th>
                        <th scope="col">Ações</th>
                      </tr>
                    </thead>
                    <tbody class="table-body">
                      <tr v-for="(user, index) in users" :key="`user-${index}`">
                        <td>{{ user.nome }}</td>
                        <td>{{ user.numeroCracha }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.nivelAcesso }}</td>
                        <td style="width: 50px">
                          <div class="d-flex table-action">
                            <i class="fas fa-edit text-muted" @click="editUser(user)"></i>
                            <i class="fas fa-trash text-muted" @click="deleteUser(user, index)"></i>
                          </div> 
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </template>

            <template v-if="isEditing">
              <form @submit.prevent="updateUser">
                <div class="accordion-content bg-white mt-3 p-3 d-flex flex-wrap">
                  <div class="p-2 m-2 w-25">
                    <simples-input v-model="userInputValues.nome" label="Nome" type="text"></simples-input>
                  </div>
                  <div class="p-2 m-2 w-25">
                    <simples-input v-model="userInputValues.numeroCracha" label="Cracha" type="number"></simples-input>
                  </div>
                  <div class="p-2 m-2 w-25">
                    <simples-input v-model="userInputValues.funcao" label="Função" type="text"></simples-input>
                  </div>
                  <div class="p-2 m-2 w-25">
                    <simples-input v-model="userInputValues.nivelAcesso" label="Nível de acesso" type="number"></simples-input>
                  </div>
                  <div class="p-2 m-2 w-25">
                    <simples-input v-model="userInputValues.email" label="E-mail" type="email"></simples-input>
                  </div>
                  <div class="p-2 m-2 w-25">
                    <simples-input v-model="userInputValues.senha" label="Senha" type="password"></simples-input>
                  </div>
                </div>
                <div class="save d-flex justify-content-center">
                  <save-button label="Alterar" @click="updateUser"/>
                  <cancel-button label="Cancelar" @click.native="closeEditingUser" />
                </div>
              </form>
            </template>
          </transition>
        </accordion>
      </div>

      <div class="accordion-container mb-3">
        <accordion title="Cadastrar usuário" icon="fas fa-user">
          <form @submit.prevent="register">
            <div class="accordion-content bg-white mt-3 p-3 d-flex flex-wrap">
              <div class="p-2 m-2">
                <simples-input v-model="userInputValues.nome" label="Nome" type="text"></simples-input>
              </div>
              <div class="p-2 m-2">
                <simples-input v-model="userInputValues.numeroCracha" label="Cracha" type="number"></simples-input>
              </div>
              <div class="p-2 m-2">
                <simples-input v-model="userInputValues.funcao" label="Função" type="text"></simples-input>
              </div>
              <div class="p-2 m-2">
                <simples-input v-model="userInputValues.nivelAcesso" label="Nível de acesso" type="number"></simples-input>
              </div>
              <div class="p-2 m-2">
                <simples-input v-model="userInputValues.email" label="E-mail" type="email"></simples-input>
              </div>
              <div class="p-2 m-2">
                <simples-input v-model="userInputValues.senha" label="Senha" type="password"></simples-input>
              </div>
            </div>
            <div class="save">
              <save-button label="Cadastrar" />
            </div>
          </form>
        </accordion>
      </div>

    </div>
  </div>
</template>

<script>
import { getLocalStorageToken } from '../utils/utils';
import accordion from '../components/accordion/accordion';
import simpleInput from '../components/inputs/simple-input';
import saveButton from '../components/button/save-button';
import cancelButton from '../components/button/cancel-button';
//import table from '../components/table/table';

export default {
  components: {
    accordion,
    'simples-input': simpleInput,
    'save-button': saveButton,
    'cancel-button': cancelButton,
    //'custom-table': table,
  },

  data() {
    return {
      token: '',
      userInputValues: {
        nome: '',
        numeroCracha: '',
        funcao: '',
        email: '',
        senha: '',  
        nivelAcesso: ''
      },
      users: [],
      isEditing: false,
    };
  },

  mounted() {
    this.getUsers()
  },

  methods: {
    getUsers() {
      console.log('hereee');
      this.$http.methodGet('users/get', getLocalStorageToken()).then(res => {
        if (res.result.length === 0) this.$swal({
          type: 'warning',
          title: 'Não foi encontrado nenhum usuário cadastrado!',
          confirmButtonColor: '#F34336',
        })
        console.log(res.result.length);
        if (res.result.length === undefined) 
          this.users.push(res.result)
        else this.users = [ ...res.result ]
        console.log(this.users);
      })
      
    },

    register() {
      this.$http.methodPost('users/register', getLocalStorageToken(), this.userInputValues)
        .then(async json => {
          if (json.status !== 200) return this.$swal({
            type: 'error',
            title: `Ops! ${json.err}`,
            confirmButtonColor: '#F34336',
          })
          this.$swal({
            type: 'success',
            title: `${json.result}`,
            confirmButtonColor: '#F34336',
          }).then(res => {
            this.users.push(this.userInputValues);
            this.resetModel();
            console.log(res)
          })
        })
    },

    editUser(user) {
      console.log(user);
      this.userInputValues = { ...user }
      console.log(this.userInputValues);
      this.isEditing = true;
    },

    updateUser() {
      this.$http.methodUpdate('users', getLocalStorageToken(), this.userInputValues, this.userInputValues.numeroCracha)
        .then(res => {
          if (res.status !== 200) return this.$swal({
            type: 'error',
            title: res.err,
            confirmButtonColor: '#F34336',
          })
          this.$swal({
            type: 'success',
            title: res.result
          }).then(() => {
            const index = this.users.indexOf(this.users.find(i => i.numeroCracha === this.userInputValues.numeroCracha))
            this.users.splice(index, 1, this.userInputValues)
            this.closeEditingUser()
          })
        })
    },

    deleteUser(user, index) {
      console.log(user);
      this.$swal({
        type: 'question',
        title: `Deseja mesmo remover o usuário ${user.nome}?`,
        showCancelButton: true,
        confirmButtonColor: '#F34336',
        preConfirm: () => {
          this.$http.methodDelete('users', getLocalStorageToken(), user.numeroCracha)
            .then(json => {
              if (json.status !== 200) return this.$swal({
                type: 'warning',
                title: json.err,
                confirmButtonColor: '#F34336',
              })
              this.$swal({
                type: 'success',
                title: json.result,
                confirmButtonColor: '#F34336',
              }).then(res => {
                this.users.splice(index, 1)
                console.log(this.users+res);
              })
            })
        }
      })
    },

    closeEditingUser() {
      this.isEditing = false;
      this.resetModel();
    },

    resetModel() {
      this.userInputValues = {}
    }
  },
}
</script>

<style lang="scss" scoped>
.root-configuracoes-view {
  display: flex;
  justify-content: center;
  align-items: center;
  .wrapper-configuration {
    width: 75%
  }
  @media screen and (max-width: 1366px) { 
    .wrapper-configuration {
      width: 90%
    }
  }
  .label-text {
    span {
      font-family: 'Montserrat';
      font-size: 20px;
    }
  }
  .accordion-content {
    border-radius: 10px;
    table {
      overflow:hidden;
      border-collapse:separate;
      border-radius: 10px;
    }
    .table-head {
      background-color: var(--duas-rodas);
      color: white;
      th {
        padding: 20px;
      }
    }
    .table-body {
      td {
        padding: 20px;
      }
    }
    .table-action {
      i {
        margin: 0 10px;
        cursor: pointer;
        transition: .1s;
        &:hover {
          transform: scale(1.3);
        }
        &:active {
          transform: scale(1);
        }
      }
    }
  }
}

.slide-fade-enter-active {
  transition: all 0.1s ease;
}
.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>