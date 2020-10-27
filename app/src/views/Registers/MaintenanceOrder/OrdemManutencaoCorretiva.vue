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
          <tab-content
            title="Causa"
            icon="fas fa-exclamation-triangle"
            :before-change="causeFields"
          >
            <div class="d-flex w-100">
              <div class="mx-1 w-100">
                <smart-input-text
                  id="title"
                  v-model="inputValues.title"
                  name="title"
                  placeholder="Título"
                  label="Título"
                  :error-label="inputFieldsError.title"
                />
              </div>

              <div class="mx-1 w-100">
                <smart-input-text
                  id="summary"
                  v-model="inputValues.summary"
                  name="summary"
                  placeholder="Resumo"
                  label="Resumo"
                  :error-label="inputFieldsError.summary"
                />
              </div>
            </div>
            
            <div class="mx-1 mt-2">
              <div class="w-100">
                <smart-input-textarea
                  id="description"
                  v-model="inputValues.description"
                  name="summary"
                  placeholder="Resumo"
                  :label="(orderType === 'corretiva') ? 'Descrição do problema: ' : 'Observações: (opcional)'"
                  :error-label="inputFieldsError.description"
                />
              </div>
            </div>
          </tab-content>

          <!--
            Step para informada o inicio planejado e o fim planejado da ordem
          -->
          <tab-content
            title="Datas"
            icon="fa fa-clock"
            :before-change="datesFields"
          >
            <div class="d-flex">
              <div class="mx-1 w-100">
                <smart-input-date
                  id="plannedStart"
                  v-model="inputValues.plannedStart"
                  name="plannedStart"
                  label="Inicio Planejado"
                  placeholder="Inicio Planejado"
                  :error-label="inputFieldsError.plannedStart"
                />
                <!-- <simple-input
                /> -->
              </div>
              <div class="mx-1 w-100">
                <smart-input-date
                  id="plannedEnd"
                  v-model="inputValues.plannedEnd"
                  name="plannedEnd"
                  label="Fim Planejado"
                  placeholder="Fim Planejado"
                  :error-label="inputFieldsError.plannedEnd"
                />
              </div>
            </div>
          </tab-content>

          <!--
            Step para selecionar os equipamentos, prioridade, setor e se querer parada
          -->
          <tab-content
            title="Detalhamento geral"
            icon="fas fa-info-circle"
            :before-change="generalDetailFields"
          >
            <div class="d-flex">
              <div class="m-2 w-100">
                <smart-input-select
                  id="sector"
                  v-model="inputValues.sector"
                  label="Setor"
                  :options="getSectorOptions()"
                  :error-label="inputFieldsError.sector"
                  @input="getEquipments()"
                />
              </div>

              <div class="m-2 w-100">
                <smart-input-select
                  id="equipment"
                  v-model="inputValues.equipment"
                  label="Equipamento"
                  :disabled="!workEquipment.length"
                  :options="getEquipmentsOptions()"
                  :error-label="inputFieldsError.equipment"
                />
              </div>
            </div>

            <div class="d-flex">
              <div class="m-2 w-100">
                <smart-input-select
                  id="priority"
                  v-model="inputValues.priority"
                  label="Prioridade"
                  :options="getPriorityOptions()"
                  :error-label="inputFieldsError.priority"
                />
              </div>

              <div class="m-2 w-100">
                <smart-input-select
                  id="requireStop"
                  v-model="inputValues.requireStop"
                  label="Requer Parada"
                  :options="selectsRequireStopOptions()"
                  :error-label="inputFieldsError.requireStop"
                />
              </div>
            </div>

            <div class="d-flex">
              <div class="m-2 w-100">
                <smart-input-select
                  id="requester"
                  v-model="inputValues.requester"
                  label="Solicitante"
                  :options="selectsRequestersOptions()"
                  :error-label="inputFieldsError.requester"
                />
              </div>

              <div class="m-2 w-100">
                <smart-input-select
                  id="report"
                  v-model="inputValues.report"
                  label="Reporte"
                  :options="selectsReportOptions()"
                  :error-label="inputFieldsError.report"
                />
              </div>
            </div>
          </tab-content>

          <!--
            Step para definir quais as operações que a ordem deve ter
          -->
          <tab-content
            v-if="orderType === 'preventiva'"
            title="Operações"
            icon="fa fa-cog"
          >
            <div class="epi-title">
              <span>Selecione as operações para está ordem</span>
            </div>

            <div class="d-flex justify-content-center">
              <smart-button id="show-btn" primary @click.native="showOperationModal()">
                <span>Adicionar Operação</span>
              </smart-button>
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
                      <i class="fa fa-trash fa-lg scalable-btn" @click="removeOperation(index)" />
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
            <div class="epi-title">
              <span>Selecione as EPIs para está ordem</span>
            </div>

            <div class="d-flex justify-content-center">
              <smart-button id="show-btn" @click.native="showEpiModal()">
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
        <div class="mx-1">
          <smart-button
            @click.native="closeEpiModal"
          >
            <span>Fechar</span>
          </smart-button>
        </div>

        <div class="mx-1">
          <smart-button
            primary
            @click.native="addEpi"
          >
            <span>Adicionar</span>
          </smart-button>
        </div>
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
        <div class="mx-1">
          <smart-button
            @click.native="closeOperationModal"
          >
            <span>Fechar</span>
          </smart-button>
        </div>

        <div class="mx-1">
          <smart-button
            primary
            @click.native="addOperation"
          >
            <span>Adicionar</span>
          </smart-button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { FormWizard, TabContent } from 'vue-form-wizard';
import 'vue-form-wizard/dist/vue-form-wizard.min.css';
import { getErrors } from '../../../utils/utils';
import {
  causeFields,
  datesFields,
  generalDetailFields,
} from './utils/validations';

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
      isLoading: false,
      inputFieldsError: {},
    };
  },
  watch: {
    inputValues: {
      handler() {
        this.inputFieldsError = {};
      },
      deep: true,
    },
  },
  created() {
    this.isLoading = true;
    this.getSequencialData();
  },
  methods: {
    async getSequencialData() {
      try {
        await this.getSector();
        await this.getPriority();
        await this.getRequester();
        await this.getReporter();
        
        this.isLoading = false;
      } catch (err) {
        console.log('err getSequencialData :>> ', err.response || err);

        this.$swal({
          type: 'warning',
          html: getErrors(err),
        });
      }
    },
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
    async showOperationModal() {
      await this.getOperations();

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
        const response = await this.$http.get('epi');

        if (response.length === undefined)
          this.epiList.push(response);
        else this.epiList = [...response];
      } catch (err) {
        console.log('err :>> ', err.response || err);

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
        this.modalErrorMessage = 'Selecione um EPI antes de continuar';
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

        await this.$http.post('ordem-manutencao', this.inputValues);
        
        await this.$swal({
          type: 'success',
          text: 'Ordem de Serviço cadastrada com Sucesso',
          confirmButtonColor: '#F34336',
        });

        this.$emit('reset:closeOrderMaintenance');
      } catch (err) {
        console.log('err registerOrderMaintenance :>> ', err.response || err);

        return this.$swal({
          type: 'warning',
          html: getErrors(err),
          confirmButtonColor: '#F34336',
        });
      }
    },
    causeFields() {
      const errors = causeFields({
        title: this.inputValues.title,
        summary: this.inputValues.summary,
        orderType: this.orderType,
        description: this.inputValues.description,
      });

      return this.checkFields(errors);
    },
    datesFields() {
      const errors = datesFields({
        plannedStart: this.inputValues.plannedStart,
        plannedEnd: this.inputValues.plannedEnd,
      });

      return this.checkFields(errors);
    },
    generalDetailFields() {
      const errors = generalDetailFields({
        sector: this.inputValues.sector,
        equipment: this.inputValues.equipment,
        priority: this.inputValues.priority,
        requireStop: this.inputValues.requireStop,
        requester: this.inputValues.requester,
        report: this.inputValues.report,
      });

      return this.checkFields(errors);
    },
    checkFields(errors) {
      if (Object.keys(errors).length) {
        this.inputFieldsError = { ...errors };
        return false;
      }

      return true;
    },
    async getEquipments() {
      try {
        const response = await this.$http.get('equipamento', {
          headers: { sector: this.inputValues.sector },
        });

        console.log('response :>> ', response);

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
          headers: { type: 'reporter' },
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
    getEquipmentsOptions() {
      return this.workEquipment.map(i => ({ id: String(i.idEquipamento), description: i.equipamento }));
    },
    selectsRequireStopOptions() {
      return this.selectsRequireStop.map(i => ({ id: i.id, description: i.nome }));
    },
    selectsRequestersOptions() {
      return this.selectsRequesterOptions.map(i => ({ id: String(i.idUsuario), description: i.nome }));
    },
    selectsReportOptions() {
      return this.selectsReports.map(i => ({ id: String(i.idUsuario), description: i.nome }));
    },
    getSectorOptions() {
      return this.selectsSector.map(i => ({ id: String(i.idSetor), description: i.nome }));
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
  .step-by-step{
    width:100%;
    .epi-title {
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
</style>
