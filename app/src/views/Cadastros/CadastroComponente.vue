<template>
  <div class="root-centro-trabalho-view">
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
                  <tr v-for="(component, index) in workComponent" value="component.label" :key="`component-${index}`">
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
        <form @submit.prevent="registerEquipment()" class="formPosition">
          <div class="cadCard">
            <div class="inputs">
              <custom-select v-model="selectValue" :options="getWorkEquipmentOptions()"></custom-select>
              <!--<tranfer-select v-model="inputValues.Equipamento_idEquipamento" :selects="selectsEquipament" :label="'Máquina'" ></tranfer-select>     
              -->
            </div>
            <div class="sideInput">
              <div class="inputsSidePosition">
                <description v-model="inputValues.DescricaoComponente" :label="'Descrição Componente:'" :type="'text'" />
              </div>  
            </div>
          </div>
          <!-- <div class="d-flex justify-content-center m-3">
            <b-button type="submit" value="send" variant="danger">Cadastrar</b-button>
          </div> -->
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
import { getLocalStorageToken, getErrors } from '../../utils/utils'
import simpleInput from "../../components/inputs/simple-input";
import select from '../../components/inputs/custom-select'
import description from "../../components/inputs/description";
import selectId from "../../components/inputs/tranfer-select";
import saveButton from '../../components/button/save-button';
import cancelButton from '../../components/button/cancel-button';

export default {
  components: {
    "simple-input": simpleInput,
    'custom-select': select,
    "tranfer-select": selectId,
    description: description,
    "save-button": saveButton,
    "cancel-button": cancelButton,
    
  },
  // computed: {
  //   if(selectsComponents && selectsEquipament){

  //   }
  //   // this.mesclaListas();
  // },
  data() {
    return {
      selectValue: '',
      inputValues: {
        DescricaoComponente: "",
        Equipamento_idEquipamento: 0,
        // equipamento_name:"",

      },
      workEquipment: [],
      workEquipmentEdit: [],
      workComponent: [],
      selectsComponentseEquipament: [],
      switchListRegister: 'list',
      isEditing: false,
      equipamentos:[],
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
      else return 'Cadastrar';
    },
    switchLabelPage(labelPage) {
      if (labelPage === 'list') {
        this.switchListRegister = 'list';
        this.workEquipment = this.workEquipmentEdit;
        return this.$store.commit('addPageName', `Cadastro de Componentes | Listagem`);
      } else if (labelPage === 'register') {
        this.workEquipment = this.workEquipmentEdit;
        this.switchListRegister = 'register';
        return this.$store.commit('addPageName', `Cadastro de Componentes | Cadastrar`);
      } else {
        return this.$store.commit('addPageName', `Cadastro de Componentes | Editar`);
      }
    },
    async registerEquipment() {
     if (this.isEditing) return this.updateComponent();
      this.inputValues.Equipamento_idEquipamento = this.selectValue;
       try {
         const response = await this.$http.post('componente', getLocalStorageToken(), this.inputValues);
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
        const response = await this.$http.get('equipamento/get', getLocalStorageToken());
        if(response.result.length === undefined)
          this.workEquipment.push(response.result);
          else this.workEquipment = [ ...response.result ];
      } catch (err) {
        return this.$swal({
                type: 'warning',
                title: getErrors(err),
                confirmButtonColor: '#F34336',
            }); 
      }
    },

    async getComponentes() {
      console.log('2B');
      try {
        const response = await this.$http.get('componente/get', getLocalStorageToken());
        if(response.result.length === undefined)
          this.workComponent.push(response.result);
          else this.workComponent = [ ...response.result ];
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
      preConfirm: async() => {
        const response = await this.$http.delete('componente', getLocalStorageToken(), component.idComponente);
        return this.$swal({
            type: 'success',
            title: 'Removido com Sucesso',
            text: response.detailErr || '',
            confirmButtonColor: '#F34336',
          });
      }
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
     console.log(component);
    console.log('a-------------------------------------a---------------------------------a');
    console.log(this.workEquipment);

    this.workEquipmentEdit = this.workEquipment;
    // console.log(this.workEquipmentEdit);
    const equipamentName =  this.workEquipment.find(equipament => equipament.idEquipamento === component.Equipamento_idEquipamento);
    // // console.log(equipamentName);
     console.log('--------------------------------------');
    console.log(equipamentName)
    this.workEquipment = [];
    // //  so q com isso terei q fazer outra requisiçao ou salvar em outra variavel o objeto das maquinas
    this.workEquipment.push(equipamentName);
    this.getWorkEquipmentOptions();
    // this.workEquipment.push({ id: String(i.idEquipamento), description: i.equipamento });
    // this.workEquipment.map(i => ({ id: String(i.idEquipamento), description: i.equipamento }));
    // // console.log(this.workEquipment);
    // this.getWorkEquipmentOptions();
    // this.selectsEquipament.selects.push(this.workEquipment);
    // this.selectsEquipament.selects[0].value = this.workEquipment[0].value;
    // this.selectsEquipament.selects[0].label = this.workEquipment[0].label;

    // this.switchListRegister = 'register'
    // this.isEditing = true;
  },
  // teste(){
  //   const equipamentName = this.selectsEquipament.selects.find(equipament => equipament.idEquipamento === component.Equipamento_idEquipamento); 
  // }
  
  closeEditing() {
    console.log('clousing entrando');
    
    this.switchLabelPage('list');
    this.switchListRegister = 'list';
    this.isEditing = false;
    this.workEquipment = this.workEquipmentEdit;
    this.resetModel();
    },
  async updateComponent() {
    try {
      const response = await this.$http.update('componente', getLocalStorageToken(), this.inputValues, this.inputValues.idComponente);
      this.$swal({
        type: 'success',
        title: 'Alterado com Sucesso',
        confirmButtonColor: '#F34336',
      })
      const index =  this.workComponent.indexOf(this.workComponent.find(i => i.idComponente === this.inputValues.idComponente));
      this.workComponent.splice(index,1 , this.inputValues);
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
  }
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