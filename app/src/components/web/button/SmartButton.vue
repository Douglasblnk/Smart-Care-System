<template>
  <div
    class="root-smart-button"
    :class="{
      'd-flex justify-content-center': mobile,
      'w-100': fullWidth
    }"
  >
    <button
      :class="{
        'btn-default': true,
        'btn-disabled': disabled,
        'primary': primary,
        'btn-simple': simple && !mobile,
        'btn-small': small,
        'btn-transparent': transparent && !mobile,
        'no-effect': noEffect,
        'full-width': fullWidth,
      }"
    >
      <div
        v-if="!loading"
        class="w-100 d-flex align-items-center"
        :class="{
          'loading-mobile-button': mobile,
          'justify-content-center': fullWidth,
        }"
      >
        <slot />
      </div>
      <div
        v-if="loading"
        class="d-flex align-items-center"
        :class="mobile ? 'loading-mobile-button' : ''"
      >
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
    small: { type: Boolean, default: false },
    simple: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    circle: { type: Boolean, default: false },
    transparent: { type: Boolean, default: false },
    fullWidth: { type: Boolean, default: false },
    mobile: { type: Boolean, default: false },
    noEffect: { type: Boolean, default: false },
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
    padding: 7px 20px;
    background-color: var(--shadow-gray);
    border: none;
    border-radius: 100px;
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
  .mobile-button {
    width: 100%;
    padding: 10px;
    background-color: var(--button-gray);
    font-weight: bold;
    border: none;
    text-decoration: none;
    text-align: center;
    border-radius: 7px;
    outline: 0;
    transition: .1s;
    user-select: none;
    span, small, h3, p { color: var(--duas-rodas-soft); }
    &:active {
      box-shadow: 2px 2px 5px 0px var(--shadow-gray);
      border-radius: 9px;
    }
    .loading-mobile-button {
      justify-content: center;
      i { color: var(--duas-rodas-soft); }
    }
  }
  .btn-small {
    padding: 5px 15px !important;
    font-size: 13px !important;
  }
  .no-effect {
    &:hover { transform: none !important }
    &:active { transform: none !important }
  }
  .primary {
    background-color: var(--duas-rodas-soft) !important;
    span, small, p, h3 { color: white !important ;}
  }
  .btn-disabled {
    cursor: not-allowed;
    // background-color: #c7c7c7 !important;
    opacity: 0.4;
    &:hover { transform: none !important; opacity: 0.4 !important; }
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
  .full-width {
    width: 100% !important;
    text-align: center !important;
  }
}
</style>
