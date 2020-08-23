<template>
  <div class="root-save-button-componenet">
    <div class="d-flex justify-content-center">
      <button type="submit" value="send" class="save-button m-2">
        {{ label }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: { type: String, default: '' },
  },

  data: () => ({

  })
}
</script>

<style lang="scss" scoped>
.root-save-button-componenet {
  width: 100%;
  .save-button {
    width: 100%;
    padding: 15px;
    background-color: var(--button-gray);
    color: var(--duas-rodas);
    font-weight: bold;
    border: none;
    text-decoration: none;
    border-radius: 7px;
    outline: 0;
    transition: .1s;
    &:hover {
      box-shadow: 2px 2px 5px 0px var(--shadow-gray);
      transform: scale(1.03)
    }
    &:active {
      box-shadow: 2px 2px 2px -2px var(--shadow-gray);
      transform: scale(1);
      border-radius: 9px;
    }
  }
}
</style>