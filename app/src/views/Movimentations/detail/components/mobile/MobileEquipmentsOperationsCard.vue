<template>
  <section class="root-mobile-equipments-operations-card">
    <div class="d-flex justify-content-center align-items-center" style="margin-top: 50px; margin-bottom: 20px;">
      <i class="fa fa-laptop mr-2 fa-lg" style="color: var(--duas-rodas-soft)" />
      <p class="smart" style="font-size: 20px;">{{ getCustomTitle }} </p>
    </div>

    <div class="equipments-container">
      <card full-width>
        <div class="d-flex flex-column">
          <div
            v-for="(equipment, index) in equipmentsOperations.equipments"
            :key="`equipment-${index}`"
          >
            <div
              class="equipment-list"
              :class="{
                'selected': isOperationsOpen[index],
                'checked': isOperationsChecked(equipment)
              }"
            >
              <div class="d-flex flex-column">
                <h4 class="smart">
                  <strong class="d-flex">
                    Equipamento: {{ index + 1 }}

                    <div v-if="isOperationsChecked(equipment)" class="mx-2">
                      <i class="fa fa-check fa-lg text-success" />
                    </div>
                  </strong>
                </h4>

                <div class="d-flex flex-column m-2">
                  <div class="d-flex flex-column my-1">
                    <strong>
                      {{ equipment.equipamento }}
                    </strong>

                    <span>
                      {{ equipment.descricao }}
                    </span>
                  </div>

                  <div class="d-flex flex-column my-1">
                    <strong>
                      Equipamento superior:
                    </strong>
                    <span>
                      {{ equipment.equipamentoSuperior }}
                    </span>
                  </div>

                  <div class="d-flex flex-column">
                    <strong>
                      Setor:
                    </strong>
                    <span>
                      {{ equipment.setor }}
                    </span>
                  </div>
                </div>

                <div v-if="equipment.operations" class="mt-3">
                  <smart-button
                    simple
                    circle
                    full-width
                    no-effect
                    :disabled="!isOrderAssumed"
                    @click.native="toggleOperations(index)"
                  >
                    <span>
                      <i class="fa" :class="isOperationsOpen[index] ? 'fa-chevron-up' : 'fa-chevron-down'" />
                      Operações
                    </span>
                  </smart-button>
                </div>
              </div>
            </div>

            <transition name="slide-down" mode="out-in">
              <div v-if="isOperationsOpen[index]" class="mx-3 d-flex flex-column">
                <div
                  v-for="(operation, operationIndex) in equipment.operations"
                  :key="`operation-${operationIndex}`"
                  class="operation-list"
                  :class="{
                    'checked': isOperationsChecked(equipment)
                  }"
                  @click.prevent="checkOperation(operation, equipment)"
                >
                  <div class="d-flex align-items-center">
                    <b-form-checkbox
                      :id="`checkbox-operation-${operationIndex}`"
                      v-model="checkedOperation[`${equipment.idEquipamento}-${operation.id_operacoes}`]"
                      name="check-operation"
                      stacked
                    />

                    <div class="d-flex flex-column ml-4">
                      <div class="d-flex flex-column justify-content-center">
                        <strong :class="checkedOperation[operation.id_operacoes] ? 'checked' : ''">
                          Sequência da operação:
                        </strong>
                        <span :class="checkedOperation[operation.id_operacoes] ? 'checked' : ''">
                          {{ operation.sequencia_operacao }}
                        </span>
                      </div>

                      <div class="d-flex flex-column">
                        <strong :class="checkedOperation[operation.id_operacoes] ? 'checked' : ''">
                          Operação:
                        </strong>
                        <span :class="checkedOperation[operation.id_operacoes] ? 'checked' : ''">
                          {{ operation.descricao_operacao }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <hr v-if="operationIndex < (equipment.operations.length -1)">
                </div>
              </div>
            </transition>

            <hr v-if="index < (equipmentsOperations.equipments.length - 1)">
          </div>
        </div>
      </card>
    </div>
  </section>
</template>

<script>
import { getErrors } from '../../../../../utils/utils';

export default {
  name: 'MobileEquipmentsOperationsCard',
  props: {
    equipmentsOperations: { type: Object, default: () => ({}) },
    masterMaintainer: { type: Object, default: () => ({}) },
    isOrderAssumed: { type: Boolean, default: false },
    orderType: { type: String, default: '' },
    orderId: { type: Number, default: null },
  },
  data() {
    return {
      checkedOperation: {},
      isOperationsOpen: {},
    };
  },
  computed: {
    getCustomTitle() {
      if (this.orderType === 'Corretiva')
        return 'Equipamentos';
      return 'Equipamentos e Operações';
    },
  },
  mounted() {
    this.validateCheckedOperations();
  },
  methods: {
    isOperationsChecked(equipment) {
      if (this.orderType === 'Corretiva') return false;
      
      const isOperationsChecked = equipment.operations.every(operation => {
        if (this.checkedOperation[`${equipment.idEquipamento}-${operation.id_operacoes}`])
          return true;
        return false;
      });

      return isOperationsChecked;
    },
    async checkOperation({ id_operacoes }, { idEquipamento, id_equipamentos }) {
      try {
        await this.$http.post('operacoes/check', {
          operation: id_operacoes,
          equipment: id_equipamentos,
          order: this.orderId,
        });
        
        this.$set(
          this.checkedOperation,
          `${idEquipamento}-${id_operacoes}`,
          !this.checkedOperation[`${idEquipamento}-${id_operacoes}`],
        );
      } catch (err) {
        console.log('err checkOperation :>> ', err);

        this.$swal({
          type: 'warning',
          html: getErrors(err),
        });
      }
    },
    validateCheckedOperations() {
      if (this.orderType === 'Corretiva') return;

      const checkedOperations = this.equipmentsOperations.equipments.reduce((acc, equipment) => {
        acc.push(equipment.operations.map(operation => {
          return (operation.execucao && operation.idEquipamento === equipment.idEquipamento)
            ? { ...operation, idEquipamento: equipment.idEquipamento }
            : undefined;
        }).filter(i => i));
        
        return acc;
      }, []).flat(2);


      checkedOperations.forEach(operation => {
        this.$set(
          this.checkedOperation,
          `${operation.idEquipamento}-${operation.id_operacoes}`,
          !this.checkedOperation[`${operation.idEquipamento}-${operation.id_operacoes}`],
        );
      });
    },
    toggleOperations(index) {
      if (!this.isOrderAssumed) return;

      if (!this.isOperationsOpen[index])
        this.resetOpenOperations();

      this.$set(this.isOperationsOpen, [index], !this.isOperationsOpen[index]);
    },
    resetOpenOperations() {
      this.isOperationsOpen = {};
    },
  },
};
</script>

<style lang="scss" scoped>
.root-mobile-equipments-operations-card {
  margin: 0 10px;
  .equipments-container {
    margin: 20px 0;
    .equipment-list {
      padding: 20px 10px;
      margin: 5px;
      border-radius: 10px;
      &:hover {
        background-color: #eee;
      }
      &.selected {
        background-color: #eee;
      }
      &.checked {
        opacity: 0.6;
        span, strong {
          color: rgb(60, 167, 86);

        }
      }
    }
    .operation-list {
      margin: 5px;
      border-radius: 10px;
      cursor: pointer;
      &:hover {
        background-color: #eee;
      }
      &.checked {
        opacity: 0.6;
        // color: #ddd;
        text-decoration: line-through;
      }
    }
  }
}
</style>
