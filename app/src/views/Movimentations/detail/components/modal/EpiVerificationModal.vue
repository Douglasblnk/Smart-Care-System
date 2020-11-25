<template>
  <section class="root-epi-verification">
    <b-modal
      ref="EpiVerificationModal"
      centered
      hide-footer
      hide-header
      @hide="resetModal()"
      @show="checkSelectedEpis()"
    >
      <div class="d-block text text-center">
        <div class="text-center">
          <h3>Verificação de EPIs da ordem</h3>
        </div>
        <div v-if="hasSelectedEpi">
          <span>
            Informe quais EPIs você esta utilizando.
          </span>
          <div class="m-3">
            <b-form-checkbox-group
              id="checkbox-group-1"
              v-model="epiModel"
              :options="getEpiOptions"
              name="flavour-1"
              stacked
            />
          </div>
        </div>
        <div v-else>
          <div class="m-5">
            <span class="text-muted">Não há nenhuma EPI cadastrada para essa ordem.</span>
          </div>
        </div>
      </div>
      <div v-if="modalHasError">
        <div
          class="d-flex justify-content-center w-100 p-2 rounded"
          style="background-color: #ff4a4a5c; border: 1px solid #ff4a4aa6"
        >
          <span style="color: black">{{ modalErrorMessage }}</span>
        </div>
      </div>
      <div class="d-flex justify-content-center smart-modal-footer">
        <smart-button
          class="mx-1"
          @click.native="closeModal()"
        >
          <span>Fechar</span>
        </smart-button>

        <smart-button
          v-if="hasSelectedEpi"
          class="mx-1"
          primary
          @click.native="confirmEpi()"
        >
          <span>Enviar</span>
        </smart-button>
      </div>
    </b-modal>
  </section>
</template>

<script>
export default {
  name: 'EpiVerification', // nome do componente
  props: {
    selectedEpis: { type: Array, default: () => [] },
    epiList: { type: Array, default: () => [] },
    modalHasError: { type: Boolean, default: false },
    modalErrorMessage: { type: String, default: '' },
  },
  data() {
    return {
      
    };
  },
  computed: {
    epiModel: {
      get() {
        return this.epiList;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
    getEpiOptions() {
      return this.epiList.map(i => ({ text: i.descricaoEpi, value: i.idEpi }));
    },
    hasSelectedEpi() {
      return this.epiList.length > 0;
    },
  },
  mounted() {
    this.$refs['EpiVerificationModal'].show();
  },
  beforeDestroy() {
    this.$refs['EpiVerificationModal'].hide();
  },
  methods: {
    resetModal() {
      this.$emit('update:resetModal');
    },
    checkSelectedEpis() {
      this.$emit('update:checkSelectedEpis');
    },
    closeModal() {
      this.$refs['EpiVerificationModal'].hide();
      this.$emit('update:closeModal');
    },
    confirmEpi() {
      this.$refs['EpiVerificationModal'].hide();
      
      this.$emit('update:confirmEpi');
    },
  },
};
</script>
