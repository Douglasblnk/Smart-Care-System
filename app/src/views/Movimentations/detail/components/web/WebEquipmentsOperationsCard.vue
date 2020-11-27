<template>
  <section class="root-web-equipments-operations-card">
    <div class="equipments-container">
      <card
        full-width
        advanced-card
        :open="false"
        :custom-title="getCustomTitle"
        icon="fa-laptop"
        @collapsed="resetOpenOperations"
      >
        <div class="d-flex flex-column" :class="!isOrderAssumed ? 'blocked' : ''">
          <div
            v-for="(equipment, index) in equipmentsOperations.equipments"
            :key="`equipment-${index}`"
          >
            <div
              class="equipment-list"
              :class="isOperationsOpen[index] ? 'selected' : ''"
            >
              <div class="d-flex align-items-center col-md-1 no-padding">
                <strong class="d-flex" :class="isOperationsChecked ? 'checked' : ''">
                  {{ index + 1 }}
                  <div v-if="isOperationsChecked" class="mx-2">
                    <i class="fa fa-check fa-lg text-success" />
                  </div>
                </strong>
              </div>

              <div class="col-md-4 no-padding">
                <div class="d-flex flex-column">
                  <strong :class="isOperationsChecked ? 'checked' : ''">
                    {{ equipment.equipamento }}
                  </strong>

                  <span :class="isOperationsChecked ? 'checked' : ''">
                    {{ equipment.descricao }}
                  </span>
                </div>
              </div>

              <div class="col-md-4 no-padding">
                <div class="d-flex flex-column">
                  <strong :class="isOperationsChecked ? 'checked' : ''">
                    Equipamento superior:
                  </strong>
                  <span :class="isOperationsChecked ? 'checked' : ''">
                    {{ equipment.equipamentoSuperior }}
                  </span>
                </div>
              </div>

              <div class="col-md-1 no-padding">
                <div class="d-flex flex-column">
                  <strong :class="isOperationsChecked ? 'checked' : ''">
                    Setor:
                  </strong>
                  <span :class="isOperationsChecked ? 'checked' : ''">
                    {{ equipment.setor }}
                  </span>
                </div>
              </div>
              
              <div v-if="equipment.operations" class="d-flex justify-content-end align-items-center col-md-2 no-padding">
                <smart-button
                  simple
                  circle
                  no-effect
                  :disabled="!isOrderAssumed"
                  @click.native="toggleOperations(index)"
                >
                  <span>
                    <i class="fa" :class="isOperationsOpen[index] ? 'fa-chevron-down' : 'fa-chevron-up'" />
                    Operações
                  </span>
                </smart-button>
              </div>
            </div>

            <transition name="slide-down" mode="out-in">
              <div v-if="isOperationsOpen[index]" class="mx-3 d-flex flex-column">
                <div
                  v-for="(operation, index) in equipment.operations"
                  :key="`operation-${index}`"
                  class="operation-list"
                  @click.prevent="checkOperation(operation, equipment)"
                >
                  <div class="d-flex col-md-1 no-padding">
                    <b-form-checkbox
                      :id="`checkbox-operation-${index}`"
                      v-model="checkedOperation[`${equipment.idEquipamento}-${operation.id_operacoes}`]"
                      name="check-operation"
                      stacked
                    />
                  </div>

                  <div class="d-flex flex-column justify-content-center col-md-3 no-padding">
                    <strong :class="checkedOperation[operation.id_operacoes] ? 'checked' : ''">
                      Sequência da operação:
                    </strong>
                    <span :class="checkedOperation[operation.id_operacoes] ? 'checked' : ''">
                      {{ operation.sequencia_operacao }}
                    </span>
                  </div>

                  <div class="col-md-5 no-padding">
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
              </div>
            </transition>
          </div>
        </div>
      </card>
    </div>
  </section>
</template>

<script>
export default {
  name: 'WebEquipmentsOperationCard',
  props: {
    equipmentsOperations: { type: Object, default: () => ({}) },
    masterMaintainer: { type: Object, default: () => ({}) },
    isOrderAssumed: { type: Boolean, default: false },
    orderType: { type: String, default: () => '' },
  },
  data() {
    return {
      checkedOperation: {},
      isOperationsOpen: {},
    };
  },
  computed: {
    isOperationsChecked() {
      return false;
    },
    getCustomTitle() {
      if (this.orderType === 'Corretiva')
        return 'Equipamentos';
      return 'Equipamentos e Operações';
    },
  },
  methods: {
    async checkOperation({ id_operacoes }, { idEquipamento }) {
      try {
        console.log('poxa', this.masterMaintainer);
        const response = await this.$http.post('operacoes/check', { operation: id_operacoes });
        
        this.$set(
          this.checkedOperation,
          `${idEquipamento}-${id_operacoes}`,
          !this.checkedOperation[`${idEquipamento}-${id_operacoes}`],
        );
      } catch (err) {
        console.log('err checkOperation :>> ', err);
      }
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
.root-web-equipments-operations-card {
  .equipments-container {
    margin-top: 40px;
    .equipment-list {
      display: flex;
      padding: 20px;
      margin: 5px;
      border-radius: 10px;
      &:hover {
        background-color: #eee;
      }
      &.selected {
        background-color: #eee;
      }
      .checked {
        color: rgb(60, 167, 86);
        opacity: 0.4;
      }
    }
    .operation-list {
      display: flex;
      align-items: center;
      padding: 20px;
      margin: 5px;
      border-radius: 10px;
      cursor: pointer;
      &:hover {
        background-color: #eee;
      }
      .checked {
        color: #ddd;
        text-decoration: line-through;
      }
    }
    .blocked {
      opacity: 0.4;
    }
  }
}
</style>