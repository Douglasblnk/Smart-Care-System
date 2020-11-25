<template>
  <div class="input-textarea-container">
    <smart-input :id="id" :label="label" :error-label="errorLabel">
      <textarea
        :id="id"
        ref="InputTextarea"
        v-model="model"
        :name="name"
        :placeholder="placeholder"
        :rows="rows"
        class="form-field"
        :class="errorLabel ? 'error-label' : ''"
      />
    </smart-input>
  </div>
</template>

<script>
export default {
  name: 'InputTextarea',
  props: {
    id: { type: String, default: '' },
    name: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    label: { type: String, default: '' },
    rows: { type: Number, default: 3 },
    errorLabel: { type: String, default: '' },
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

<style scoped lang="scss">
.input-textarea-container {
  textarea {
    resize: none;
  }
}
</style>
