  
<template>
  <div class="root-configuracoes-view">
    <back-button
      @goBack="goBack"
    />

    <div class="content-wrapper">
      <div class="wrapper-configuration p-3">
        <div class="label-text">
          <span class="text-muted">Usuários</span>
        </div>

        <div class="accordion-container mb-3">
          <accordion title="Gerenciar usuário" icon="fas fa-user-edit">
            <transition name="slide-fade" mode="out-in">
              <div v-if="!isEditing" key="list">
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
              </div>

              <div v-if="isEditing" key="editing">
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
                <div class="m-2 d-flex justify-content-center">
                  <smart-button
                    primary
                    :loading="isLoading"
                    class="mr-2"
                    @click.native="updateUser()"
                  >
                    <span>Alterar</span>
                  </smart-button>

                  <smart-button @click.native="closeEditingUser()">
                    <span>Cancelar</span>
                  </smart-button>
                </div>
              </div>
            </transition>
          </accordion>
        </div>

        <div class="accordion-container mb-3">
          <accordion title="Cadastrar usuário" icon="fas fa-user">
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
            <div class="d-flex justify-content-center">
              <smart-button
                primary
                :loading="isLoading"
                class="m-2"
                @click.native="register()"
              >
                <span>Cadastrar</span>
              </smart-button>
            </div>
          </accordion>
        </div>
      </div>
    </div>

    <div class="easter-egg" @click="openEasterEgg">
      <i class="fa fa-info-circle" />
    </div>
  </div>
</template>

<script>
import { getErrors, getAccessLevelName } from '../../utils/utils';

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
      isLoading: false,
      getAccessLevelName,
    };
  },
  mounted() {
    this.$store.commit('addPageName', 'Configurações');
    this.$store.commit('setMainIcon', 'fa-cogs');

    this.getUsers();
    this.getAccessLevel();
  },

  methods: {
    async getUsers() {
      try {
        const response = await this.$http.get('users');
        
        if (response.length === 0) return;
        
        if (response.length === undefined)
          this.users.push(response);
        else this.users = [...response];
      } catch (err) {
        console.log('error getUser => ', err.response || err);
      }
    },
    async getAccessLevel() {
      try {
        const response = await this.$http.get('nivel-acesso');

        if (response.length === undefined)
          this.accessLevel.push(response);

        else this.accessLevel = [...response];
      } catch (err) {
        console.log('err getAccessLevel :>> ', err.response || err);

        this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    async register() {
      if (this.isLoading) return;

      try {
        this.isLoading = true;
        
        await this.$http.post('users/register', this.userInputValues);

        this.$http.setActivity(this.$activities.REGISTER_USER, JSON.stringify({ registeredUser: this.userInputValues.numeroCracha }));
        
        await this.$swal({
          type: 'success',
          html: 'Usuário registrado com sucesso!',
          confirmButtonColor: '#F34336',
        });

        this.getUsers();
        
        this.resetModel();
      } catch (err) {
        console.log('Error Register user => ', err.response || err);

        return this.$swal({
          type: 'error',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      } finally {
        this.isLoading = false;
      }
    },
    editUser(user) {
      this.userInputValues = { ...user, nivelAcesso: String(user.nivel_acesso) };
      
      this.isEditing = true;
    },
    async updateUser() {
      if (this.isLoading) return;

      try {
        this.isLoading = true;

        await this.$http.update('users', this.userInputValues, this.userInputValues.idUsuario);

        this.$http.setActivity(this.$activities.EDIT_USER, JSON.stringify({ userEdited: this.userInputValues.numeroCracha }));

        await this.$swal({
          type: 'success',
          html: 'Usuário alterado com sucesso!',
        });

        this.getUsers();

        this.closeEditingUser();
      } catch (err) {
        console.log('error updateUser => ', err.response || err);

        return this.$swal({
          type: 'error',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      } finally {
        this.isLoading = false;
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
            await this.$http.delete('users', user.idUsuario);

            this.$http.setActivity(this.$activities.DELETE_USER, JSON.stringify({ userDeleted: user.numeroCracha }));

            await this.$swal({
              type: 'success',
              html: 'Usuário removido com sucesso!',
              confirmButtonColor: '#F34336',
            });

            this.users.splice(index, 1);
          } catch (err) {
            console.log('error deleteUser => ', err.response || err);

            return this.$swal({
              type: 'error',
              html: getErrors(err),
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
    openEasterEgg() {
      this.$swal({
        showConfirmButton: false,
        showCloseButton: true,
        html: `
          <div class="p-4">
            <h3 class="smart mb-5">Este software foi desenvolvimento por: </h3>

            <div class="d-flex flex-column align-items-center" style="text-align:start">
              <div>
                <div class="mb-4">
                  <p class="smart">Douglas Penna Bastos Blank</p>
                  <small class="smart">douglasblank1@gmail.com - (47) 9 8864-8565</small>
                </div>

                <div class="mb-4">
                  <p class="smart">Fernando Marques Candido</p>
                  <small class="smart">fernandocm121@gmail.com - (47) 9 9705-2416</small>
                </div>

                <div class="mb-4">
                  <p class="smart">Gustavo Giese</p>
                  <small class="smart">gustavogiese97@gmail.com - (47) 9 9122-0205</small>
                </div>
                
                <div class="mb-4">
                  <p class="smart">Ronei Roteski</p>
                  <small class="smart">ronei.roteski@gmail.com - (47) 9 8436-7230</small>
                </div>
              </div>
            </div>
          </div>
        `,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.root-configuracoes-view {
  width: 100%;

  .easter-egg {
    position: absolute;
    right: 20px;
    bottom: 20px;
    cursor: pointer;
    i {
      font-size: 30px;
      color: rgb(187, 187, 187);
    }
  }

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
        font-family: 'Nunito';
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
