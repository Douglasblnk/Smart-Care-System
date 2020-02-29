<template>
  <div class="container p-2">
    <div class="input-container mt-3">
      <b-form-select v-model="model" required>
        <option v-for="(option, index) of selectOptions" :value="option" :key="`option-${index}`">{{option}}</option>
      </b-form-select>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: { type: String, default: '' },
    selectOptions: { type: Array, default: () => [] },
    value: { type: undefined, default: '' }
  },

  data() {
    return {
      
    }
  },

  mounted() {
    console.log('selectedoption', this.selectOptions);
  },

  computed: {
    model: {
      get() {
        return this.value;
      },

      set(val) {
        this.$emit('input', val)
      } 
    }
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
  display: flex;
  align-items: center;
  position: absolute;
  font-size: 1rem;
  cursor: text;
  transition: 0.2s ease-in-out;
  box-sizing: border-box;
}

.input,
.label {
  width: 100%;
  height: 4rem;
  font-size: 1rem;
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