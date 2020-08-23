<template>
  <div class="container p-2">
    <div>
      <label>{{ label }}</label>
    </div>
    <div class="d-flex">
      <textarea
        v-model="model"
        :cols="cols"
        :rows="rows"
        class="custom-input w-100 p-2 rounded"
        required
      >
      </textarea>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: { type: String, default: '' },
    cols: { type: String, default: '' },
    rows: { type: String, default: '' },
    value: { type: undefined, default: '' }
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
</style>