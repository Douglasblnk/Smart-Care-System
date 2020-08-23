<template>
  <div class="container p-2">
    <div class="input-container">
      <label class="text-muted">
        {{ label }}
      </label>
      <select :id="label" v-model="model" class="custom-input p-2 rounded" required>
        <option value="" selected disabled>Selecione uma opção</option>
        <option
          v-for="(option, index) in options"
          :key="`option-${index}`"
          :value="option.id"
        >
          {{ option.description }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: { type: String, default: '' },
    options: { type: Array, default: () => [] },
    value: { type: String, default: '' },
  },

  data() {
    return {

    };
  },

  computed: {
    model: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  box-sizing: border-box;
}

.input-container {
  display: flex;
  flex-direction: column;
  .custom-input {
    border: 0;
    background-color: #eeeeee;
  }
}
</style>
