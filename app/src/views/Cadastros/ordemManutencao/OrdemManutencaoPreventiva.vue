<template>
  <div class="ordem-manutencao-preventiva-root">
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
          <custom-select
            label="Equipamento"
            v-model="inputValues.equipment"
            :options="getEquipmentsOptions()"
          />
          <custom-select
            label="Prioridade"
            v-model="inputValues.requireStop"
            :options="selectsRequireStopOptions()"
          />
          <custom-select
            label="Requer Parada"
            v-model="inputValues.priority"
            :options="getPriorityOptions()"
          />
        </tab-content>
        <tab-content title="Operações" icon="fa fa-cog"  class="maintenanceCause">
          <!-- <span>será para a step para preventiva e corretiva step4 </span> -->
          <custom-select
            label="Setor"
            v-model="inputValues.sector"
            :options="getSectorOptions()"
          />
          <div >
            <simple-input
              v-model="inputValues.plannedTime"
              :label="'Tempo Planejado'"
              :type="'time'"
            />
          </div>
          <div class="inputMaintenance">
            <div>
              <label for="comment" class="text-muted">Descrição</label>
            </div>  
            <textarea class="rounded descriptionInput" rows="3" v-model="inputValues.descriptionOperation" name="comment" form="usrform">
            </textarea>
          </div>
        </tab-content>
        <tab-content title="Epi" icon="fa fa-cog">
          <div class="d-flex justify-content-center">
            <save-button id="show-btn" @click.native="showEpiModal" label="Adicionar EPI" />
          </div>

          <div class="w-100">
            <label>EPIs selecionadas: </label>
            <div class="d-flex">
              <div v-for="(epi, index) in inputValues.selectedEpis" :key="`epi-${index}`">
                <div
                  @mouseenter="() => $set(showRemoveEpi, index, true)"
                  @mouseleave="() => $set(showRemoveEpi, index, false)"
                  class="selected-epi-wrapper"
                >
                  <span>{{ getEpiName(epi) }}</span>
                  <div @click="removeEpi(index)" v-if="showRemoveEpi[index]" class="selected-epi-remove">
                    <i class="fa fa-trash" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </tab-content>
      </form-wizard>
      <!-- {{stats}} -->
    </div>
    <b-modal centered  @show="resetModal" ref="my-modal" hide-footer title="Cadastrar Epi na Ordem">
      <div class="d-block text">
        <b-form-group label="Escolha as EPI's:">
          <b-form-checkbox-group
            id="checkbox-group-1"
            v-model="inputValues.selectedEpis"
            :options="getEpiOptions()"
            name="flavour-1"
            stacked
          />
        </b-form-group>
      </div>
      <div class="d-flex justify-content-center">
        <cancel-button label="Fechar" @click.native="closeModal" />
        <save-button label="Adicionar" @click.native="confirmModal" />
      </div>
    </b-modal>
  </div>
</template>

<script>
import { getLocalStorageToken, getErrors } from '../../../utils/utils';
import selectId from '../../../components/inputs/tranfer-select';
import select from '../../../components/inputs/custom-select';
import { FormWizard, TabContent } from 'vue-form-wizard';
import 'vue-form-wizard/dist/vue-form-wizard.min.css';

export default {
  name: 'OrdemManutencaoPreventiva',

  components: {
    'tranfer-select': selectId,
    'custom-select': select,
    FormWizard,
    TabContent,
  },
  data() {
    return {
      inputValues: {
        title: '',
        summary: '',
        description: '',
        plannedStart: '',
        plannedEnd: '',
        requireStop: '',
        beginData: '',
        equipment: '',
        typeMaintenance: 8,
        sector: '',
        priority: '',
        stats: 1,
        customSelect: '',
        customSelect2: '',
        selectedEpis: [],
      },
      stats: [],
      workEquipment: [],
      selectsSector: [],
      selectsPriority: [],
      selectsRequireStop: [
          {
            id: true,
            nome: 'Sim',
          },
          {
            id: false,
            nome: 'Não',
          },
        ],
      epiList: [],
      showRemoveEpi: {},
    };
  },
  mounted() {
    this.getEquipments();
    this.getSector();
    this.getPriority();
  },
  methods: {
    getStatsSelect() {
      const teste = this.stats.map(i => {});
    },
    resetModal() {
      this.inputValues.selectedEpis = [];
    },
    getEpiOptions() {
      return this.epiList.map(i => ({ text: i.descricaoEpi, value: i.idEpi }));
    },
    getEpiName(epi) {
      const { descricaoEpi } = this.epiList.find(i => i.idEpi === epi);
      return descricaoEpi;
    },
    removeEpi(index) {
      this.inputValues.selectedEpis.splice(index, 1);
      this.$set(this.showRemoveEpi, [index], false);
    },
    addOperation() {
      // todo
    },
    async showEpiModal() {
      await this.getEpis();

      this.$refs['my-modal'].show();
    },
    closeModal() {
      this.$refs['my-modal'].hide();
    },
    confirmModal() {
      this.$refs['my-modal'].toggle('#toggle-btn');
    },
    async getEpis() {
      try {
        const { result } = await this.$http.get('epi/get', getLocalStorageToken());

        this.epiList = [...result];
      } catch (err) {
        console.log('err :>> ', err.response || err);

        return this.$swal({
          type: 'warning',
          title: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    async registerOrderMaintenance() {
      this.inputValues.equipment = this.workEquipment;
      this.inputValues.priority = this.selectsPriority;
      this.inputValues.sector = this.selectsSector;
      this.inputValues.requireStop = this.selectsRequireStop;

      try {
        const response = await this.$http.post('ordem-manutencao', getLocalStorageToken(), this.inputValues);

          this.$swal({
            type: 'success',
            title: 'Ordem de Serviço cadastrada com Sucesso',
            confirmButtonColor: '#F34336',
          });

      } catch (err) {
        return this.$swal({
          type: 'warning',
          title: getErrors(err),
          confirmButtonColor: '#F34336',
        })
      }
    },
    selectsRequireStopOptions() {
      return this.selectsRequireStop.map(i => ({ id: String(i.id), description: i.nome }));
    },
    async getEquipments() {

      try {
        const response = await this.$http.get('equipamento/get', getLocalStorageToken());

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
    getEquipmentsOptions() {
      return this.workEquipment.map(i => ({ id: String(i.idEquipamento), description: i.equipamento }));
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
    getSectorOptions() {
      return this.selectsSector.map(i => ({ id: String(i.idSetor), description: i.nome }));
    },
    async getPriority() {

      try {
        const response = await this.$http.get('prioridade/get', getLocalStorageToken());

        if (response.result.length === undefined)
          this.selectsPriority.push(response.result);

        else this.selectsPriority = [...response.result];

      } catch (err) {
        return this.$swal({
          type: 'warning',
          title: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    getPriorityOptions() {
      return this.selectsPriority.map(i => ({ id: String(i.idPrioridade), description: i.descricaoPrioridade }));
    },
  },
};
</script>

<style lang="scss" scoped>
.ordem-manutencao-preventiva-root {
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
        
        .containerButton {
          width: 100%;
          height: 40px;
          display: flex;
          justify-content: flex-end;
          align-items:flex-end;
          .buttonAddOperation {
            position: relative;
              bottom: -40px;
            // right: 30;
            // // left: 80%;
            // padding: 2%;
          }
        }
      }
      .selected-epi-wrapper {
        min-width: 50px;
        padding: 5px 20px;
        margin: 5px;
        border-radius: 100px;
        background-color: #eee;
        user-select: none;
        position: relative;
        &:hover {
          background-color: #ddd;
        }
        .selected-epi-remove {
          position: absolute;
          display: flex;
          justify-content: center;
          align-items: center;
          right: -10px;
          top: -10px;
          width: 30px;
          height: 30px;
          border-radius: 100px;
          background-color: #eee;
          cursor: pointer;
          &:hover {
            background-color: var(--duas-rodas-soft);
            i { color: white; }
          }
          i { font-size: 14px; }
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
  .equipmentBackground {
    width: 100vw;
    height: 100vh;
    padding: 20px;
  }
}
</style>
