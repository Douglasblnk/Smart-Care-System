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
            title="Título"
            icon="fas fa-align-left"
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
            Step para selecionar a prioridade, setor e se querer parada
          -->
          <tab-content
            title="Informações Gerais"
            icon="fas fa-check"
            :before-change="generalDetailFields"
          >
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
            Step para selecionar os equipamentos
          -->
          <tab-content  title="Equipamentos" icon="fas fa-check">
            <div class="w-100 d-flex justify-content-center">
              <span style="font-size: 22px">Selecione o setor e os equipamentos</span>
            </div>
            <div>
              <smart-input-select
                id="sector"
                v-model="selectedSector"
                label="Setor"
                :options="getSectorOptions()"
              />

              <smart-input-select
                id="equipment"
                v-model="equipment"
                label="Equipamento"
                :disabled="!selectedSector"
                :options="getEquipmentOptions()"
              />
              <div>
                <div class="operations-title">
                  <span class="text-center">Selecione as operações para os equipamentos</span>
                </div>

                <div class="d-flex justify-content-center">
                  <smart-button primary @click.native="showOperationModal()">
                    <span>Adicionar Operação</span>
                  </smart-button>
                </div>
                
                <div class="operations-items">
                  <label>Operações selecionadas:</label>
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
              </div>
              <div class="d-flex justify-content-center">
                <smart-button simple @click.native="addEquipmentSectorOperations()">
                  <span>Vincular equipamento com a operação</span>
                </smart-button>
              </div>

              <div v-if="inputValues.equipments_sectors_operations.length > 0" class="operations-equipment-list-wrapper">
                <label>Operações vinculadas: </label>
                <div class="">
                  <div
                    v-for="(vinculatedOperation, index) in inputValues.equipments_sectors_operations"
                    :key="`vinculatedOperation-${index}`"
                    class="operation-equipment-itens"
                  >
                    <div class="d-flex flex-column">
                      <strong>{{ getEquipmentName(vinculatedOperation.Equipamento) }}</strong>
                      <span>{{ getSectorName(vinculatedOperation.Local) }}</span>

                      <accordion icon="fa fa-cogs" title="Operações">
                        <div class="ml-3 mr-3 d-flex flex-wrap">
                          <div
                            v-for="(op, index) in vinculatedOperation.operationList"
                            :key="`operation-${index}`"
                          >
                            <div class="selected-operation-wrapper">
                              <span>{{ op.sequencia_operacao }} - {{ getOperationName(op.Operacao) }}</span>
                            </div>
                          </div>
                        </div>
                      </accordion>
                    </div>
                  </div>
                </div>
              </div>
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
        <div class="m-3">
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
          <smart-button @click.native="closeEpiModal">
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
          <smart-button @click.native="closeOperationModal">
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
        equipments_sectors_operations: [],
      },
      selectedEpis: [],
      workEquipment: [],
      selectsPriority: [],
      sectors: [],
      selectedSector: '',
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
      inputFieldsError: {},
      isLoading: false,
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
        await this.getEquipments();
        await this.getSector();
        await this.getPriority();
        await this.getOperations();
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
    async addEquipmentSectorOperations() {
      try {
        this.validateSelectedFields();

        const EquipmentSectorOperations = {
          Equipamento: this.equipment,
          Local: this.selectedSector,
          operationList: this.inputValues.operations,
        };

        this.inputValues.equipments_sectors_operations.push(EquipmentSectorOperations);

        this.$swal({
          type: 'success',
          text: 'Equipamento e Setor vinculados as operações!',
          toast: true,
          position: 'top-right',
          showConfirmButton: false,
          timer: 3000,
          confirmButtonColor: '#F34336',
        });

        this.resetVinculateOperation();
      } catch (err) {
        console.log('err addEquipmentSectorOperations :>> ', err);

        this.$swal({
          type: 'warning',
          title: err,
        });
      }
    },
    resetVinculateOperation() {
      this.equipment = '';
      this.selectedSector = '';
      this.$set(this.inputValues, 'operations', []);
    },
    validateSelectedFields() {
      if (!this.selectedSector)
        throw 'Nenhum setor selecionado!';
      
      if (!this.equipment)
        throw 'Nenhum equipamento selecionado!';

      if (this.inputValues.operations.length === 0)
        throw 'Nenhuma operação selecionada!';
    },
    getEpiOptions() {
      return this.epiList.map(i => ({ text: i.descricaoEpi, value: i.idEpi }));
    },
    getOperationsOptions() {
      return this.operationsList.map(i => ({ text: i.descricao_operacao, value: i.idoperacao }));
    },
    getEquipmentOptions() {
      return this.workEquipment
        .filter(i => i.Setor_idSetor === Number(this.selectedSector))
        .map(m => ({ id: String(m.idEquipamento), description: m.descricao }));
    },
    getEpiName(epi) {
      const { descricaoEpi } = this.epiList.find(i => i.idEpi === epi);
      return descricaoEpi;
    },
    getOperationName(operation) {
      const { descricao_operacao } = this.operationsList.find(i => i.idoperacao === operation);
      return descricao_operacao;
    },
    getEquipmentName(equipment) {
      const { descricao } = this.workEquipment.find(i => i.idEquipamento === Number(equipment));
      return descricao;
    },
    getSectorName(sector) {
      const { nome } = this.sectors.find(i => i.idSetor === Number(sector));
      return nome;
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
    removeEpi(index) {
      this.inputValues.epis.splice(index, 1);
      this.$set(this.showRemoveEpi, [index], false);
    },
    async showEpiModal() {
      await this.getEpis();

      this.$refs['epi-modal'].show();
    },
    closeEpiModal() {
      this.$refs['epi-modal'].hide();
    },
    confirmEpiModal() {
      this.$refs['epi-modal'].toggle('#toggle-btn');
      this.resetModal();
    },
    closeOperationModal() {
      this.$refs['operation-modal'].hide();
    },
    confirmOperationModal() {
      this.$refs['operation-modal'].toggle('#toggle-btn');
      this.resetModal();
    },
    showOperationModal() {
      this.$refs['operation-modal'].show();
    },
    checkSelectedOperations() {
      if (this.inputValues.operations.length > 0)
        this.selectedOperations = this.inputValues.operations.map(i => i.Operacao);
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
    async registerOrderMaintenance() {
      try {
        this.$set(this.inputValues, 'beginData', this.$moment().format('YYYY-MM-DD'));
        console.log('this.inputValues :>> ', this.inputValues);
        // await this.$http.post('ordem-manutencao', this.inputValues);

        this.$swal({
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
        moment: this.$moment,
      });

      console.log('errors :>> ', errors);
      return this.checkFields(errors);
    },
    generalDetailFields() {
      const errors = generalDetailFields({
        priority: this.inputValues.priority,
        requireStop: this.inputValues.requireStop,
        requester: this.inputValues.requester,
        report: this.inputValues.report,
        orderType: this.orderType,
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
          headers: { sector: this.selectedSector },
        });
        console.log('this.workEquipment :>> ', this.workEquipment);
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
    selectsRequireStopOptions() {
      return this.selectsRequireStop.map(i => ({ id: String(i.id), description: i.nome }));
    },
    async getSector() {
      try {
        const response = await this.$http.get('local-instalacao');

        if (response.length === undefined)
          this.sectors.push(response);
        else this.sectors = [...response];
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
      return this.sectors.map(i => ({ id: String(i.idSetor), description: i.nome }));
    },
    selectsRequestersOptions() {
      return this.selectsRequesterOptions.map(i => ({ id: String(i.idUsuario), description: i.nome }));
    },
    selectsReportOptions() {
      return this.selectsReports.map(i => ({ id: String(i.idUsuario), description: i.nome }));
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
  .step-by-step {
    width:100%;
    .operations-title {
      display: flex;
      justify-content: center;
      font-size: 22px;
      margin-top: 20px;
    }
    .operations-items {
      max-height: 350px;
      overflow: auto;
      margin: 20px;
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
    .selected-operation-wrapper {
      min-width: 50px;
      padding: 5px 20px;
      margin: 5px;
      border-radius: 100px;
      background-color: #ddd;
      user-select: none;
    }
    .operations-equipment-list-wrapper {
      margin: 20px 0;
      .operation-equipment-itens {
        padding: 10px 20px;
        border-radius: 9px;
        &:hover {
          background-color: #eee;
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
