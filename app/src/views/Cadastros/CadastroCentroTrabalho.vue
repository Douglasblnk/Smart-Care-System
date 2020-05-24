<template>
  <div class="root-centro-trabalho-view">
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
            <div class="table-content bg-white p-4">
              <table class="table table table-striped table-borderless table-hover" cellspacing="0">
                <thead class="table-head">
                  <tr>
                    <th scope="col">Centro de trabalho</th>
                    <th scope="col">Ações</th>
                  </tr>
                </thead>
                <tbody class="table-body">
                  <tr v-for="(workCenter, index) in workCenters" :key="`workCenter-${index}`">
                    <td>{{ workCenter.descricao }}</td>
                    <td style="width: 50px">
                      <div class="d-flex table-action">
                        <i class="fas fa-edit text-muted" @click="editWorkCenter(workCenter)"></i>
                        <i class="fas fa-trash text-muted" @click="deleteWorkCenter(workCenter, index)"></i>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>

          <template v-if="switchListRegister === 'register'">
            <form @submit.prevent="registerWorkCenter()">
              <div class="cadCard">
                <div class="inputs">
                  <simple-input v-model="inputValues.descricao" :label="'Centro de Trabalho:'" :type="'text'" />
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
import { getLocalStorageToken } from '../../utils/utils';

export default {
  name: 'CadastroCentroTrabalho',

  data() {
    return {
      inputValues: {
        descricao: '',
      },
      switchListRegister: 'list',
      isEditing: false,
      workCenters: [],
    };
  },

  mounted() {
    this.getWorkCenter();
  },

  methods: {
    getSaveButtonText() {
      if (this.isEditing) return 'Alterar';
      return 'Cadastrar';
    },

    getWorkCenter() {
      this.$http.get('centro-trabalho/get', getLocalStorageToken())
        .then(res => {
          if (res.result.length === 0) {
            this.$swal({
              type: 'warning',
              title: 'Não foi encontrado nenhum centro de trabalho!',
              confirmButtonColor: '#F34336',
            });
          }

          if (res.result.length === undefined)
            this.workCenters.push(res.result);
          else this.workCenters = [...res.result];
        });
    },

    registerWorkCenter() {
      if (this.isEditing) return this.updateWorkCenter();
      this.$http.post('centro-trabalho', getLocalStorageToken(), this.inputValues)
        .then(res => {
          if (res.status !== 200) {
            return this.$swal({
              type: 'error',
              title: `Ops! ${res.err}`,
              confirmButtonColor: '#F34336',
            });
          }
          this.$swal({
            type: 'success',
            title: `${res.result}`,
            confirmButtonColor: '#F34336',
          }).then(() => {
            this.workCenters.push(this.inputValues);

            this.resetModel();
            this.getWorkCenter();
          });
        });
    },

    deleteWorkCenter(workCenter, index) {
      this.$swal({
        type: 'question',
        title: `Deseja mesmo remover o centro de trabalho ${workCenter.descricao}?`,
        showCancelButton: true,
        confirmButtonColor: '#F34336',
        preConfirm: () => {
          this.$http.delete('centro-trabalho', getLocalStorageToken(), workCenter.id_centro_trabalho)
            .then(res => {
              if (res.status !== 200) {
                return this.$swal({
                  type: 'error',
                  title: `Ops! ${res.err}`,
                  text: res.detailErr || '',
                  confirmButtonColor: '#F34336',
                });
              }
              this.$swal({
                type: 'success',
                title: `${res.result}`,
                confirmButtonColor: '#F34336',
              }).then(() => {
                this.workCenters.splice(index, 1);
              });
            });
        },
      });
    },

    editWorkCenter(workCenter) {
      this.inputValues = { ...workCenter };
      
      this.switchListRegister = 'register';
      this.isEditing = true;
    },

    updateWorkCenter() {
      this.$http.update('centro-trabalho', getLocalStorageToken(), this.inputValues, this.inputValues.idCentro_Trabalho )
        .then(res => {
          if (res.status !== 200) {
            return this.$swal({
              type: 'error',
              title: `Ops! ${res.err}`,
              confirmButtonColor: '#F34336',
            });
          }
          this.$swal({
            type: 'success',
            title: `${res.result}`,
            confirmButtonColor: '#F34336',
          }).then(() => {
            const index = this.workCenters.indexOf(
              this.workCenters.find(
                i => i.idCentro_Trabalho === this.inputValues.id_centro_trabalho
              )
            );
            
            this.workCenters.splice(index, 1, this.inputValues);
            this.closeEditing();
          });
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
.root-centro-trabalho-view {
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
      width: 50vw;
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
