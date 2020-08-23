  
<template>
  <div class="root-configuracoes-view">
    <div class="d-flex align-items-center">
      <div class="back-button ml-3" @click="goBack">
        <i
          class="fa fa-arrow-left fa-fw"
          title="Retornar"
        />
        <span>Voltar</span>
      </div>
    </div>

    <div class="content-wrapper">
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
                        <tr v-if="users.length === 0">
                          <td colspan="5" class="text-center">Nenhum usuário encontrado.</td>
                        </tr>
                        <tr v-for="(user, index) in users" :key="`user-${index}`">
                          <td>{{ user.nome }}</td>
                          <td>{{ user.numeroCracha }}</td>
                          <td>{{ user.email }}</td>

                          <td>{{ getAccessLevelName(user.nivel_acesso) }}</td>
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
                      <simple-input v-model="userInputValues.nome" label="Nome" type="text"></simple-input>
                    </div>
                    <div class="p-2 m-2 w-25">
                      <simple-input v-model="userInputValues.numeroCracha" label="Cracha" type="number"></simple-input>
                    </div>
                    <div class="p-2 m-2 w-25">
                      <simple-input v-model="userInputValues.funcao" label="Função" type="text"></simple-input>
                    </div>
                    <div class="p-2 m-2 w-25">
                      <custom-select
                        v-model="userInputValues.nivelAcesso"
                        label="Nível de acesso"
                        :options="getAccessLevelOptions()"
                      />
                    </div>
                    <div class="p-2 m-2 w-25">
                      <simple-input v-model="userInputValues.email" label="E-mail" type="email"></simple-input>
                    </div>
                    <div class="p-2 m-2 w-25">
                      <simple-input v-model="userInputValues.senha" label="Senha" type="password"></simple-input>
                    </div>
                  </div>
                  <div class="save d-flex justify-content-center">
                    <save-button label="Alterar" @click="updateUser" />
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
                  <simple-input v-model="userInputValues.nome" label="Nome" type="text"></simple-input>
                </div>
                <div class="p-2 m-2">
                  <simple-input v-model="userInputValues.numeroCracha" label="Cracha" type="number"></simple-input>
                </div>
                <div class="p-2 m-2">
                  <simple-input v-model="userInputValues.funcao" label="Função" type="text"></simple-input>
                </div>
                <div class="p-2 m-2">
                  <custom-select
                    v-model="userInputValues.nivelAcesso"
                    label="Nível de acesso"
                    :options="getAccessLevelOptions()"
                  />
                </div>
                <div class="p-2 m-2">
                  <simple-input v-model="userInputValues.email" label="E-mail" type="email"></simple-input>
                </div>
                <div class="p-2 m-2">
                  <simple-input v-model="userInputValues.senha" label="Senha" type="password"></simple-input>
                </div>
              </div>
              <div class="save d-flex justify-content-center">
                <save-button label="Cadastrar" />
              </div>
            </form>
          </accordion>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getLocalStorageToken, getErrors, getAccessLevelName } from '../../utils/utils';

export default {
  name: 'Configurações',
  data() {
    return {
      token: '',
      userInputValues: {
        nome: '',
        numeroCracha: '',
        funcao: '',
        email: '',
        senha: '',
        nivelAcesso: '',
      },
      users: [],
      accessLevel: [],
      isEditing: false,
      getAccessLevelName,
    };
  },
  mounted() {
    this.$store.commit('addPageName', 'Configurações');

    this.getUsers();
    this.getAccessLevel();
  },

  methods: {
    async getUsers() {
      try {
        const response = await this.$http.get('users/get', getLocalStorageToken());
        
        if (response.result.length === 0) return;
        
        if (response.result.length === undefined)
          this.users.push(response.result);
        else this.users = [...response.result];
      } catch (err) {
        console.log('error getUser => ', err.response || err);
      }
    },
    async getAccessLevel() {
      try {
        const response = await this.$http.get('nivel-acesso/get', getLocalStorageToken());

        if (response.result.length === undefined)
          this.accessLevel.push(response.result);

        else this.accessLevel = [...response.result];
      } catch (err) {
        console.log('err getAccessLevel :>> ', err.response || err);

        this.$swal({
          type: 'warning',
          text: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    async register() {
      try {
        const response = await this.$http.post('users/register', getLocalStorageToken(), this.userInputValues);
        console.log('response :>> ', response);
        this.$http.setActivity(
          'registerUser',
          {
            ...this.$store.state.user,
            date: this.$moment().format('DD-MM-YYYY HH-mm'),
            descricao: `
              ${this.$store.state.user.nome} cadastrou o usuário 
              ${this.userInputValues.numeroCracha} - ${this.userInputValues.nome}
            `,
          },
          getLocalStorageToken(),
        );
        
        this.$swal({
          type: 'success',
          title: response.result,
          confirmButtonColor: '#F34336',
        });

        this.getUsers();
        
        this.resetModel();
      } catch (err) {
        console.log('Error Register user => ', err.response || err);

        return this.$swal({
          type: 'error',
          title: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    editUser(user) {
      this.userInputValues = { ...user, nivelAcesso: String(user.nivel_acesso) };
      
      this.isEditing = true;
    },
    async updateUser() {
      try {
        const response = await this.$http.update(
          'users',
          getLocalStorageToken(),
          this.userInputValues,
          this.userInputValues.numeroCracha
        );

        this.$http.setActivity(
          'editUser',
          {
            ...this.$store.state.user,
            date: this.$moment().format('DD-MM-YYYY HH-mm'),
            descricao: `
              ${this.$store.state.user.nome} editou o usuário
              ${this.userInputValues.numeroCracha} - ${this.userInputValues.nome}`,
          },
          getLocalStorageToken(),
        );

        this.$swal({
          type: 'success',
          title: response.result,
        });

        const index = this.users.indexOf(
          this.users.find(i => i.numeroCracha === this.userInputValues.numeroCracha)
        );

        this.users.splice(index, 1, this.userInputValues);
        this.closeEditingUser();
      } catch (err) {
        console.log('error updateUser => ', err.response || err);

        return this.$swal({
          type: 'error',
          title: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    deleteUser(user, index) {
      this.$swal({
        type: 'question',
        title: `Deseja mesmo remover o usuário ${user.nome}?`,
        showCancelButton: true,
        confirmButtonColor: '#F34336',
        preConfirm: async () => {
          try {
            const response = await this.$http.delete('users', getLocalStorageToken(), user.numeroCracha);

            this.$http.setActivity(
              'deleteUser',
              {
                ...this.$store.state.user,
                date: this.$moment().format('DD-MM-YYYY HH-mm'),
                descricao: `${this.$store.state.user.nome} removeu o usuário ${user.numeroCracha} - ${user.nome}`,
              },
              getLocalStorageToken(),
            );

            this.$swal({
              type: 'success',
              title: response.result,
              confirmButtonColor: '#F34336',
            });

            this.users.splice(index, 1);
          } catch (err) {
            console.log('error deleteUser => ', err.response || err);

            return this.$swal({
              type: 'error',
              title: getErrors(err),
              confirmButtonColor: '#F34336',
            });
          }
        },
      });
    },
    getAccessLevelOptions() {
      return this.accessLevel.map(i => ({ id: String(i.nivel_acesso), description: i.nivel_acesso_description }));
    },
    closeEditingUser() {
      this.isEditing = false;
      this.resetModel();
    },
    resetModel() {
      this.userInputValues = {};
    },
    goBack() {
      this.$router.push('/dashboard');
    },
  },
};
</script>

<style lang="scss" scoped>
.root-configuracoes-view {
  width: 100%;
  .content-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    .wrapper-configuration {
      width: 50vw;
    }
    @media screen and (max-width: 1366px) {
      .wrapper-configuration {
        width: 90%
      }
    }
    .label-text {
      span {
        font-family: 'roboto';
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
}
</style>
