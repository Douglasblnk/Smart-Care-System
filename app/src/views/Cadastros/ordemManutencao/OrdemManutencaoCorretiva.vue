<template>
  <div class="ordem-corretiva-root">
    <div class="content-wrapper">
      <form-wizard
        class="step-by-step"
        title="Cadastro de Ordem de serviço"
        subtitle=""
        nextButtonText="Próximo"
        backButtonText="Voltar"
        finishButtonText="Finalizar"
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

          <div class="inputMaintenance">
            <div>
              <label class="text-muted">
                {{ (orderType === 'corretiva') ? 'Descrição do problema: ' : 'Observações: ' }}
                <span v-if="orderType === 'preventiva'" class="text-muted">(opcional)</span>
              </label>
            </div>
            <textarea
              v-model="inputValues.description"
              class="rounded w-100"
              rows="3"
              name="comment"
              form="usrform"
            />
          </div>
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
          Step para selecionar os equipamentos, prioridade, setor e se querer parada
         -->
        <tab-content title="Informações Gerais" icon="fas fa-check" class="maintenanceCause">
          <custom-select
            v-model="inputValues.equipment"
            label="Equipamento"
            :options="getEquipmentsOptions()"
          />
          <custom-select
            v-model="inputValues.priority"
            label="Prioridade"
            :options="getPriorityOptions()"
          />
          <custom-select
            v-model="inputValues.sector"
            label="Setor"
            :options="getSectorOptions()"
          />
          <custom-select
            v-model="inputValues.requireStop"
            label="Requer Parada"
            :options="selectsRequireStopOptions()"
          />
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
        </tab-content>

        <!--
          Step para definir quais as operações que a ordem deve ter
         -->
        <tab-content title="Operações" icon="fa fa-cog">
          <div class="operations-title">
            <span>Selecione as operações para está ordem</span>
          </div>

          <div class="d-flex justify-content-center">
            <save-button id="show-btn" label="Adicionar Operação" @click.native="showOperationModal()" />
          </div>

          <div class="w-100">
            <label>Operações selecionadas: </label>

            <div v-if="inputValues.operations.length > 0" class="d-flex flex-column">
              <div v-for="(operation, index) in inputValues.operations" :key="`epi-${index}`">
                <div class="seleted-operation-item">
                  <div class="d-flex flex-column">
                    <span>Operação: {{ getOperationName(operation.Operacao) }}</span>
                    <span>Sequencia: {{ operation.sequencia_operacao }}</span>
                  </div>
                  <div>
                    <i @click="removeOperation(index)" class="fa fa-trash fa-lg scalable-btn" />
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <span>Nenhuma operação selecionada.</span>
            </div>
          </div>
        </tab-content>

        <!--
          Step para definir quais EPIs são necessárias para a ordem
         -->
        <tab-content title="Epi" icon="fa fa-cog">
          <div class="operations-title">
            <span>Selecione as EPIs para está ordem</span>
          </div>

          <div class="d-flex justify-content-center">
            <save-button id="show-btn" label="Adicionar EPI" @click.native="showEpiModal()" />
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
    </div>

    <!--
      Modal para adicionar EPIS
      -->
    <b-modal
      ref="epi-modal"
      centered
      hide-footer
      hide-header
      title="Cadastrar Epi na Ordem"
      @hide="resetModal()"
      @show="checkSelectedEpis()"
    >
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
        <cancel-button label="Fechar" @click.native="closeEpiModal()" />
        <save-button label="Adicionar" @click.native="addEpi()" />
      </div>
    </b-modal>

    <!--
      Modal para adicionar Operações
      -->
    <b-modal
      ref="operation-modal"
      centered
      hide-footer
      hide-header
      title="Cadastrar operações na Ordem"
      @hide="resetModal()"
      @show="checkSelectedOperations()"
    >
      <div class="d-block text">
        <div class="text-center">
          <h3>Adicionar Operações à ordem</h3>
          <span>
            Informe quais operações serão executas nesta ordem.
          </span>
        </div>
        <div class="m-3" style="overflow: auto; max-height: 300px;">
          <b-form-checkbox-group
            id="checkbox-operations"
            v-model="selectedOperations"
            :options="getOperationsOptions()"
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
        <cancel-button label="Fechar" @click.native="closeOperationModal()" />
        <save-button label="Adicionar" @click.native="addOperation()" />
      </div>
    </b-modal>
  </div>
</template>

<script>
import { getLocalStorageToken, getErrors } from '../../../utils/utils';
import { FormWizard, TabContent } from 'vue-form-wizard';
import 'vue-form-wizard/dist/vue-form-wizard.min.css';

export default {
  name: 'OrdemManutencaoCorretiva',

  components: {
    FormWizard,
    TabContent,
  },

  props: {
    orderType: { type: String, default: '' },
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
        equipment: '',
        requester: '',
        report: '',
        typeMaintenance: this.getOrdertype(),
        sector: '',
        priority: '',
        stats: 1,
        plannedTime: '',
        operations: [],
        epis: [],
        
      },
      selectedEpis: [],
      workEquipment: [],
      selectsPriority: [],
      selectsSector: [],
      selectsRequesterOptions: [],
      selectsReports: [],
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
      operationsList: [],

      showRemoveEpi: {},
      modalHasError: false,
      modalErrorMessage: '',
    };
  },

  mounted() {
    this.getEquipments();
    this.getSector();
    this.getPriority();
    this.getOperations();
    this.getRequester();
    this.getReporter();
  },

  methods: {
    resetModal() {
      this.modalHasError = false;
      this.modalErrorMessage = '';
      this.selectedEpis = [];
      this.selectedOperations = [];
    },
    getEpiOptions() {
      return this.epiList.map(i => ({ text: i.descricaoEpi, value: i.idEpi }));
    },
    getOperationsOptions() {
      return this.operationsList.map(i => ({ text: i.descricao_operacao, value: i.idoperacao }));
    },
    getEpiName(epi) {
      const { descricaoEpi } = this.epiList.find(i => i.idEpi === epi);
      return descricaoEpi;
    },
    getOperationName(operation) {
      const { descricao_operacao } = this.operationsList.find(i => i.idoperacao === operation);
      return descricao_operacao;
    },
    removeEpi(index) {
      this.inputValues.epis.splice(index, 1);
      this.$set(this.showRemoveEpi, [index], false);
    },
    removeOperation(index) {
      this.inputValues.operations.splice(index, 1);
      this.updateCurrentOperations();
    },
    updateCurrentOperations() {
      const updatedOperations = [];
      let sequenceOperation = 0;

      for (const option of this.inputValues.operations) {
        sequenceOperation += 10;

        const incrementOperationZero = this.incrementZero(sequenceOperation);

        const operationOption = {
          Operacao: option.Operacao,
          sequencia_operacao: incrementOperationZero + sequenceOperation,
        };

        updatedOperations.push(operationOption);
      }
      this.inputValues.operations = [...updatedOperations];
    },
    async showEpiModal() {
      await this.getEpis();

      this.$refs['epi-modal'].show();
    },
    showOperationModal() {
      this.$refs['operation-modal'].show();
    },
    closeEpiModal() {
      this.$refs['epi-modal'].hide();
    },
    closeOperationModal() {
      this.$refs['operation-modal'].hide();
    },
    confirmEpiModal() {
      this.$refs['epi-modal'].toggle('#toggle-btn');
      this.resetModal();
    },
    confirmOperationModal() {
      this.$refs['operation-modal'].toggle('#toggle-btn');
      this.resetModal();
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
    addEpi() {
      if (this.selectedEpis.length === 0) {
        this.modalHasError = true;
        this.modalErrorMessage = 'Selecione uma EPI antes de continuar';
      } else {
        this.inputValues.epis = this.selectedEpis.map(i => ({ Epi_idEpi: i }));
        this.confirmEpiModal();
      }
    },
    async addOperation() {
      if (this.selectedOperations.length === 0) {
        this.modalHasError = true;
        this.modalErrorMessage = 'Selecione uma operação antes de continuar';
      } else {
        const nonSelectedOperations = this.selectedOperations.filter((operation, index) => {
          if (!_.get(this.inputValues.operations[index], 'Operacao', ''))
            return operation;
          return '';
        });
        
        if (nonSelectedOperations.length === 0) return this.confirmOperationModal();

        let sequenceOperation = this.getLastSequence();

        for (const option of nonSelectedOperations) {
          sequenceOperation += 10;

          const incrementOperationZero = this.incrementZero(sequenceOperation);

          const operationOption = {
            Operacao: option,
            sequencia_operacao: incrementOperationZero + sequenceOperation,
          };

          this.inputValues.operations.push(operationOption);
        }
        this.confirmOperationModal();
      }
    },
    getLastSequence() {
      const lastSequencie = _.get(this.inputValues.operations[this.inputValues.operations.length - 1], 'sequencia_operacao', '');
      if (lastSequencie)
        return Number(lastSequencie.slice(2));
      return 0;
    },
    incrementZero(sequenceOperation) {
      if (sequenceOperation >= 100) return '0';
      return '00';
    },
    checkSelectedEpis() {
      if (this.inputValues.epis.length > 0)
        this.selectedEpis = this.inputValues.epis.map(i => i.Epi_idEpi);
    },
    checkSelectedOperations() {
      if (this.inputValues.operations.length > 0)
        this.selectedOperations = this.inputValues.operations.map(i => i.Operacao);
    },
    getOrdertype() {
      if (this.orderType === 'corretiva') return 1;
      return 2;
    },
    async registerOrderMaintenance() {
      try {
        this.$set(this.inputValues, 'beginData', this.$moment().format('YYYY-MM-DD'));

        await this.$http.post('ordem-manutencao', getLocalStorageToken(), this.inputValues);
        
        this.$swal({
          type: 'success',
          title: 'Ordem de Serviço cadastrada com Sucesso',
          confirmButtonColor: '#F34336',
        });

        this.$emit('reset:closeOrderMaintenance');
      } catch (err) {
        console.log('err :>> ', err.response || err);

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
    async getRequester() {
      try {
        const response = await this.$http.get('users/requester', getLocalStorageToken());

        if (response.result.length === undefined)
          this.selectsRequesterOptions.push(response.result);
        else this.selectsRequesterOptions = [...response.result];
        
      } catch (err) {
        return this.$swal({
          type: 'warning',
          title: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    async getReporter() {
      try {
        const response = await this.$http.get('users/report', getLocalStorageToken());
        console.log('Reporter: ',response);
        if (response.result.length === undefined)
          this.selectsReports.push(response.result);
        else this.selectsReports = [...response.result];
        
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
    selectsRequireStopOptions() {
      return this.selectsRequireStop.map(i => ({ id: String(i.id), description: i.nome }));
    },
    selectsRequestersOptions() {
      return this.selectsRequesterOptions.map(i => ({ id: String(i.idUsuario), description: i.nome }));
    },
    selectsReportOptions(){
      return this.selectsReports.map(i => ({ id: String(i.idUsuario), description: i.nome }));
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
        console.log('err getSectorOptions :>> ', err.response || err);

        return this.$swal({
          type: 'warning',
          title: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    async getOperations() {
      try {
        const { result } = await this.$http.get('operacoes/get', getLocalStorageToken());
        this.operationsList = [...result];
      } catch (err) {
        console.log('err getOperations :>> ', err.response || err);

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
      .seleted-operation-item {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 8px;
        padding: 20px;
        i {
          color: #555;
        }
        &:hover {
          background-color: #eee;
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
  }
}
@media (max-width: 1366px) {
  .content-wrapper {
    width: 100% !important;
  }
}
</style>
