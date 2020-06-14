<template>
  <div class="root-smart-button">
    <button
      class="btn-default"
      :class="{
        'btn-disabled': disabled,
        'primary': primary,
        'btn-simple': simple,
        'btn-small': sm,
        'btn-circle': circle,
        'btn-transparent': transparent,
      }"
      :style="`width: ${getCustomWidth} !important`"
    >
      <div v-if="!loading" class="w-100 d-flex align-items-center">
        <slot />
      </div>
      <div v-if="loading" class="d-flex align-items-center">
        <i class="fa fa-spinner fa-spin mr-2 fa-sm" />
        <span>Aguarde...</span>
      </div>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    primary: { type: Boolean, default: false },
    sm: { type: Boolean, default: false },
    simple: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    circle: { type: Boolean, default: false },
    transparent: { type: Boolean, default: false },
    width: { type: String, default: '' },
  },

  data: () => ({}),
  
  computed: {
    getCustomWidth() {
      if (this.width.includes('px')) return this.width;
      return `${this.width}px`;
    },
  },
};
</script>

<style lang="scss" scoped>
.root-smart-button {
  button {
    outline: 0 !important;
  }
  .btn-default {
    display: flex;
    padding: 10px 20px;
    background-color: var(--shadow-gray);
    border: none;
    border-radius: 7px;
    transition: .1s;
    color: white;
    span, p, small, strong {
      color: white !important;
    }
    &:hover {
      transform: scale(1.07);
      opacity: 0.8;
    }
    &:active { transform: scale(0.95) }
  }
  .btn-small {
    padding: 5px 15px !important;
    font-size: 13px !important;
  }
  .primary {
    background-color: var(--duas-rodas-soft) !important;
  }
  .btn-circle {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 40px !important;
    min-height: 40px !important;
    border-radius: 100px;
  }
  .btn-disabled {
    cursor: not-allowed;
    background-color: #c7c7c7;
    &:hover { transform: none !important }
    &:active { transform: none !important }
  }
  .btn-simple {
    background-color: var(--gray) !important;
    padding: 3px 15px !important;
    &:hover {
      opacity: 0.8;
    }
  }
  .btn-transparent {
    background-color: transparent !important;
    color: #707070 !important;
    span, p, strong, small, h3, h4 {
      color: #707070 !important;
    }
    &:hover {
      background-color: #ddd !important;
    }
  }
}
</style>
