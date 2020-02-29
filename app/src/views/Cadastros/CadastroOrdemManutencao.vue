<template>
  <div class="equipmentBackground">
      <form @submit.prevent="registerOrderMaintenance()">
          <div class="cadCard">
            <div><simple-input v-model="inputValues.title" :label="'Título:'" :type="'text'"/></div>
            <div><simple-input v-model="inputValues.summary" :label="'Resumo'" :type="'text'" /></div>
            <div><simple-input v-model="inputValues.description" :label="'Descrição:'" :type="'text'" /></div>
            <div><simple-input v-model="inputValues.plannedStart" :label="'Inicio Planejado:'" :type="'date'" /></div>
            <div><simple-input v-model="inputValues.plannedEnd" :label="'Fim Planejado'" :type="'date'" /></div>
            <div><tranfer-select v-model="inputValues.requireStop" :selects="selectsRequireStop" :label="'Requer Parada'"/></div>
            <div><simple-input v-model="inputValues.beginData" :label="'Data emissão'" :type="'date'" /></div>
            <div><tranfer-select v-model="inputValues.equipment" :selects="selects" :label="'Equipamento'"/></div>
            <div>
              <tranfer-select v-model="inputValues.typeMaintenance" :selects="selectsTypeMaintenance" :label="'Tipo Manutenção'"/></div>
            <div>
              <tranfer-select v-model="inputValues.sector" :selects="selectsSector" :label="'Setor'"/>
            </div>
            <div>
              <tranfer-select v-model="inputValues.priority" :selects="selectsPriority" :label="'Prioridade'"/>
            </div>
            <div>
              <tranfer-select v-model="inputValues.stats" :selects="selectsStats" :label="'Status'"/>
            </div>
            <div>
              <custom-select v-model="inputValues.customSelect" :selects="getStatsSelect()" :label="'TESTE'"/>
            </div>
            <div>
              <custom-select v-model="inputValues.customSelect2" :selects="getPrioritySelect" :label="'TESTE'"/>
            </div>
            <!-- {{stats}} -->
          </div>
        <div class="qualquer"></div>
        <div class="d-flex justify-content-center m-3">
          <save-button label="Cadastrar" />
        </div>
      </form>
  </div>
</template>

<script>
import { getLocalStorageToken } from '../../utils/utils';
import simpleInput from "../../components/inputs/simple-input";
import description from "../../components/inputs/description";
import selectId from "../../components/inputs/tranfer-select";
import saveButton from '../../components/button/save-button'
import select from '../../components/inputs/custom-select'

export default {
  components: {
    "simple-input": simpleInput,
    "tranfer-select": selectId,
    "save-button": saveButton,
    description: description,
    'custom-select': select,
  },
  data() {
    return {
      inputValues: {
        title : "",
        summary : "",
        description : "",
        plannedStart : "",
        plannedEnd : "",
        requireStop : true,
        beginData : "",
        equipment : "",
        typeMaintenance : "",
        sector : "",
        priority : "",
        stats : "",
        customSelect: '',
        customSelect2: '',
      },
      stats: [],


      selects: {
        select: "",
        selects: []
      },
      selectsTypeMaintenance: {
        select: "",
        selects: []
      },
      selectsSector: {
        select: "",
        selects: []
      },
      selectsPriority: {
        select: "",
        selects: []
      },
      selectsStats: {
        select: "",
        selects: []
      },
      selectsRequireStop: {
        select: "",
        selects: [
          {
            value: true,
            label: "Sim"          
          },
          {
            value: false,
            label: "Não"          
          },
        ]
      }
    };
  },
  mounted(){
    this.getEquipments();
    this.getTypeMaintenance();
    this.getSector();
    this.getPriority();
    this.getStats();
  },
  methods: {
    getStatsSelect() {
      const teste = this.stats.map(i => {
        
      })
    },

    registerOrderMaintenance(){
      this.inputValues.equipment = this.selects.select;
      this.inputValues.priority = this.selectsPriority.select;
      this.inputValues.sector = this.selectsSector.select;
      this.inputValues.stats = this.selectsStats.select;
      this.inputValues.typeMaintenance = this.selectsTypeMaintenance.select;
      this.inputValues.requireStop = this.selectsRequireStop.select;
      console.log("------")
      console.log("------")
      console.log(this.inputValues)
      console.log("------")
      console.log("------")
      const token = localStorage.getItem('token')
       fetch(`${this.$apiUrl}/ordem-manutencao`, {
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
            title: `Ordem de Serviço cadastrada com Sucesso`,
            confirmButtonColor: '#F34336',
          })
        })
    },
    getTypeMaintenance(){
      this.$http.methodGet('tipo-manutencao/get', getLocalStorageToken())
        .then(res => {
          if (res.status !== 200) return this.$swal({
            type: 'error',
            title: `Ops! ${res.err}`,
            confirmButtonColor: '#F34336',
          })
          console.log("-------")
          console.log(res.result)
          if (res.result.length === undefined) {
            this.selects.selects.map(select => {
              Object.entries(select).forEach(([key, value]) => {
                console.log(key, value);
              })
            })
          } // this.selects.selects.push(res.result)
          else {
            for (let index = 0; index < res.result.length; index++) {
              this.selectsTypeMaintenance.selects.push(res.result[index]);
              this.selectsTypeMaintenance.selects[index].value = res.result[index].idtipoManutencao;
              this.selectsTypeMaintenance.selects[index].label = res.result[index].tipoManutencao;
            }
          }          
        })
    },
    getEquipments(){
      this.$http.methodGet('equipamento/get', getLocalStorageToken())
        .then(res => {
          if (res.status !== 200) return this.$swal({
            type: 'error',
            title: `Ops! ${res.err}`,
            confirmButtonColor: '#F34336',
          })
          console.log('aaaaaaaaaaaaa',res.result)
          if (res.result.length === undefined) {
            this.selects.selects.map(select => {
              Object.entries(select).forEach(([key, value]) => {
                console.log(key, value);
              })
            })
          } // this.selects.selects.push(res.result)
          else {
            this.selects.selects.map((select, index) => {
              console.log(index);
            })
            console.log("----")
            console.log(res.result)
            for (let index = 0; index < res.result.length; index++) {
              this.selects.selects.push(res.result[index]);
              this.selects.selects[index].value = res.result[index].idEquipamento;
              this.selects.selects[index].label = res.result[index].equipamento;
            }
          }          
        })
    },
     getSector(){
      this.$http.methodGet('local-instalacao/get', getLocalStorageToken())
        .then(res => {
          if (res.status !== 200) return this.$swal({
            type: 'error',
            title: `Ops! ${res.err}`,
            confirmButtonColor: '#F34336',
          })
          console.log("-------")
          console.log(res.result)
          if (res.result.length === undefined) {
            this.selects.selects.map(select => {
              Object.entries(select).forEach(([key, value]) => {
                console.log(key, value);
              })
            })
          } // this.selects.selects.push(res.result)
          else {
            for (let index = 0; index < res.result.length; index++) {
              this.selectsSector.selects.push(res.result[index]);
              this.selectsSector.selects[index].value = res.result[index].idSetor;
              this.selectsSector.selects[index].label = res.result[index].nome;
            }
          }          
        })
    },
    getPriority(){
      console.log("Qualquer coisa")
      this.$http.methodGet('prioridade/get', getLocalStorageToken())
        .then(res => {
          if (res.status !== 200) return this.$swal({
            type: 'error',
            title: `Ops! ${res.err}`,
            confirmButtonColor: '#F34336',
          })
          console.log("-------0000")
          console.log(res.result)
          if (res.result.length === undefined) {
            this.selects.selects.map(select => {
              Object.entries(select).forEach(([key, value]) => {
                console.log(key, value);
              })
            })
          } // this.selects.selects.push(res.result)
          else {
            for (let index = 0; index < res.result.length; index++) {
              this.selectsPriority.selects.push(res.result[index]);
              this.selectsPriority.selects[index].value = res.result[index].idPrioridade;
              this.selectsPriority.selects[index].label = res.result[index].descricaoPrioridade;
            }
          }          
        })
    },
    getStats(){
      this.$http.methodGet('status/get', getLocalStorageToken())
        .then(res => {
          if (res.status !== 200) return this.$swal({
            type: 'error',
            title: `Ops! ${res.err}`,
            confirmButtonColor: '#F34336',
          })
          if (res.result.length === undefined) 
          this.stats.push(res.result)
          else this.stats = [ ...res.result ]
          // console.log("-------0000111")
          // console.log(res.result)
          // if (res.result.length === undefined) {
          //   this.selects.selects.map(select => {
          //     Object.entries(select).forEach(([key, value]) => {
          //       console.log(key, value);
          //     })
          //   })
          // } // this.selects.selects.push(res.result)
          // else {
          //   for (let index = 0; index < res.result.length; index++) {
          //     this.selectsStats.selects.push(res.result[index]);
          //     this.selectsStats.selects[index].value = res.result[index].idStatus;
          //     this.selectsStats.selects[index].label = res.result[index].tipoStatus;
          //   }
          // }
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.equipmentBackground {
  width: 100vw;
  height: 100vh;
  padding:70px;
    .cadCard {
      display:grid;
      grid-column-start: 1;
      grid-column-end: 3;
      grid-row-start: 1;
      grid-row-end: 4;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      grid-template-rows: 1fr 1fr 1fr;
      grid-gap: 25px;
      background-color: #ffffff;
      border-radius: 10px;
      padding:25px;
      align-items: start;
      flex-wrap: wrap;
    }
}
@media (max-width: 1250px) 
{
  .equipmentBackground {
    width: 100vw;
    height: 100vh;
    padding:20px;  
  }
}
</style>