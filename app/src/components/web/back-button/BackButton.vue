<template>
  <section v-if="!isMobile" class="root-back-button">
    <div class="d-flex align-items-center">
      <div class="back-button" @click="goBack">
        <i
          class="fa fa-arrow-left fa-fw"
          title="Retornar"
        />
        <span>Voltar</span>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'BackButton',
  computed: {
    ...mapGetters({
      isMobile: 'getIsMobile',
    }),
  },
  methods: {
    goBack() {
      this.$emit('goBack');
    },
  },
};
</script>

<style lang="scss" scoped>
.root-back-button {
  .back-button {
    color: var(--duas-rodas-soft);
    font-size: 18px;
    padding: 0 10px;
    border-radius: 5px;
    user-select: none;
    cursor: pointer;
    i { margin-right: 10px }
    &:hover {
      background-color: #ddd;
    }
    &:active {
      background-color: rgb(211, 211, 211);
    }
  }
}
</style>
