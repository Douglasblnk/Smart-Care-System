<template>
  <b-modal
    ref="chooseMaintainerModal"
    centered
    hide-footer
    hide-header
    @hide="resetModal()"
  >
    <div class="m-3 text-center">
      <h3 class="smart">Escolha o manutentor que deseja delegar para esta ordem</h3>
    </div>

    <transition name="fade" mode="out-in">
      <div v-if="!isLoading" key="maintainers" class="choose-maintainers-select-container">
        <div v-for="({ numeroCracha, nome }, index) of availableMaintainers" :key="index">
          <div
            class="maintainer"
            :class="{
              'selected': (isMaintainerSelected && selectedMaintainer.numeroCracha === numeroCracha),
              'unselected': (isMaintainerSelected && selectedMaintainer.numeroCracha !== numeroCracha)
            }"
            @click="selectMaintainer({ numeroCracha, nome })"
          >
            <strong>{{ nome }}</strong>
            
            <small class="smart">
              {{ numeroCracha }}
            </small>
          </div>
        </div>
      </div>

      <div
        v-else
        key="loading"
        class="d-flex justify-content-center align-items-center"
        style="min-height: 300px"
      >
        <i class="fa fa-spinner fa-spin fa-2x mr-2" style="color: var(--gray-20)" />
        <h3 class="smart" style="color: var(--gray-20)">
          Delegando ordem...
        </h3>
      </div>
    </transition>

    <div class="d-flex justify-content-center smart-modal-footer">
      <smart-button
        class="mx-1"
        circle
        @click.native="closeModal()"
      >
        <span>Fechar</span>
      </smart-button>

      <smart-button
        class="mx-1"
        :disabled="!isMaintainerSelected"
        primary
        circle
        @click.native="chooseMaintainer()"
      >
        <span>Delegar</span>
      </smart-button>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: 'ChooseMaintainerToDelegateModal',
  props: {
    availableMaintainers: { type: Array, default: () => [] },
    maintainersInOrder: { type: Array, default: () => [] },
  },
  data() {
    return {
      selectedMaintainer: {},
      isLoading: false,
    };
  },
  computed: {
    isMaintainerSelected() {
      return Object.keys(this.selectedMaintainer).length;
    },
  },
  mounted() {
    this.$refs['chooseMaintainerModal'].show();
  },
  beforeDestroy() {
    this.$refs['chooseMaintainerModal'].hide();
  },
  methods: {
    resetModal() {
      this.$emit('update:resetModal');
    },
    closeModal() {
      this.$refs['chooseMaintainerModal'].hide();
      this.$emit('update:closeModal');
    },
    selectMaintainer({ numeroCracha, nome }) {
      if (this.selectedMaintainer.numeroCracha === numeroCracha)
        return this.clearSelectedMaintainer();

      this.selectedMaintainer = { numeroCracha, nome };
    },
    clearSelectedMaintainer() {
      this.selectedMaintainer = {};
    },
    chooseMaintainer() {
      if (!this.isMaintainerSelected) return;

      this.isLoading = true;
      this.$emit('update:chooseMaintainer', this.selectedMaintainer);
      
    },
  },
};
</script>

<style lang="scss">
.choose-maintainers-select-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin: 40px 20px;

  .maintainer {
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 10px 20px;
    margin: 5px;
    border-radius: 20px;
    background-color: #eee;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    cursor: pointer;
    transition: .1s transform;
    &:hover {
      background-color: var(--gray-0);
      transform: scale(1.1)
    }
    &:active {
      transform: scale(1)
    }
    &.selected {
      background-color: var(--gray-0);
    }
    &.unselected {
      opacity: 0.6;
    }
  }
}
</style>
