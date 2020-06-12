<template>
  <div
    class="root-card-component"
    :class="{
      'w-100': fullWidth,
      'w-100 d-flex justify-content-center': centered,
    }"
  >
    <div class="custom-card" :style="`width: ${getCustomWidth} !important`">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card',

  props: {
    fullWidth: { type: Boolean, default: false },
    customWidth: { type: String, default: '' },
    centered: { type: Boolean, default: false },
  },

  computed: {
    getCustomWidth() {
      if (this.customWidth.includes('px')) return this.customWidth;
      return `${this.customWidth}px`;
    },
  },
};
</script>

<style lang="scss" scoped>
.root-card-component {
  width: 70%;
  .custom-card {
    background: #fff;
    padding: 15px 20px;
    border-radius: 10px;
    box-shadow: 1px 2px 4px 0px #d4d4d4
  }
}
@media screen and (max-width: 1366px) {
  .root-card-component {
    width: 100% !important;
  }
}
</style>
