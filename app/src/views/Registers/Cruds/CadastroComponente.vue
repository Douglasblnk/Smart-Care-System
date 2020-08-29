<template>
  <div class="root-cadastro-component-view">
    <div class="content-wrapper">
      <div>
        <div class="list-option">
          <div class="d-flex justify-content-between">
            <div class="option d-flex align-items-center m-4" @click="switchLabelPage('list')">
              <i class="fas fa-list-alt" />
              <span>Listar</span>
            </div>
            <div class="option d-flex align-items-center m-4" @click="switchLabelPage('register')">
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
                        <th scope="col">Componente</th>
                        <!-- <th scope="col">Máquina</th> -->
                        <th scope="col">Ações</th>
                      </tr>
                    </thead>
                    <tbody class="table-body">
                      <tr v-for="(component, index) in workComponent" :key="`component-${index}`" value="component.label">
                        <td>{{ component.DescricaoComponente }}</td>
                      
                        <!-- <td>{{ workCenter.DescricaoComponente}}</td> -->
                        <td style="width: 50px">
                          <div class="d-flex table-action">
                            <i class="fas fa-edit text-muted" @click="editComponent(component)"></i>
                            <i class="fas fa-trash text-muted" @click="deleteComponents(component, index)"></i>
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
            <form class="formPosition" @submit.prevent="registerEquipment()">
              <div class="cadCard">
                <div class="inputs">
                  <custom-select v-model="selectValue" :options="getWorkEquipmentOptions()"></custom-select>
                </div>
                <div class="sideInput">
                  <div class="inputsSidePosition">
                    <description v-model="inputValues.DescricaoComponente" :label="'Descrição Componente:'" :type="'text'" />
                  </div>
                </div>
              </div>
              <div class="d-flex justify-content-center m-3">
                <smart-button primary class="mr-2">
                  {{ getSaveButtonText() }}
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
import { getToken, getErrors } from '../../../utils/utils';


export default {
  components: {
    
  },
  data() {
    return {
      selectValue: '',
      inputValues: {
        DescricaoComponente: '',
        Equipamento_idEquipamento: 0,

      },
      workEquipment: [],
      workEquipmentEdit: [],
      workComponent: [],
      selectsComponentseEquipament: [],
      switchListRegister: 'list',
      isEditing: false,
      equipamentos: [],
    };
  },
  mounted() {
    this.getEquipments();
    this.getComponentes();
    this.$store.commit('addPageName', 'Cadastro de Componentes');
    this.switchLabelPage('list');
  },
  methods: {
    getSaveButtonText() {
      if (this.isEditing) return 'Alterar';
      return 'Cadastrar';
    },
    switchLabelPage(labelPage) {
      if (labelPage === 'list') {
        this.switchListRegister = 'list';
        this.workEquipment = this.workEquipmentEdit;
        return this.$store.commit('addPageName', 'Cadastro de Componentes | Listagem');
      } else if (labelPage === 'register') {
        this.workEquipment = this.workEquipmentEdit;
        this.switchListRegister = 'register';
        return this.$store.commit('addPageName', 'Cadastro de Componentes | Cadastrar');
      }
      return this.$store.commit('addPageName', 'Cadastro de Componentes | Editar');
    },
    async registerEquipment() {
      if (this.isEditing) return this.updateComponent();
      this.inputValues.Equipamento_idEquipamento = this.selectValue;
      try {
        const response = await this.$http.post('componente', getToken(), this.inputValues);
        this.$swal({
          type: 'success',
          title: 'Cadastrado com sucesso',
          confirmButtonColor: '#F34336',
        }),
        this.DescricaoComponente = '';
        this.getComponentes();
      } catch (err) {
        return this.$swal({
          type: 'warning',
          title: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },

    async getEquipments() {
      try {
        const response = await this.$http.get('equipamento/get', getToken());
        if (response.result.length === undefined)
          this.workEquipment.push(response.result);
        else this.workEquipment = [...response.result];
      } catch (err) {
        return this.$swal({
          type: 'warning',
          title: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },

    async getComponentes() {
      try {
        const response = await this.$http.get('componente/get', getToken());
        if (response.result.length === undefined)
          this.workComponent.push(response.result);
        else this.workComponent = [...response.result];
      } catch (err) {
        return this.$swal({
          type: 'warning',
          title: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },

    resetModel() {
      this.inputValues = {};
    },
  
    async deleteComponents(component, index) {
      try {
        this.$swal({
          type: 'question',
          title: `Deseja mesmo remover o Componente ${component.DescricaoComponente}`,
          showCancelButton: true,
          confirmButtonColor: '#F34336',
          preConfirm: async () => {
            const response = await this.$http.delete('componente', getToken(), component.idComponente);
            return this.$swal({
              type: 'success',
              title: 'Removido com Sucesso',
              text: response.detailErr || '',
              confirmButtonColor: '#F34336',
            });
          },
        });
      } catch (err) {
        return this.$swal({
          type: 'warning',
          title: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    editComponent(component) {
      this.switchLabelPage('edit');
      this.inputValues = { ...component };
      this.switchListRegister = 'register';
      this.isEditing = true;

      this.workEquipmentEdit = this.workEquipment;

      const equipamentName = this.workEquipment.find(equipament => equipament.idEquipamento === component.Equipamento_idEquipamento);

      if (equipamentName !== undefined) {
        this.workEquipment = [];
        this.workEquipment.push(equipamentName);
        this.getWorkEquipmentOptions();
      } else { return this.workEquipment= this.workEquipment; }
    },
  
    closeEditing() {
      this.switchLabelPage('list');
      this.switchListRegister = 'list';
      this.isEditing = false;
      this.workEquipment = this.workEquipmentEdit;
      this.resetModel();
    },
    async updateComponent() {
      try {
        const response = await this.$http.update('componente', getToken(), this.inputValues, this.inputValues.idComponente);
        this.$swal({
          type: 'success',
          title: 'Alterado com Sucesso',
          confirmButtonColor: '#F34336',
        });
        const index = this.workComponent.indexOf(this.workComponent.find(i => i.idComponente === this.inputValues.idComponente));
        this.workComponent.splice(index, 1, this.inputValues);
        this.workEquipment = this.workEquipmentEdit;
        this.closeEditing();
      } catch (err) {
        return this.$swal({
          type: 'warning',
          title: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    getWorkEquipmentOptions() {
      return this.workEquipment.map(i => ({ id: String(i.idEquipamento), description: i.equipamento }));
    },
  },
};
</script>

<style lang="scss" scoped>
.root-cadastro-component-view {
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
