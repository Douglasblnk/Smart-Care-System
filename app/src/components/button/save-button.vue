<template>
  <div class="root-save-button-componenet">
    <div v-if="loading || disabled">
      <button
        value="loading-disabled"
        class="loading m-3"
        :style="noMargin ? 'margin: 0 !important' : ''"
      >
        <div>
          <i class="fa fa-sync-alt fa-spin text-white mr-2" />
        </div>
        <span>
          Carregando...
        </span>
      </button>
    </div>
    <div v-if="!loading && !disabled">
      <button
        class="save-button m-3"
        :style="noMargin ? 'margin: 0 !important' : ''"
      >
        <div v-if="prefix">
          <i class="fa mr-2" :class="prefix" />
        </div>
        <span>
          {{ label }}
        </span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: { type: String, default: '' },
    prefix: { type: String, default: '' },
    noMargin: { type: String, default: '' },

    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },

  data: () => ({}),
};
</script>

<style lang="scss" scoped>
.root-save-button-componenet {
  .save-button {
    display: flex;
    padding: 10px 30px;
    background-color: var(--duas-rodas-soft);
    border: none;
    border-radius: 7px;
    outline: 0;
    transition: .1s;
    &:hover {
      box-shadow: 2px 2px 5px 0px var(--shadow-gray);
      transform: scale(1.03)
    }
    &:active {
      box-shadow: 2px 2px 2px -2px var(--shadow-gray);
      transform: scale(1);
      border-radius: 9px;
    }
    span {
      color: white;
      text-decoration: none;
    }
  }
  .loading {
    display: flex;
    padding: 10px 30px;
    border: none;
    border-radius: 7px;
    outline: 0;
    cursor: default;
    background-color: rgb(189, 189, 189);
    span {
      color: white;
      text-decoration: none;
    }
  }
}
</style>