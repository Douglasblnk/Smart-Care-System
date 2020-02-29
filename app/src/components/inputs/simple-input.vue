<template>
  <div class="container p-2">
    <div>
      <label class="text-muted">{{ label }}</label>
    </div>
    <div class="d-flex">
      <input
        :id="label"
        v-model="model"
        class="custom-input w-100 p-2 rounded"
        :type="type"
        pattern=".+"
        :placeholder="placeholder"
        required
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: { type: String, default: '' },
    type: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    value: { type: undefined, default: '' },
  },

  data() {
    return {
      
    }
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

.custom-input {
  border: 0;
  background-color: #eeeeee;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}

input[type=number] {
    -moz-appearance:textfield; /* Firefox */
}
</style>