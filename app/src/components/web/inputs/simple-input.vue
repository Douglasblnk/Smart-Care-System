<template>
  <div class="p-2">
    <div v-if="label">
      <label class="text-muted">{{ label }}</label>
    </div>
    <div class="d-flex">
      <div v-if="prefix" class="sufix-prefix  mr-3" @click="iconClick">
        <i :class="prefix" class="fa" />
      </div>
      <input
        :id="label"
        v-model="model"
        :class="white ? 'bg-white' : ''"
        class="custom-input w-100 p-2 rounded"
        :type="type"
        pattern=".+"
        :placeholder="placeholder"
        required
      />
      <div v-if="sufix" class="sufix-prefix ml-3" @click="iconClick">
        <i :class="sufix" class="fa" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    sufix: { type: String, default: '' },
    prefix: { type: String, default: '' },
    white: { type: Boolean, default: false },
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
  },

  methods: {
    iconClick(event) {
      this.$emit('icon');
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-input {
  border: 0;
  background-color: #eeeeee;
}

.sufix-prefix {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: .2s;
  color: var(--gray);
  &:hover {
    transform: scale(1.2);
  }
  &:active {
    transform: scale(1);
  }
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
