<template>
  <div class="input-text-container">
    <smart-input :id="id" :label="label" :error-label="errorLabel">
      <select
        :id="id"
        v-model="model"
        class="form-field"
        required
        :disabled="disabled"
        :class="{
          'error-label': errorLabel,
          'disabled': disabled
        }"
      >
        <option value="" selected disabled>Selecione uma opção</option>
        <option
          v-for="(option, index) in options"
          :key="`option-${index}`"
          :value="option.id"
        >
          <span>{{ option.description }}</span>
        </option>
      </select>
    </smart-input>
  </div>
</template>

<script>
export default {
  name: 'InputText',
  props: {
    value: { type: [String, Boolean], default: '' },
    options: { type: Array, default: () => [] },
    id: { type: String, default: '' },
    label: { type: String, default: '' },
    errorLabel: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
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
