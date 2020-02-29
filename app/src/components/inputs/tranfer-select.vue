<template>
  <div class="container p-2">
    <div class="input-container">
      <div>
        <label class="label">{{ label }}</label>
      </div>
      <b-form-select v-model="selects.select" required>
          
          <option v-for="(option, index) in selects.selects" :value="option.value" :key="`option-${index}`">{{option.label}}</option>
      </b-form-select>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: { type: String, default: '' },
    selectOptions: { type: Array, default: () => [] },
    placeholder: { type: String, default: '' },
    value: { type: Number, default: 0 },
    model: { type: Number, default: 0},
    selects:  { type: Array, default: () => [] }
  },

  data() {
    return {
      
    }
  },

  computed: {
  }
}
</script>

<style lang="scss" scoped>
.container {
  box-sizing: border-box;
}

.input-container {
  position: relative;
}

.input {
  background-color: #eeeeee;
  border-radius: 6px;
  border: 0;
  border-bottom: 1px solid #d3d3d3;
  outline: none;
  transition: 0.2s ease-in-out;
  box-sizing: border-box;
}

.label {
  top: 0;
  left: 0;
  right: 0;
  color: #616161;
}

/* Interation */
.input:valid,
.input:focus {
  border-bottom: 2px solid #df8d8d;
}

.input:valid + .label,
.input:focus + .label {
  color: #df8d8d;
  font-size: 0.8rem;
  top: -30px;
  pointer-events: none;
}
</style>