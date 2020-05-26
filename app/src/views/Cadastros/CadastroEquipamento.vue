<template>
  <div class="equipment-wrapper">
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
          </template>

          <template v-if="switchListRegister === 'register'">
            <form @submit.prevent="registerEquipment()">
              <div class="cadCard">
                <div class="input-card">
                  <custom-select
                    v-model="inputValues.Setor_idSetor"
                    label="Setor"
                    :options="getSectorOptions()"
                  />
                  <simple-input v-model="inputValues.equipamento" label="Equipamento:" type="text" />
                  <simple-input v-model="inputValues.equipamentoSuperior" label="Equipamento Superior:" type="text" />
                </div>
                <div class="input-card">
                  <description
                    v-model="inputValues.descricao"
                    cols="30"
                    rows="3"
                    label="Descrição: "
                  />
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

export default {
  name: 'CadastroEquipamento',

  data() {
    return {
      inputValues: {
        Setor_idSetor: '',
        equipamento: '',
        equipamentoSuperior: '',
        descricao: '',
      },
      equipments: [],
      selectsSector: [],
      switchListRegister: 'list',
      isEditing: false,
    };
  },

  mounted() {
    this.getEquipment();
    this.getSector();
  },

  methods: {
    getSaveButtonText() {
      if (this.isEditing) return 'Alterar';
      return 'Cadastrar';
    },

    editEquipment(equipment) {
      this.inputValues = { ...equipment };
      
      this.switchListRegister = 'register';
      this.isEditing = true;
    },

    closeEditing() {
      this.switchListRegister = 'list';
      this.isEditing = false;
      this.resetModel();
    },

    getEquipment() {
      this.$http.get('equipamento/get', getLocalStorageToken())
        .then(res => {
          if (res.result.length === 0) {
            this.$swal({
              type: 'warning',
              title: 'Não foi encontrado nenhum equipamento cadastrado!',
              confirmButtonColor: '#F34336',
            });
          }

          if (res.result.length === undefined)
            this.equipments.push(res.result);
          else this.equipments = [...res.result];
        });
    },
    async getSector() {
      try {
        const response = await this.$http.get('local-instalacao/get', getLocalStorageToken());

        if (response.result.length === undefined)
          this.selectsSector.push(response.result);

        else this.selectsSector = [...response.result];

      } catch (err) {
        return this.$swal({
          type: 'warning',
          title: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    registerEquipment() {
      if (this.isEditing) return this.updateEquipment();
      this.$http.post('equipamento', getLocalStorageToken(), this.inputValues)
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
            this.equipments.push(this.inputValues);

            this.resetModel();
            this.getEquipment();
          });
        });
    },

    deleteEquipment(equipment, index) {
      this.$swal({
        type: 'question',
        title: `Deseja mesmo remover o equipamento ${equipment.descricao}?`,
        showCancelButton: true,
        confirmButtonColor: '#F34336',
        preConfirm: () => {
          this.$http.delete('equipamento', getLocalStorageToken(), equipment.idEquipamento)
            .then(res => {
              if (res.status !== 200) {
                return this.$swal({
                  type: 'warning',
                  title: res.err,
                  confirmButtonColor: '#F34336',
                });
              }

              this.$swal({
                type: 'success',
                title: res.result,
                confirmButtonColor: '#F34336',
              }).then(() => {
                this.equipments.splice(index, 1);
              });
            });
        },
      });
    },

    updateEquipment() {
      this.$http.update('equipamento', getLocalStorageToken(), this.inputValues, this.inputValues.idEquipamento)
        .then(res => {
          if (res.status !== 200) {
            return this.$swal({
              type: 'error',
              title: 'Ops! Ocorreu um erro com a solicitação.',
              text: res.err,
              confirmButtonColor: '#F34336',
            });
          }
          this.$swal({
            type: 'success',
            title: res.result,
            confirmButtonColor: '#F34336',
          }).then(() => {
            const index = this.equipments.indexOf(
              this.equipments.find(
                i => i.idEquipamento === this.inputValues.idEquipamento
              )
            );
            
            this.equipments.splice(index, 1, this.inputValues);
            this.closeEditing();
          });
        });
    },

    resetModel() {
      this.inputValues = {};
    },
    goBack() {
      this.$router.push('/cadastros');
    },
    getSectorOptions() {
      return this.selectsSector.map(i => ({ id: String(i.idSetor), description: i.nome }));
    },
  },
};
</script>

<style lang="scss" scoped>
.equipment-wrapper {
  width: 100%;
  .content-wrapper{
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
      border-radius: 10px;
      background-color: #ffffff;
      .input-card {
        display: flex;
        flex-wrap: wrap;
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
