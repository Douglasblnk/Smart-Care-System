<template>
  <div class="root-menu-button">
    <div class="btn w-100 mb-3 p-0 d-flex">
      <button :class="{'active' : active}" class="w-100">
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
  },
};
</script>

<style lang="scss">
.root-menu-button {
  .btn {
    button {
      display: flex;
      align-items: center;
      background-color: white;
      border-radius: 7px;
      border: 0;
      padding: 10px;
      transition: .1s;
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
    }
    .active {
      span {
        color: white !important;
      }
      box-shadow: 1px 1px 5px -3px black;
      background-color: var(--duas-rodas);
      &:hover {
        background-color: rgb(255, 87, 75);
      }
      i {
        color: white;
      }
    }
  }
}
</style>