<template>
  <div class="ordem-manutencao-rota-root">
    <div class="cadCard">
      <form-wizard @on-complete="registerOrderMaintenance()" class="stepByStep" title="Cadastro de Ordem de serviço" subtitle="" nextButtonText="Próximo" backButtonText="Voltar" finishButtonText="Finalizar">
        <tab-content title="Causa Manutenção" icon="fas fa-user" class="maintenanceCause">
          <div class="firstInput">
            <simple-input v-model="inputValues.title" :label="'Título:'" :type="'text'" />
          </div>
          <div class="secondInput">
            <simple-input v-model="inputValues.summary" :label="'Resumo'" :type="'text'" />
          </div>
        </tab-content>
        <tab-content title="Datas" icon="fa fa-cog" class="maintenanceCause">
          <div>
            <simple-input
              v-model="inputValues.plannedStart"
              :label="'Inicio Planejado:'"
              :type="'date'"
            />
          </div>
          <div>
            <simple-input
              v-model="inputValues.plannedEnd"
              :label="'Fim Planejado'"
              :type="'date'"
            />
          </div>
          <div>
            <simple-input
              v-model="inputValues.startTime"
              :label="'Hora Inicio Programado:'"
              :type="'time'"
            />
          </div>
          <div>
            <simple-input
              v-model="inputValues.endTime"
              :label="'Hora Fim Programado'"
              :type="'time'"
            />
          </div>
          <div>
            <simple-input v-model="inputValues.beginData" :label="'Data emissão'" :type="'date'" />
          </div>
        </tab-content>
        <tab-content title="Informações Gerais" icon="fas fa-check" class="maintenanceCause">
          <div>
            <tranfer-select
              v-model="inputValues.typeMaintenance"
              :selects="selectsTypeMaintenance"
              :label="'Tipo Manutenção'"
            />
          </div>
          <div>
            <tranfer-select
              v-model="inputValues.priority"
              :selects="selectsPriority"
              :label="'Prioridade'"
            />
          </div>
          <div>
            <tranfer-select
              v-model="inputValues.requireStop"
              :selects="selectsRequireStop"
              :label="'Requer Parada'"
            />
          </div>
        </tab-content>
        <tab-content title="Maquinas" icon="fa fa-cog" class="maintenanceCause">
          <div class="firstInput">
            <tranfer-select
              v-model="inputValues.sector"
              :selects="selectsSector"
              :label="'Setor'"
            />
          </div>
          <div>
            <tranfer-select
              v-model="inputValues.equipment"
              :selects="selects"
              :label="'Equipamento'"
            />
          </div>
          <div>
            <p>Aqui ira o card com as :
              Operações { descriçao(text area), material(text), quantidade, unidade. no cadastro o campo execução como false = 0 }
            </p>
          </div>
        </tab-content>
      </form-wizard>
      

      <!-- {{stats}} -->
    </div>
  </div>
</template>

<script>
import { getLocalStorageToken } from '../../../utils/utils';
import simpleInput from '../../../components/inputs/simple-input';
import description from '../../../components/inputs/description';
import selectId from '../../../components/inputs/tranfer-select';
import saveButton from '../../../components/button/save-button';
import select from '../../../components/inputs/custom-select';
import { FormWizard, TabContent } from 'vue-form-wizard';
import 'vue-form-wizard/dist/vue-form-wizard.min.css';

export default {
  name: 'OrdemManutencaoRota',

  components: {
    'simple-input': simpleInput,
    'tranfer-select': selectId,
    'save-button': saveButton,
    description: description,
    'custom-select': select,
    FormWizard,
    TabContent
  },
  data() {
    return {
      inputValues: {
        title: '',
        summary: '',
        description: '',
        plannedStart: '',
        plannedEnd: '',
        requireStop: true,
        beginData: '',
        equipment: '',
        typeMaintenance: '',
        sector: '',
        priority: '',
        stats: 'aberto',
        customSelect: '',
        customSelect2: '',
        startTime: '',
        endTime: '',
        descriptionOperation: '',
        plannedTime: '',
        execution: false,
      },
      listateste: [],
      operacoesRota: {
        descricaoOperacao: '',
        execusao: 0,
        material: '',
        quantidade: '',
        unidade: '',
      },
      operacoesListaStepFour: {
        descricao: '',
        execusao: 0,
        tempoPlanejado: 0,
      },
      operacoesListaStepFive: {
        equipamentos: [],
      },
      stats: [],
      workEquipment: [],
      selects: {
        select: '',
        selects: []
      },
      selectsTypeMaintenance: {
        select: '',
        selects: []
      },
      selectsSector: {
        select: '',
        selects: []
      },
      selectsPriority: {
        select: '',
        selects: []
      },
      selectsStats: {
        select: '',
        selects: []
      },
      selectsRequireStop: {
        select: '',
        selects: [
          {
            value: true,
            label: 'Sim'
          },
          {
            value: false,
            label: 'Não'
          }
        ]
      }
    };
  },
  mounted() {
    this.getEquipments();
    this.getTypeMaintenance();
    this.getSector();
    this.getPriority();
    this.getStats();
  },
  methods: {
    getStatsSelect() {
      const teste = this.stats.map(i => {});
    },

    registerOrderMaintenance() {
      this.inputValues.equipment = this.selects.select;
      this.inputValues.priority = this.selectsPriority.select;
      this.inputValues.sector = this.selectsSector.select;
      this.inputValues.stats = this.selectsStats.select;
      this.inputValues.typeMaintenance = this.selectsTypeMaintenance.select;
      this.inputValues.requireStop = this.selectsRequireStop.select;
      console.log("------");
      console.log("------");
      console.log(this.inputValues);
      console.log("------");
      console.log("------");
      const token = localStorage.getItem("token");
      fetch(`${this.$apiUrl}/ordem-manutencao`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`
        },
        body: JSON.stringify(this.inputValues)
      })
        .then(res => res.json())
        .then(json => {
          if (json.status !== 200)
            return this.$swal({
              type: "error",
              title: `Ops! ${json.err}`,
              confirmButtonColor: "#F34336"
            });
          this.$swal({
            type: "success",
            title: `Ordem de Serviço cadastrada com Sucesso`,
            confirmButtonColor: "#F34336"
          });
        });
    },
    getTypeMaintenance() {
      this.$http
        .get("tipo-manutencao/get", getLocalStorageToken())
        .then(res => {
          if (res.status !== 200)
            return this.$swal({
              type: "error",
              title: `Ops! ${res.err}`,
              confirmButtonColor: "#F34336"
            });
          console.log("-------");
          console.log(res.result);
          if (res.result.length === undefined) {
            this.listateste.push(res.result),
            this.selects.selects.map(select => {
              Object.entries(select).forEach(([key, value]) => {
                console.log(key, value);
              });
            });
          } // this.selects.selects.push(res.result)
          else {
            for (let index = 0; index < res.result.length; index++) {
              this.selectsTypeMaintenance.selects.push(res.result[index]);
              this.selectsTypeMaintenance.selects[index].value =
                res.result[index].idtipoManutencao;
              this.selectsTypeMaintenance.selects[index].label =
                res.result[index].tipoManutencao;
            }
            this.listateste.push(res.result)
          }
        });
    },
    getEquipments() {
      this.$http
        .get("equipamento/get", getLocalStorageToken())
        .then(res => {
          if (res.status !== 200)
            return this.$swal({
              type: "error",
              title: `Ops! ${res.err}`,
              confirmButtonColor: "#F34336"
            });

          if (res.result.length === undefined) {
            this.workEquipment.push(res.result);
            console.log(this.workEquipment);
            this.selects.selects.push(this.workEquipment);
            this.selects.selects[0].value = this.workEquipment[0].idEquipamento;
            this.selects.selects[0].label = this.workEquipment[0].equipamento;
          } else {
            // console.log("----")
            // console.log(res.result)
            for (let index = 0; index < res.result.length; index++) {
              this.selects.selects.push(res.result[index]);
              this.selects.selects[index].value =
                res.result[index].idEquipamento;
              this.selects.selects[index].label = res.result[index].equipamento;
            }
          }
        });
    },
    getSector() {
      this.$http
        .get("local-instalacao/get", getLocalStorageToken())
        .then(res => {
          if (res.status !== 200)
            return this.$swal({
              type: "error",
              title: `Ops! ${res.err}`,
              confirmButtonColor: "#F34336"
            });
          console.log("-------");
          console.log(res.result);
          if (res.result.length != undefined) {
            for (let index = 0; index < res.result.length; index++) {
              this.selectsSector.selects.push(res.result[index]);
              this.selectsSector.selects[index].value =
                res.result[index].idSetor;
              this.selectsSector.selects[index].label = res.result[index].nome;
            }
          }
        });
    },
    getPriority() {
      console.log("Qualquer coisa");
      this.$http
        .get("prioridade/get", getLocalStorageToken())
        .then(res => {
          if (res.status !== 200)
            return this.$swal({
              type: "error",
              title: `Ops! ${res.err}`,
              confirmButtonColor: "#F34336"
            });
          console.log("-------0000");
          console.log(res.result);
          if (res.result.length === undefined) {
            this.selects.selects.map(select => {
              Object.entries(select).forEach(([key, value]) => {
                console.log(key, value);
              });
            });
          } // this.selects.selects.push(res.result)
          else {
            for (let index = 0; index < res.result.length; index++) {
              this.selectsPriority.selects.push(res.result[index]);
              this.selectsPriority.selects[index].value =
                res.result[index].idPrioridade;
              this.selectsPriority.selects[index].label =
                res.result[index].descricaoPrioridade;
            }
          }
        });
    },
    getStats() {
      this.$http.get("status/get", getLocalStorageToken()).then(res => {
        if (res.status !== 200)
          return this.$swal({
            type: "error",
            title: `Ops! ${res.err}`,
            confirmButtonColor: "#F34336"
          });
        if (res.result.length === undefined) this.stats.push(res.result);
        else this.stats = [...res.result];
        console.log("-------");
        console.log(res.result);
        if (res.result.length === undefined) {
          this.selects.selects.map(select => {
            Object.entries(select).forEach(([key, value]) => {
              console.log(key, value);
            });
          });
        } // this.selects.selects.push(res.result)
        else {
          for (let index = 0; index < res.result.length; index++) {
            this.selectsStats.selects.push(res.result[index]);
            this.selectsStats.selects[index].value = res.result[index].idStatus;
            this.selectsStats.selects[index].label =
              res.result[index].tipoStatus;
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.ordem-manutencao-rota-root {
  width: 100vw;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .cadCard {
    width:75%;
    background-color: #ffffff;
    border-radius: 10px;
    padding: 25px;
    margin-top:6%;
    .stepByStep{
      width:100%;
      .maintenanceCause{
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        .inputMaintenance{
          grid-column-start: 1;
          grid-column-end: 3;
          .descriptionInput{
            margin-left:1%;
            width:98%;
          }
        }

        .firstInput{
          grid-column-start:1;
          grid-column-end:1;
        }
        .secondInput{
          grid-column-start:2;
          grid-column-end:2;
        }
      }
    }
    .maintanceMenu {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
.span_question {
  color: #ff0303;
  font-family: 'Montserrat';
}
@media (max-width: 1250px) {
  .ordem-manutencao-rota-root {
    width: 100vw;
    height: 100vh;
    padding: 20px;
  }

}
</style>
