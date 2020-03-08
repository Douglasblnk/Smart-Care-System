<template>
  <div class="equipmentBackground">
    <div class="wrapper">
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
    </div>
  </div>
</template>

<script>
import simpleInput from "../../components/inputs/simple-input";
// import select from '../../components/inputs/custom-select'
import description from "../../components/inputs/description";
import selectId from "../../components/inputs/tranfer-select";
export default {
  components: {
    "simple-input": simpleInput,
    // 'custom-select': select
    "tranfer-select": selectId,
    description: description
  },
  data() {
    return {
      inputValues: {
        description: "",
        equipamento_id: 0,
        // equipamento_name:"",

      },
      selectsEquipament:{
        select: "",
        selects: []
      },
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
    this.getEquipment();
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
    getEquipment()
    {
      const token = localStorage.getItem('token')
      fetch(`${this.$apiUrl}/equipamento/get`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        },
       
      }).then(res => res.json())
        .then(json => {
          // console.log(json)
          if (json.status !== 200) return this.$swal({
            type: 'error',
            title: `Ops! ${json.err}`,
            confirmButtonColor: '#F34336',
          })
          if(json.result.length === undefined){
            console.log("talvez entre aki");
            this.selects.selects.map(select => {
              Object.entries(select).forEach(([key, value]) =>{
                console.log("eu aki");
                console.log(key, value);
              })
            })
          }
          else {
            console.log("ta chegando aqui galera");
            for (let index = 0; index < json.result.length; index++){
              this.selectsEquipament.selects.push(json.result[index]);
              this.selectsEquipament.selects[index].value = json.result[index].idEquipamento;
              this.selectsEquipament.selects[index].label = json.result[index].descricao;
            }
          }
          // this.$swal({
          //   type: 'success',
          //   title: `${json.result}`,
          //   confirmButtonColor: '#F34336',
          // })
        })

    }
  },
};
</script>

<style lang="scss" scoped>
.equipmentBackground {
  display: flex;
  width: 100%;
  height: 100%;
  padding-top: 3%;
  .wrapper {
    .formPosition{
      display: flex;
      flex-direction: column;
      align-items: center;
      width:100%;
    .cadCard {
      padding-top: 2%;
      height: 19rem;
      width: 50%;
      display: flex;
      flex-direction: column;
      border-radius: 10px;
      background-color: #ffffff;
      .inputs {
        padding-left: 3.5%;
        padding-right: 3.5%;
      }
      .textAreaDescription {
        box-sizing: border-box;
        padding-left: 4%;
        padding-right: 4%;
      }
    }
    .sideInput {
      display: flex;
      align-self: center;
      width: 100%;
      .inputsSidePosition {
        padding-left: 3.5%;
        padding-right: 3.5%;
        width: 50%;
      }
    }
    }
  }
}
</style>