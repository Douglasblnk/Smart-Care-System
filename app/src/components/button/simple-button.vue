<template>
  <div class="root-save-button-componenet">
    <div class="m-2">
      <button @click.self="click()" type="submit" value="send" class="save-button d-flex align-items-center justify-content-center">
        <div v-if="prefix" class="d-flex align-itens-center justify-content-center">
          <i class="fa mr-2" :class="prefix" />
        </div>
        <small>{{ label.toUpperCase() }}</small>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    prefix: { type: String, default: '' },
    label: { type: String, default: '' },
  },

  data: () => ({}),

  methods: {
    click() {
      this.$emit('btn-click');
    },
  }
};
</script>

<style lang="scss" scoped>
.root-save-button-componenet {
  box-sizing: border-box;
  .save-button {
    padding: 5px 20px;
    background-color: var(--shadow-gray);
    color: white;
    border: none;
    text-decoration: none;
    border-radius: 7px;
    outline: 0;
    transition: .1s;
    &:hover {
      background-color: var(--gray);
    }
  }
}
</style>