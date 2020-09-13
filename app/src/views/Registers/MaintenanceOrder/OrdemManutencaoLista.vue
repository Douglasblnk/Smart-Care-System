<template>
  <div class="ordem-corretiva-root">
    <transition name="fade" mode="out-in">
      <div
        v-if="isLoading"
        key="loadingContent"
        class="d-flex justify-content-center align-items-center text-muted mt-5"
      >
        <i class="fa fa-spinner fa-spin fa-lg mx-2" />
        <span>Carregando informações...</span>
      </div>

      <card v-if="!isLoading" key="orderForm">
        <form-wizard
          class="step-by-step"
          title="Cadastro de Ordem de serviço"
          subtitle=""
          next-button-text="Próximo"
          back-button-text="Voltar"
          finish-button-text="Finalizar"
          @on-complete="registerOrderMaintenance()"
        >
          <!--
            Step para informar o titulo, resumo e descrição da ordem
          -->
          <tab-content title="Causa Manutenção" icon="fas fa-user" class="maintenanceCause">
            <div class="firstInput">
              <simple-input v-model="inputValues.title" :label="'Título:'" :type="'text'" />
            </div>

            <div class="secondInput">
              <simple-input v-model="inputValues.summary" :label="'Resumo'" :type="'text'" />
            </div>

            <!-- <div class="inputMaintenance">
              <div>
                <label class="text-muted">
                  Descrição do problema:
                </label>
              </div>
              <textarea
                v-model="inputValues.description"
                class="rounded w-100"
                rows="3"
                name="comment"
                form="usrform"
              />
            </div> -->
          </tab-content>

          <!--
            Step para informada o inicio planejado e o fim planejado da ordem
          -->
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
          </tab-content>

          <!--
            Step para selecionar a prioridade, setor e se querer parada
          -->
          <tab-content title="Informações Gerais" icon="fas fa-check" class="maintenanceCause">
            <div class="d-flex">
              <custom-select
                v-model="inputValues.priority"
                label="Prioridade"
                :options="getPriorityOptions()"
              />

              <custom-select
                v-model="inputValues.requireStop"
                label="Requer Parada"
                :options="selectsRequireStopOptions()"
              />
            </div>

            <div class="d-flex">
              <custom-select
                v-model="inputValues.requester"
                label="Solicitante"
                :options="selectsRequestersOptions()"
              />
              <custom-select
                v-model="inputValues.report"
                label="Reporte"
                :options="selectsReportOptions()"
              />
            </div>
          </tab-content>

          <!--
            Step para selecionar os equipamentos
          -->
          <tab-content title="Equipamentos" icon="fas fa-check">
            <div class="w-100 d-flex justify-content-center">
              <span style="font-size: 22px">Selecione os equipamentos</span>
            </div>
            <div class="equipament-items">
              <custom-select
                v-model="sector"
                label="Setor"
                :options="getSectorOptions()"
              />
              <custom-select
                v-model="equipment"
                label="Equipamento"
                :options="getEquipmentOptions()"
              />
              <div class="d-flex justify-content-center">
                <smart-button
                  primary
                  :disabled="!sector || !equipment"
                  @click.native="addEquipmentSector(sector, equipment)"
                >
                  <span>Adicionar</span>
                </smart-button>
              </div>
            </div>
          </tab-content>

          <!--
            Step para definir quais as operações que a ordem deve ter
          -->
          <tab-content title="Operações" icon="fa fa-cog">
            <div class="operations-title">
              <span class="text-center">Selecione o setor e as operações para os equipamentos</span>
            </div>
            <div class="operations-items">
              <label>Equipamentos</label>
              <b-form-checkbox-group
                id="checkbox-operations"
                v-model="selectedOperations"
                :options="getOperationsOptions()"
                name="flavour-1"
                stacked
              />
            </div>
          </tab-content>

          <!--
            Step para definir quais EPIs são necessárias para a ordem
          -->
          <tab-content title="Epi" icon="fa fa-cog">
            <div class="d-flex justify-content-center">
              <smart-button primary @click.native="showEpiModal()">
                <span>Adicionar EPI</span>
              </smart-button>
            </div>

            <div class="w-100">
              <label>EPIs selecionadas: </label>
              <div v-if="inputValues.epis.length > 0" class="d-flex flex-wrap">
                <div v-for="(epi, index) in inputValues.epis" :key="`epi-${index}`">
                  <div
                    class="selected-epi-wrapper"
                    @mouseenter="() => $set(showRemoveEpi, index, true)"
                    @mouseleave="() => $set(showRemoveEpi, index, false)"
                  >
                    <span>{{ getEpiName(epi.Epi_idEpi) }}</span>
                    <div
                      v-if="showRemoveEpi[index]"
                      class="selected-epi-remove"
                      @click="removeEpi(index)"
                    >
                      <i class="fa fa-trash" />
                    </div>
                  </div>
                </div>
              </div>
              <div v-else>
                <span>Nenhuma EPI selecionada.</span>
              </div>
            </div>
          </tab-content>
        </form-wizard>
      </card>
    </transition>

    <b-modal ref="my-modal" centered hide-footer hide-header title="Cadastrar Epi na Ordem" @hide="resetModal()" @show="checkSelectedEpis()">
      <div class="d-block text">
        <div class="text-center">
          <h3>Adicionar EPIs à ordem</h3>
          <span>
            Informe quais EPIs esta ordem precisa para ser executada.
          </span>
        </div>
        <div class="m-3" style="overflow: auto; max-height: 300px;">
          <b-form-checkbox-group
            id="checkbox-group-1"
            v-model="selectedEpis"
            :options="getEpiOptions()"
            name="flavour-1"
            stacked
          />
        </div>
      </div>
      <div v-if="modalHasError">
        <div class="d-flex justify-content-center w-100 p-2 rounded" style="background-color: #ff4a4a5c; border: 1px solid #ff4a4aa6">
          <span style="color: black">{{ modalErrorMessage }}</span>
        </div>
      </div>
      <div class="d-flex justify-content-center">
        <smart-button class="mr-2" @click.native="closeModal()">
          <span>Fechar</span>
        </smart-button>
        <smart-button primary @click.native="addEpi()">
          <span>Adicionar</span>
        </smart-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { getErrors } from '../../../utils/utils';
import { FormWizard, TabContent } from 'vue-form-wizard';
import 'vue-form-wizard/dist/vue-form-wizard.min.css';

export default {
  name: 'OrdemManutencaoCorretiva',

  components: {
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
        beginData: '',
        requireStop: '',
        requester: '',
        report: '',
        typeMaintenance: 3,
        priority: '',
        stats: 1,
        plannedTime: '',
        operations: [],
        epis: [],
        equipments_sectors: [],
      },
      selectedEpis: [],
      workEquipment: [],
      selectsPriority: [],
      selectsSector: [],
      sector: '',
      equipment: '',
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
      selectedOperations: [],
      selectsRequesterOptions: [],
      selectsReports: [],
      operationsList: [],
      showRemoveEpi: {},
      sequenceOperation: 0,
      modalHasError: false,
      modalErrorMessage: '',
      isLoading: false,
    };
  },

  created() {
    this.isLoading = true;
    this.getSequencialData();
  },

  methods: {
    async getSequencialData() {
      try {
        await this.getEquipments();
        await this.getSector();
        await this.getOperations();
        await this.getPriority();
        await this.getRequester();
        await this.getReporter();
  
        this.isLoading = false;
      } catch (err) {
        console.log('err getSequencialData :>> ', err.response || err);

        this.$swal({
          type: 'waning',
          html: getErrors(err),
        });
      }
    },
    resetModal() {
      this.modalHasError = false;
      this.modalErrorMessage = '';
      this.selectedEpis = [];
    },
    addEquipmentSector(sector, equipment) {
      if (!sector || !equipment) return;

      this.inputValues.equipments_sectors.push({ Equipamento: equipment, Local: sector });
      
      this.$swal({
        type: 'success',
        text: 'Equipamento e Setor adicionados a lista',
        toast: true,
        position: 'top-right',
        showConfirmButton: false,
        timer: 3000,
        confirmButtonColor: '#F34336',
      });
    },
    getEpiOptions() {
      return this.epiList.map(i => ({ text: i.descricaoEpi, value: i.idEpi }));
    },
    getOperationsOptions() {
      return this.operationsList.map(i => ({ text: i.descricao_operacao, value: i.idoperacao }));
    },
    getEquipmentOptions() {
      return this.workEquipment.map(i => ({ id: String(i.idEquipamento), description: i.descricao }));
    },
    getEpiName(epi) {
      const { descricaoEpi } = this.epiList.find(i => i.idEpi === epi);
      return descricaoEpi;
    },
    removeEpi(index) {
      this.inputValues.epis.splice(index, 1);
      this.$set(this.showRemoveEpi, [index], false);
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
      this.resetModal();
    },
    async getEpis() {
      try {
        const response = await this.$http.get('epi');

        if (response.length === undefined)
          this.epiList.push(response);
        else this.epiList = [...response];
      } catch (err) {
        console.log('err getEpis :>> ', err.response || err);

        return this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    addEpi() {
      if (this.selectedEpis.length === 0) {
        this.modalHasError = true;
        this.modalErrorMessage = 'Selecione uma EPI antes de continuar';
      } else {
        this.inputValues.epis = this.selectedEpis.map(i => ({ Epi_idEpi: i }));
        this.confirmModal();
      }
    },
    resetInputValues() {
      this.inputValues.operations = [];
      this.sequenceOperation = 0;
      this.selectedEpis = [];
      this.selectedOperations = [];
      this.workEquipment = [];
    },
    async addOperation() {
      for (const option of this.selectedOperations) {
        this.sequenceOperation += 10;
        const incrementOperationZero = this.incrementZero(this.sequenceOperation);

        const operationOption = { Operacao: option, sequencia_operacao: incrementOperationZero + this.sequenceOperation };

        this.inputValues.operations.push(operationOption);
      }
    },
    incrementZero(sequenceOperation) {
      if (sequenceOperation >= 100) return '0';
      return '00';
    },
    checkSelectedEpis() {
      if (this.inputValues.epis.length > 0)
        this.selectedEpis = this.inputValues.epis.map(i => i.Epi_idEpi);
    },
    async registerOrderMaintenance() {
      try {
        await this.addOperation();
        this.$set(this.inputValues, 'beginData', this.$moment().format('YYYY-MM-DD'));

        await this.$http.post('ordem-manutencao/list', this.inputValues);

        this.$swal({
          type: 'success',
          text: 'Ordem de Serviço cadastrada com Sucesso',
          confirmButtonColor: '#F34336',
        });
      } catch (err) {
        console.log('err registerOrderMaintenance :>> ', err.response || err);

        return this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    async getEquipments() {
      try {
        const response = await this.$http.get('equipamento');

        if (response.length === undefined)
          this.workEquipment.push(response);
        else this.workEquipment = [...response];
      } catch (err) {
        console.log('err getEquipments :>> ', err.response || err);

        return this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    async getRequester() {
      try {
        const response = await this.$http.get('users', {
          headers: { type: 'requester' },
        });

        if (response.length === undefined)
          this.selectsRequesterOptions.push(response);
        else this.selectsRequesterOptions = [...response];
      } catch (err) {
        console.log('err getRequester :>> ', err.response || err);

        return this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    async getReporter() {
      try {
        const response = await this.$http.get('users', {
          headers: { type: 'report' },
        });

        if (response.length === undefined)
          this.selectsReports.push(response);
        else this.selectsReports = [...response];
      } catch (err) {
        console.log('err getReporter :>> ', err.response || err);

        return this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    selectsRequireStopOptions() {
      return this.selectsRequireStop.map(i => ({ id: String(i.id), description: i.nome }));
    },
    selectsRequestersOptions() {
      return this.selectsRequesterOptions.map(i => ({ id: String(i.idUsuario), description: i.nome }));
    },
    selectsReportOptions() {
      return this.selectsReports.map(i => ({ id: String(i.idUsuario), description: i.nome }));
    },
    async getSector() {
      try {
        const response = await this.$http.get('local-instalacao');

        if (response.length === undefined)
          this.selectsSector.push(response);
        else this.selectsSector = [...response];
      } catch (err) {
        console.log('err getSector :>> ', err.response || err);

        return this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    getSectorOptions() {
      return this.selectsSector.map(i => ({ id: String(i.idSetor), description: i.nome }));
    },
    async getPriority() {
      try {
        const response = await this.$http.get('prioridade');

        if (response.length === undefined)
          this.selectsPriority.push(response);
        else this.selectsPriority = [...response];
      } catch (err) {
        console.log('err getPriority :>> ', err.response || err);

        return this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    async getOperations() {
      try {
        const response = await this.$http.get('operacoes');

        if (response.length === undefined)
          this.operationsList.push(response);
        else this.operationsList = [...response];
      } catch (err) {
        console.log('err getOperations :>> ', err.response || err);

        return this.$swal({
          type: 'warning',
          html: getErrors(err),
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
.ordem-corretiva-root {
  display: flex;
  align-items: center;
  justify-content: center;
  .content-wrapper {
    width: 70%;
    background-color: #ffffff;
    border-radius: 10px;
    padding: 25px;
    margin: 20px 0;
    .step-by-step{
      width:100%;
      .maintenanceCause{
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        .inputMaintenance{
          padding: 0.5rem;
          grid-column-start: 1;
          grid-column-end: 3;
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
      .operations-title {
        display: flex;
        justify-content: center;
        font-size: 22px;
      }
      .operations-items {
        overflow: auto;
        max-height: 300px;
        margin: 20px;
      }
      .equipament-items {
        //overflow: auto;
        max-height: 300px;
        margin: 20px;
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
  }
}
@media (max-width: 1366px) {
  .content-wrapper {
    width: 100% !important;
  }
}
</style>
