<template>
  <div class="container p-2">
    <div class="input-container">
      <i class="fa" :class="icon" />
      <input
        v-model="model"
        :type="type"
        :placeholder="placeholder"
        required
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'mobileInput',

  props: {
    icon: { type: String, default: '' },
    type: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    value: { type: undefined, default: '' },
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
.input-container {
  display: flex;
  width: 100%;
  background-color: #eee;
  border-radius: 10px;
  i {
    color: rgb(105, 105, 105);
    padding: 10px;
    min-width: 50px;
    display: flex;align-items: center;
    justify-content: center;
  }
  input {
    border-radius: 10px;
    background-color: #eee;
    border: 0;
    outline: none;
    width: 100%;
    padding: 15px 0
  }
}
</style>
