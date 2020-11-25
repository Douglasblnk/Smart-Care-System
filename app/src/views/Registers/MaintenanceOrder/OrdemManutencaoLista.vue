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

      <card v-if="!isLoading" key="orderForm" class="m-3">
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
            icon="fas fa-info-circle"
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
          <tab-content
            title="Equipamentos"
            icon="fas fa-toolbox"
            :before-change="equipmentsFields"
          >
            <div class="w-100 d-flex justify-content-center">
              <span style="font-size: 22px">Selecione os equipamentos</span>
            </div>

            <div class="d-flex flex-column">
              <smart-input-select
                id="sector"
                v-model="sector"
                label="Setor"
                :options="getSectorOptions()"
              />

              <smart-input-select
                id="equipment"
                v-model="equipment"
                label="Equipamento"
                :disabled="!sector"
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

            <div v-if="inputValues.equipments_sectors.length">
              <span>Equipamentos selecionados:</span>

              <div
                v-for="(equipment, index) in inputValues.equipments_sectors"
                :key="`equipment-${index}`"
              >
                <div class="selected-equipments" style="padding: 15px;">
                  <div class="d-flex align-items-center">
                    <i class="fa fa-toolbox text-muted fa-2x" />

                    <div class="d-flex flex-column mx-3">
                      <strong>{{ getEquipmentName(equipment.Equipamento) }}</strong>
                      <span>{{ getEquipmentSectorName(equipment.Local) }}</span>
                    </div>
                  </div>

                  <div class="cursor-pointer">
                    <i class="fa fa-trash text-muted scalable-btn" @click="removeEquipment(index)" />
                  </div>
                </div>
              </div>
            </div>

            <transition name="fade">
              <div v-if="inputFieldsError.equipmentsSectors" class="text-center mt-4">
                <span class="text-danger">{{ inputFieldsError.equipmentsSectors }}</span>
              </div>
            </transition>
          </tab-content>

          <!--
            Step para definir quais as operações que a ordem deve ter
          -->
          <tab-content
            title="Operações"
            icon="fa fa-list-ol"
            :before-change="operationsFields"
          >
            <div class="operations-title">
              <span>Selecione as operações para os equipamentos</span>
              <small class="text-muted">
                Todas as operações serão aplicadas para todos os equipamentos previamente selecionados
              </small>
            </div>

            <div v-if="inputValues.equipments_sectors.length">
              <span>Equipamentos selecionados: </span>

              <div class="d-flex flex-wrap">
                <div
                  v-for="(equipment, index) in inputValues.equipments_sectors"
                  :key="`equipment-${index}`"
                  class="m-1"
                >
                  <div class="selected-equipments" style="padding: 10px;">
                    <div class="d-flex align-items-center">
                      <i class="fa fa-toolbox text-muted fa-lg" />

                      <div class="d-flex flex-column mx-2">
                        <strong>{{ getEquipmentName(equipment.Equipamento) }}</strong>
                        <span>{{ getEquipmentSectorName(equipment.Local) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <span>Operações:</span>

            <div v-if="selectedOperations.length" class="d-flex flex-wrap">
              <div
                v-for="(item, index) in selectedOperations"
                :key="`item-${index}`"
                class="operation-list"
              >
                <small>
                  {{ getOperationName(item) }}
                </small>
              </div>
            </div>

            <div class="operations-items">
              <b-form-checkbox-group
                id="checkbox-operations"
                v-model="selectedOperations"
                :options="getOperationsOptions()"
                name="flavour-1"
                stacked
              />
            </div>

            <div v-if="inputFieldsError.selectedOperations" class="text-center">
              <span class="text-danger">{{ inputFieldsError.selectedOperations }}</span>
            </div>
          </tab-content>

          <!--
            Step para definir quais EPIs são necessárias para a ordem
          -->
          <tab-content
            title="Epi"
            icon="fa fa-hard-hat"
          >
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

      this.resetEquipmentFields();
    },
    resetEquipmentFields() {
      this.sector = '';
      this.equipment = '';
    },
    getEpiOptions() {
      return this.epiList.map(i => ({ text: i.descricaoEpi, value: i.idEpi }));
    },
    getOperationsOptions() {
      return this.operationsList.map(i => ({ text: i.descricao_operacao, value: i.idoperacao }));
    },
    getEquipmentOptions() {
      return this.workEquipment
        .filter(i => i.Setor_idSetor === Number(this.sector))
        .map(m => ({ id: String(m.idEquipamento), description: m.descricao }));
    },
    getEpiName(epi) {
      const { descricaoEpi } = this.epiList.find(i => i.idEpi === epi);
      return descricaoEpi;
    },
    removeEpi(index) {
      this.inputValues.epis.splice(index, 1);
      this.$set(this.showRemoveEpi, [index], false);
    },
    removeEquipment(index) {
      this.inputValues.equipments_sectors.splice(index, 1);
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
      if (this.inputValues.operations.length)
        this.inputValues.operations = [];

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
    getPriorityOptions() {
      return this.selectsPriority.map(i => ({ id: String(i.idPrioridade), description: i.descricaoPrioridade }));
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
    getSectorOptions() {
      return this.selectsSector.map(i => ({ id: String(i.idSetor), description: i.nome }));
    },
    getEquipmentName(equipmentId) {
      return this.workEquipment.find(i => Number(i.idEquipamento) === Number(equipmentId)).descricao;
    },
    getEquipmentSectorName(equipmentSector) {
      return this.selectsSector.find(i => Number(i.idSetor) === Number(equipmentSector)).nome;
    },
    getOperationName(operationId) {
      return this.operationsList.find(i => Number(i.idoperacao) === Number(operationId)).descricao_operacao;
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
    equipmentsFields() {
      const errors = {
        ...(!this.inputValues.equipments_sectors.length ? { equipmentsSectors: 'Equipamento não informado!' } : ''),
      };

      return this.checkFields(errors);
    },
    operationsFields() {
      const errors = {
        ...(!this.selectedOperations.length ? { selectedOperations: 'Operações não informadas!' } : ''),
      };

      if (!this.checkFields(errors))
        return false;
      
      this.addOperation();
      return true;
    },
    checkFields(errors) {
      if (Object.keys(errors).length) {
        this.inputFieldsError = { ...errors };
        return false;
      }

      return true;
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
      flex-direction: column;
      justify-content: center;
      align-items: center;
      span {
        font-size: 22px;
      }
    }
    .operations-items {
      overflow: auto;
      max-height: 300px;
      margin: 10px;
    }
    .operation-list {
      background-color: #eee;
      border-radius: 50px;
      padding: 3px 15px;
      margin: 5px;
    }
    .selected-equipments {
      display: flex;
      justify-content: space-between;
      border-radius: 8px;
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
@media (max-width: 1366px) {
  .content-wrapper {
    width: 100% !important;
  }
}
</style>
