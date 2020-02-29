<template>
  <div class="root-centro-trabalho-view">
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
        <div class="d-flex w-100 justify-content-center">
          <div class="table-content bg-white p-4 w-100">
            <div class="table-responsive">
              <table class="table table table-striped table-borderless table-hover" cellspacing="0">
                <thead class="table-head">
                  <tr>
                    <th scope="col">Centro de trabalho</th>
                    <th scope="col">Ações</th>
                  </tr>
                </thead>
                <tbody class="table-body">
                  <tr v-for="(workCenter, index) in workCenters" :key="`workCenter-${index}`">
                    <td>{{ workCenter.descricao_centro_trabalho}}</td>
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
          </div>
        </div>
      </template>

      <template v-if="switchListRegister === 'register'">
        <form @submit.prevent="registerWorkCenter()" class="formPosition">
          <div class="cadCard">
            <div class="inputs">
              <simple-input v-model="inputValues.descricao_centro_trabalho" :label="'Centro de Trabalho:'" :type="'text'" />
            </div>
          </div>
          <div class="d-flex justify-content-center m-3">
            <save-button :label="getSaveButtonText()" />
            <cancel-button v-if="isEditing" @click.native="closeEditing" label="Cancelar" />
          </div>
        </form>
      </template>
    </transition>
  </div>
</template>

<script>
import { getLocalStorageToken } from '../../utils/utils'
import simpleInput from '../../components/inputs/simple-input';
import saveButton from '../../components/button/save-button';
import cancelButton from '../../components/button/cancel-button';

export default {
  components: {
    "simple-input": simpleInput,
    "save-button": saveButton,
    "cancel-button": cancelButton,
  },
  data() {
    return {
      inputValues: {
        descricao_centro_trabalho: '',
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
      else return 'Cadastrar'
    },

    getWorkCenter() {
      this.$http.methodGet('centro-trabalho/get', getLocalStorageToken())
        .then(res => {
          if (res.result.length === 0) this.$swal({
            type: 'warning',
            title: 'Não foi encontrado nenhum centro de trabalho!',
            confirmButtonColor: '#F34336',
          })
          console.log('centro work', res);
          if (res.result.length === undefined) 
          this.workCenters.push(res.result)
          else this.workCenters = [ ...res.result ]
          console.log('im the centro de trabalho', this.workCenters);
        })
    },

    registerWorkCenter() {
      if (this.isEditing) return this.updateWorkCenter();
      this.$http.methodPost('centro-trabalho', getLocalStorageToken(), this.inputValues)
        .then(res => {
          if (res.status !== 200) return this.$swal({
            type: 'error',
            title: `Ops! ${res.err}`,
            confirmButtonColor: '#F34336',
          })
          this.$swal({
            type: 'success',
            title: `${res.result}`,
            confirmButtonColor: '#F34336',
          }).then(() => {
            this.workCenters.push(this.inputValues);
            console.log(this.instalationLocal);
            this.resetModel();
          })
        })
    },

    deleteWorkCenter(workCenter, index) {
      this.$swal({
        type: 'question',
        title: `Deseja mesmo remover o centro de trabalho ${workCenter.descricao_centro_trabalho}?`,
        showCancelButton: true,
        confirmButtonColor: '#F34336',
        preConfirm: () => {
          this.$http.methodDelete('centro-trabalho', getLocalStorageToken(), workCenter.idCentro_Trabalho)
            .then(res => {
              if (res.status !== 200) return this.$swal({
                type: 'error',
                title: `Ops! ${res.err}`,
                text: res.detailErr || '',
                confirmButtonColor: '#F34336',
              })
              this.$swal({
                type: 'success',
                title: `${res.result}`,
                confirmButtonColor: '#F34336',
              }).then(() => {
                this.workCenters.splice(index, 1)
              })
            })
        }
      });
    },

    editWorkCenter(workCenter) {
      console.log(workCenter);
      this.inputValues = { ...workCenter }
      console.log(this.inputValues);
      this.switchListRegister = 'register'
      this.isEditing = true;
    },

    updateWorkCenter(sector) {
      this.$http.methodUpdate('centro-trabalho', getLocalStorageToken(), this.inputValues, this.inputValues.idCentro_Trabalho )
        .then(res => {
          if (res.status !== 200) return this.$swal({
            type: 'error',
            title: `Ops! ${res.err}`,
            confirmButtonColor: '#F34336',
          })
          this.$swal({
            type: 'success',
            title: `${res.result}`,
            confirmButtonColor: '#F34336',
          }).then(() => {
            const index = this.workCenters.indexOf(this.workCenters.find(i => i.idCentro_Trabalho === this.inputValues.idCentro_Trabalho))
            this.workCenters.splice(index, 1, this.inputValues)
            this.closeEditing()
          })
        })
    },

    closeEditing() {
      this.switchListRegister = 'list'
      this.isEditing = false;
      this.resetModel();
    },

    resetModel() {
      this.inputValues = {}
    },
  },
};
</script>

<style lang="scss" scoped>
.root-centro-trabalho-view {
  width: 70%;
  .list-option {
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
  .formPosition{
    display: flex;
    flex-direction: column;
    align-items: center;
    .cadCard {
      width: 80%;
      padding: 20px;
      display: flex;
      flex-direction: column;
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