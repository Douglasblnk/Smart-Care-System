<template>
  <section class="root-show-epis-modal">
    <b-modal
      ref="ShowEpiModal"
      centered
      hide-footer
      hide-header
      @hide="closeModal()"
    >
      <div class="show-epis-list">
        <div class="text-center">
          <h3 class="smart">EPIs desta ordem</h3>
          <span class="smart">
            É necessário utilizar EPIs informadas antes de iniciar qualquer ordem.
          </span>
        </div>

        <div class="my-4 d-flex justify-content-center flex-wrap">
          <div v-for="(epi, index) of epiList" :key="index">
            <div class="epis">
              <p class="smart">
                {{ epi.descricaoEpi }}
              </p>
            </div>
          </div>
        </div>
        

        <div class="d-flex justify-content-center smart-modal-footer">
          <smart-button
            primary
            class="mx-1"
            @click.native="closeModal()"
          >
            <span>Fechar</span>
          </smart-button>
        </div>
      </div>
    </b-modal>
  </section>
</template>

<script>
export default {
  name: 'ShowEpiModal',
  props: {
    epiList: { type: Array, default: () => [] },
  },
  computed: {
    hasSelectedEpi() {
      return this.epiList.length > 0;
    },
  },
  mounted() {
    this.$refs['ShowEpiModal'].show();
  },
  beforeDestroy() {
    this.$refs['ShowEpiModal'].hide();
  },
  methods: {
    closeModal() {
      this.$refs['ShowEpiModal'].hide();
      this.$emit('update:closeModal');
    },
  },
};
</script>

<style lang="scss">
.show-epis-list {
  .epis {
    margin: 5px;
    border-radius: 100px;
    padding: 10px 20px;
    background-color: #eee;
  }
}
</style>
