<template>
  <div class="root-epi-view">
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
      <div>
        <div class="list-option">
          <div class="d-flex justify-content-between">
            <div class="option d-flex align-items-center m-4" @click="() => switchListRegister = 'list'">
              <i class="fas fa-list-alt" />
              <span>Listar</span>
            </div>
            <div class="option d-flex align-items-center m-4" @click="() => switchListRegister = 'register'">
              <i class="fas fa-edit" />
              <span>Cadastrar</span>
            </div>
          </div>
        </div>

        <transition name="slide-fade" mode="out-in">
          <template v-if="switchListRegister === 'list'">
            <div class="list-option">
              <div class="table-content bg-white p-4 w-100">
                <div class="table-responsive">
                  <table class="table table table-striped table-borderless table-hover" cellspacing="0">
                    <thead class="table-head">
                      <tr>
                        <th scope="col">Epi</th>
                        <th scope="col">Ações</th>
                      </tr>
                    </thead>
                    <tbody class="table-body">
                      <tr v-for="(epi, index) in Epis" :key="`epi-${index}`">
                        <td>{{ epi.descricaoEpi }}</td>
                        <td style="width: 50px">
                          <div class="d-flex table-action">
                            <i class="fas fa-edit text-muted" @click="editEpi(epi)"></i>
                            <i class="fas fa-trash text-muted" @click="deleteEpi(epi, index)"></i>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </template>

          <template v-if="switchListRegister === 'register'">
            <form @submit.prevent="registerEpi()">
              <div class="cadCard">
                <simple-input v-model="inputValues.descricaoEpi" :label="'Epi:'" :type="'text'" />
              </div>

              <div class="d-flex justify-content-center m-3">
                  <smart-button primary class="mr-2">
                    {{getSaveButtonText()}}
                  </smart-button>
                <smart-button v-if="isEditing" @click.native="closeEditing">
                  <span>Cancelar</span>
                </smart-button>
              </div>
            </form>
          </template>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
import { getLocalStorageToken, getErrors } from '../../../utils/utils';

export default {
  name: 'CadastroEpi',

  data() {
    return {
      inputValues: {
        descricaoEpi: '',
      },
      switchListRegister: 'list',
      isEditing: false,
      Epis: [],
    };
  },
  mounted() {
    this.getEpi();
    this.$store.commit('addPageName', 'Cadastro de EPI');
    this.switchLabelPage('list');
  },

  methods: {
    getSaveButtonText() {
      if (this.isEditing) return 'Alterar';
      return 'Cadastro';
    },
    switchLabelPage(labelPage) {
      if (labelPage === 'list') {
        this.switchListRegister = 'list';
        return this.$store.commit('addPageName', 'Cadastro de EPI | Listagem');
      } else if (labelPage === 'register') {
        this.switchListRegister = 'register';
        return this.$store.commit('addPageName', 'Cadastro de EPI | Cadastrar');
      }
      return this.$store.commit('addPageName', 'Cadastro de EPI | Editar');
    },
    async getEpi() {
      try {
        const response = await this.$http.get('epi/get', getLocalStorageToken());

        if (response.result.length === undefined)
          this.Epis.push(response.result);
        else this.Epis = [...response.result];
      } catch (err) {
        console.log('err getEpi :>> ', err.response || err);

        return this.$swal({
          type: 'warning',
          title: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    async registerEpi() {
      try {
        if (this.isEditing) return this.updateEpi();

        const response = await this.$http.post('epi', getLocalStorageToken(), this.inputValues);

        this.$swal({
          type: 'success',
          title: response.result,
          confirmButtonColor: '#F34336',
        }),

        this.Epis.push(this.inputValues);

        this.resetModel();
        this.getEpi();
      } catch (err) {
        console.log('err registerEpi :>> ', err.response || err);

        return this.$swal({
          type: 'warning',
          title: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    async updateEpi() {
      try {
        const response = await this.$http.update('epi', getLocalStorageToken(), this.inputValues, this.inputValues.idEpi);

        this.$swal({
          type: 'success',
          title: response.result,
          confirmButtonColor: '#F34336',
        });

        const index = this.Epis.indexOf(this.Epis.find(i => i.idEpi === this.inputValues.idEpi));

        this.Epis.splice(index, 1, this.inputValues);
        this.closeEditing();
      } catch (err) {
        console.log('err updateEpi :>> ', err.response || err);

        return this.$swal({
          type: 'warning',
          title: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    deleteEpi(epi, index) {
      try {
        this.$swal({
          type: 'question',
          title: `Deseja mesmo remover o Epi ${epi.descricaoEpi}`,
          showCancelButton: true,
          confirmButtonColor: '#F34336',
          preConfirm: async () => {
            const response = await this.$http.delete('epi', getLocalStorageToken(), epi.idEpi);

            this.$swal({
              type: 'success',
              title: `${response.result}`,
              confirmButtonColor: '#F34336',
            }),

            this.Epis.splice(index, 1);
          },
        });
      } catch (err) {
        console.log('err deleteEpi :>> ', err.response || err);

        return this.$swal({
          type: 'warning',
          title: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    editEpi(epi) {
      this.switchLabelPage('edit');
      this.inputValues = { ...epi };
      this.switchListRegister = 'register';
      this.isEditing = true;
    },
    closeEditing() {
      this.switchLabelPage('list');
      this.switchListRegister = 'list';
      this.isEditing = false;
      this.resetModel();
    },
    resetModel() {
      this.inputValues = {};
    },
    goBack() {
      this.$router.push('/cadastros');
    },
  },
};
</script>
<style lang="scss" scoped>
.root-epi-view {
  width: 100%;
  .content-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .list-option {
      width: 50vw;
      display: flex;
      justify-content: flex-start;
      .option {
        cursor: pointer;
        color: var(--duas-rodas-soft);
        transition: .2s;
        &:hover {
          transform: scale(1.2)
        }
        &:active {
          transform: scale(1)
        }
        i {
          
          cursor: pointer;
          font-size: 1.4rem;
          margin: 0 5px;
        }
      }
    }
    .cadCard {
      padding: 20px;
      border-radius: 10px;
      background-color: #ffffff;
    }
  }
  .table-content {
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
}
</style>
