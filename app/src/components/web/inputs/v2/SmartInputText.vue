<template>
  <div class="input-text-container">
    <smart-input :id="id" :label="label" :error-label="errorLabel">
      <input
        :id="id"
        ref="InputText"
        v-model="model"
        :type="type"
        :name="name"
        :placeholder="placeholder"
        class="form-field"
        :class="errorLabel ? 'error-label' : ''"
      >
    </smart-input>
  </div>
</template>

<script>
export default {
  name: 'InputText',
  props: {
    value: { type: String, default: '' },
    id: { type: String, default: '' },
    name: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    label: { type: String, default: '' },
    type: { type: String, default: 'text' },
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
