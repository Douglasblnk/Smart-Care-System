<template>
  <div class="root-menu-button">
    <div class="w-100 mb-3 p-0 d-flex">
      <button
        class="w-100 menu-button"
        :class="{
          'active' : active,
          'hided-sidebar' : isSidebarHided
        }"
        @click="$emit('clicked')"
      >
        <i :class="icon" class="fa-lg" />
        <span>
          {{ label }}
        </span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: { type: String, default: '' },
    active: { type: Boolean, default: false },
    icon: { type: String, default: '' },
    isSidebarHided: { type: Boolean, default: false },
  },
};
</script>

<style lang="scss" scoped>
.root-menu-button {
  .menu-button {
    display: flex;
    align-items: center;
    margin-left: -40px;
    padding: 10px 0;
    padding-left: 50px;
    background-color: transparent;
    border-radius: 100px;
    border: 0;
    transition: .1s;
    outline: none;
    &:hover {
      background-color: rgb(233, 233, 233);
    }
    i {
      margin: 0 20px;
      color: #b3b3b3
    }
    span {
      color: black;
    }

    &.active {
      span { color: white !important }
      padding-left: 70px;
      box-shadow: 1px 1px 5px -3px black;
      background-color: var(--duas-rodas-soft);
      &:hover {
        background-color: rgb(255, 87, 75);
      }
      i {
        color: white;
      }
    }

    &.hided-sidebar {
      // width: 100px !important;
      justify-content: center;
      align-items: center;
      padding-left: 40px !important;
      margin-left: -20px;
    }
  }
}
</style>
