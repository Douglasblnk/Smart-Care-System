<template>
    <div class="equipment-wrapper">
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
                      <th scope="col">Local de instalação</th>
                      <th scope="col">Equipamento</th>
                      <th scope="col">Descrição</th>
                      <th scope="col">Ações</th>
                    </tr>
                  </thead>
                  <tbody class="table-body">
                    <tr v-for="(equipment, index) in equipments" :key="`equipment-${index}`">
                      <td>{{ equipment.Setor_idSetor }}</td>
                      <td>{{ equipment.equipamento }}</td>
                      <td>{{ equipment.descricao }}</td>
                      <td style="width: 50px">
                        <div class="d-flex table-action">
                          <i class="fas fa-edit text-muted" @click="editEquipment(equipment)"></i>
                          <i class="fas fa-trash text-muted" @click="deleteEquipment(equipment, index)"></i>
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
          <form @submit.prevent="registerEquipment()" class="formPosition">
            <div class="cadCard">
              <div class="input-card w-100 d-flex">
                <simple-input v-model="inputValues.Setor_idSetor" label="Local Instalação:" type="number" />
                <simple-input v-model="inputValues.equipamento" label="Equipamento:" type="text" />
                <simple-input v-model="inputValues.equipamentoSuperior" label="Equipamento Superior:" type="text" />
              </div>
              <div class="w-100">
                <description
                  v-model="inputValues.descricao"
                  cols="30"
                  rows="3"
                  label="Descrição:"
                />
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
import { getLocalStorageToken } from '../../utils/utils';
import simpleInput from "../../components/inputs/simple-input";
import description from "../../components/inputs/description";
import saveButton from '../../components/button/save-button';
import cancelButton from '../../components/button/cancel-button';

export default {
  components: {
    'simple-input': simpleInput,
    'save-button': saveButton,
    'cancel-button': cancelButton,
    description: description,
  },
  data() {
    return {
      inputValues: {
        Setor_idSetor: null,
        equipamento: "",
        equipamentoSuperior: "",
        descricao: ""
      },
      equipments: [],
      switchListRegister: 'list',
      isEditing: false,
    };
  },

  mounted() {
    this.getEquipment();
  },

  methods: {
    getSaveButtonText() {
      if (this.isEditing) return 'Alterar';
      else return 'Cadastrar'
    },

    editEquipment(equipment) {
      console.log(equipment);
      this.inputValues = { ...equipment }
      console.log(typeof this.inputValues.Setor_idSetor);
      this.switchListRegister = 'register'
      this.isEditing = true;
    },

    closeEditing() {
      this.switchListRegister = 'list'
      this.isEditing = false;
      this.resetModel();
    },

    getEquipment() {
      this.$http.methodGet('equipamento/get', getLocalStorageToken())
        .then(res => {
          if (res.result.length === 0) this.$swal({
            type: 'warning',
            title: 'Não foi encontrado nenhum equipamento cadastrado!',
            confirmButtonColor: '#F34336',
          })
          if (res.result.length === undefined) 
            this.equipments.push(res.result)
          else this.equipments = [ ...res.result ]
          console.log('im the equipment', this.equipments);
        })
    },

    registerEquipment(){
      if (this.isEditing) return this.updateEquipment();
      this.$http.methodPost('equipamento', getLocalStorageToken(), this.inputValues)
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
            console.log(this.inputValues);
            this.equipments.push(this.inputValues);
            console.log(this.equipments);
            this.resetModel();
          })
        })
    },

    deleteEquipment(equipment, index) {
      console.log(equipment);
      this.$swal({
        type: 'question',
        title: `Deseja mesmo remover o equipamento ${equipment.descricao}?`,
        showCancelButton: true,
        confirmButtonColor: '#F34336',
        preConfirm: () => {
          this.$http.methodDelete('equipamento', getLocalStorageToken(), equipment.idEquipamento)
            .then(res => {
              console.log(res);
              if (res.status !== 200) return this.$swal({
                type: 'warning',
                title: res.err,
                confirmButtonColor: '#F34336',
              })
              this.$swal({
                type: 'success',
                title: res.result,
                confirmButtonColor: '#F34336',
              }).then(() => {
                this.equipments.splice(index, 1)
                console.log(this.equipments);
              });
            });
        },
      });
    },

    updateEquipment() {
      console.log(this.inputValues.idEquipamento);
      this.$http.methodUpdate('equipamento', getLocalStorageToken(), this.inputValues, this.inputValues.idEquipamento)
        .then(res => {
          if (res.status !== 200) return this.$swal({
            type: 'error',
            title: 'Ops! Ocorreu um erro com a solicitação.',
            text: res.err,
            confirmButtonColor: '#F34336',
          })
          this.$swal({
            type: 'success',
            title: res.result,
            confirmButtonColor: '#F34336',
          }).then(() => {
            const index = this.equipments.indexOf(this.equipments.find(i => i.idEquipamento === this.inputValues.idEquipamento))
            this.equipments.splice(index, 1, this.inputValues)
            this.closeEditing()
          })
        })
    },

    resetModel() {
      this.inputValues = {}
    },
  },
};
</script>

<style lang="scss" scoped>
.equipment-wrapper {
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
      flex-wrap: wrap;
      border-radius: 10px;
      background-color: #ffffff;
      @media screen and (max-width: 1100px) {
        .input-card {
          flex-wrap: wrap
        }
      }
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