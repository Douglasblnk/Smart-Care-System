<template>
  <div class="root-save-button-componenet">
    <button
      type="submit"
      value="send"
      class="save-button m-3"
      :style="noMargin ? 'margin: 0 !important' : ''"
    >
      <div v-if="prefix">
        <i class="fa mr-2" :class="prefix" />
      </div>
      {{ label }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    label: { type: String, default: '' },
    prefix: { type: String, default: '' },
    noMargin: { type: String, default: '' },
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
    color: white;
    border: none;
    text-decoration: none;
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
  }
}
</style>