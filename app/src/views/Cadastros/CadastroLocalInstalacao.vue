<template>
  <div class="root-local-instalacao-view">
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
            <div class="option d-flex align-items-center m-4" @click="switchListRegister = 'list'">
              <i class="fas fa-list-alt" />
              <span>Listar</span>
            </div>
            <div class="option d-flex align-items-center m-4" @click="switchListRegister = 'register'">
              <i class="fas fa-edit" />
              <span>Cadastrar</span>
            </div>
          </div>
        </div>

        <transition name="slide-fade" mode="out-in">
          <template v-if="switchListRegister === 'list'">
            <div class="table-content list-option bg-white p-4">
              <table class="table table table-striped table-borderless table-hover" cellspacing="0">
                <thead class="table-head">
                  <tr>
                    <th scope="col">Setor</th>
                    <th scope="col">Ações</th>
                  </tr>
                </thead>
                <tbody class="table-body">
                  <tr v-for="(sector, index) in instalationLocal" :key="`sector-${index}`">
                    <td>{{ sector.nome }}</td>
                    <td style="width: 50px">
                      <div class="d-flex table-action">
                        <i class="fas fa-edit text-muted" @click="editSector(sector)"></i>
                        <i class="fas fa-trash text-muted" @click="deleteSector(sector, index)"></i>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>

          <template v-if="switchListRegister === 'register'">
            <form @submit.prevent="registerSector()">
              <div class="cadCard">
                <div class="inputs">
                  <simple-input v-model="inputValues.nome" :label="'Local Instalação:'" :type="'text'" />
                </div>
              </div>
              <div class="d-flex justify-content-center m-3">
                <save-button :label="getSaveButtonText()" />
                <cancel-button v-if="isEditing" label="Cancelar" @click.native="closeEditing" />
              </div>
            </form>
          </template>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { getLocalStorageToken, getErrors } from '../../utils/utils';
import saveButton from '../../components/button/save-button';
import cancelButton from '../../components/button/cancel-button';
import simpleInput from '../../components/inputs/simple-input';

export default {
  components: {
    'simple-input': simpleInput,
    'save-button': saveButton,
    'cancel-button': cancelButton,
  },
  data() {
    return {
      inputValues: {
        idSetor: '',
        nome: '',
      },
      switchListRegister: 'list',
      isEditing: false,
      instalationLocal: [],
    };
  },

  mounted() {
    this.getSector();
  },

  methods: {
    getSaveButtonText() {
      if (this.isEditing) return 'Alterar';
      return 'Cadastrar';
    },
    editSector(sector) {
      this.inputValues = { ...sector };
      this.switchListRegister = 'register';
      this.isEditing = true;
    },
    async getSector() {
      try {
        const response = await this.$http.get('local-instalacao/get', getLocalStorageToken());

        if (response.result.length === undefined)
          this.instalationLocal.push(response.result);
          
        else this.instalationLocal = [...response.result];
      } catch (err) {
        console.log('err getSector => :', err.response || err);

        return this.$swal({
          type: 'warning',
          text: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    async registerSector() {
      if (this.isEditing) return this.updateSector();

      try {
        const response = await this.$http.post('local-instalacao', getLocalStorageToken(), this.inputValues);

        this.$swal({
          type: 'success',
          title: response.result,
          confirmButtonColor: '#F34336',
        }).then(() => {
          this.instalationLocal.push(this.inputValues);

          this.resetModel();
          this.getSector();
        });
      } catch (err) {
        console.log('err registerSector => :', err.response || err);

        return this.$swal({
          type: 'warning',
          text: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    async updateSector() {
      try {
        console.log('INPUT VALUES: ',this.inputValues);
        const response = await this.$http.update(
          'local-instalacao', getLocalStorageToken(), this.inputValues, this.inputValues.idSetor,
        );

        this.$swal({
          type: 'success',
          title: response.result,
          confirmButtonColor: '#F34336',
        }).then(() => {
          const index = this.instalationLocal.indexOf(
            this.instalationLocal.find(i => i.idSetor === this.inputValues.idSetor)
          );

          this.instalationLocal.splice(index, 1, this.inputValues);

          this.closeEditing();
        });
      } catch (err) {
        console.log('err updateSector => :', err.response || err);

        return this.$swal({
          type: 'error',
          text: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    deleteSector(sector, index) {
      this.$swal({
        type: 'question',
        title: `Deseja mesmo remover o setor de ${sector.nome}?`,
        showCancelButton: true,
        confirmButtonColor: '#F34336',
        preConfirm: async () => {
          try {
            const response = await this.$http.delete('local-instalacao', getLocalStorageToken(), sector.idSetor);

            return this.$swal({
              type: 'success',
              title: response.result,
              confirmButtonColor: '#F34336',
            }).then(() => {
              this.instalationLocal.splice(index, 1);
            });
          } catch (err) {
            console.log('err deleteSector => :', err.response || err);

            return this.$swal({
              type: 'error',
              text: getErrors(err),
              confirmButtonColor: '#F34336',
            });
          }
        },
      });
    },
    closeEditing() {
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
.root-local-instalacao-view {
  width: 100%;
  .content-wrapper {
    display: flex;
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
      display: flex;
      flex-direction: column;
      border-radius: 10px;
      background-color: #ffffff;
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
