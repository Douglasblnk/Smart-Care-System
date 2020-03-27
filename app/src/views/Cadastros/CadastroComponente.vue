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
                    <th scope="col">Máquina</th>
                    <th scope="col">Componente</th>
                  </tr>
                </thead>
                <tbody class="table-body">
                  <tr v-for="(workCenter, index) in workCenters" :key="`workCenter-${index}`">
                    <td>{{ workCenter.DescricaoComponente}}</td>
                    <td style="width: 50px">
                      <div class="d-flex table-action">
                        <i class="fas fa-edit text-muted" @click="editWorkCenter(DescricaoComponente)"></i>
                        <i class="fas fa-trash text-muted" @click="deleteComponents(DescricaoComponente, index)"></i>
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
            <tranfer-select v-model="inputValues.equipamento_id" :selects="selectsEquipament" :label="'Máquina'" ></tranfer-select>     
          </div>
          <div class="sideInput">
            <div class="inputsSidePosition">
              <description v-model="inputValues.description" :label="'Descricao Componente:'" :type="'text'" />
            </div>  
          </div>
        </div>
        <div class="d-flex justify-content-center m-3">
          <b-button type="submit" value="send" variant="danger">Cadastrar</b-button>
        </div>
      </form>

      </template>
    </transition>
  </div>
</template>

<script>
import simpleInput from "../../components/inputs/simple-input";
// import select from '../../components/inputs/custom-select'
import description from "../../components/inputs/description";
import selectId from "../../components/inputs/tranfer-select";
import saveButton from '../../components/button/save-button';
import cancelButton from '../../components/button/cancel-button';

export default {
  components: {
    "simple-input": simpleInput,
    // 'custom-select': select
    "tranfer-select": selectId,
    description: description,
    "save-button": saveButton,
    "cancel-button": cancelButton,
    
  },
  data() {
    return {
      inputValues: {
        description: "",
        equipamento_id: 0,
        // equipamento_name:"",

      },
      workEquipment: [],
      selectsEquipament:{
        select: "",
        selects: []
      },
      switchListRegister: 'list',
      isEditing: false,
      equipamentos:[
      {
        nome: "teste"
      },
      {
        nome:"testando"
      }
      ]
    };
  },
  mounted(){
    this.getEquipments();
  },
  methods: {
    registerEquipment(){
      this.inputValues.equipamento_id = this.selectsEquipament.select;

      const token = localStorage.getItem('token')
       fetch(`${this.$apiUrl}/componente`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        },
        body: JSON.stringify(this.inputValues)
      }).then(res => res.json())
        .then(json => {
          if (json.status !== 200) return this.$swal({
            type: 'error',
            title: `Ops! ${json.err}`,
            confirmButtonColor: '#F34336',
          })
          this.$swal({
            type: 'success',
            title: `${json.result}`,
            confirmButtonColor: '#F34336',
          })
          
        })
    },

    getEquipments(){
      const token = localStorage.getItem('token')
      this.$http.methodGet('equipamento/get', token)
        .then(res => {
          if (res.status !== 200) return this.$swal({
            type: 'error',
            title: `Ops! ${res.err}`,
            confirmButtonColor: '#F34336',
          })

         if (res.result.length === undefined ) {

              this.workEquipment.push(res.result)
            console.log(this.workEquipment);
            this.selectsEquipament.selects.push(this.workEquipment);
             this.selectsEquipament.selects[0].value = this.workEquipment[0].idEquipamento;
             this.selectsEquipament.selects[0].label = this.workEquipment[0].equipamento;

            }else {
            // console.log("----")
            // console.log(res.result)
            for (let index = 0; index < res.result.length; index++) {
              this.selectsEquipament.selects.push(res.result[index]);
              this.selectsEquipament.selects[index].value = res.result[index].idEquipamento;
              this.selectsEquipament.selects[index].label = res.result[index].equipamento;
            }
          }          
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
  deleteComponents(DescricaoComponente, index) {
    this.$swal({
      type: 'question',
      title: `Deseja mesmo remover o Componente ${DescricaoComponente.DescricaoComponente}`,
      showCancelButton: true,
      confirmButtonColor: '#F34336',
      preConfirm: () => {
        this.$http.methodDelete
      }
    })
  }
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