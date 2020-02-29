<template>
  <div class="root-table-componenet">
    <div class="table-container p-3">
      <div class="table-head">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    contents: { type: Array, default: () => [] },
    headers: { type: Array, default: () => [] }
  },

  data: () => ({

  }),

}
</script>

<style lang="scss" scoped>
.root-table-componenet {
  .table-container {
    border-radius: 10px;
    table {
      width: 100%;
    }
    .table-head {
      background-color: var(--duas-rodas);
      box-shadow: 2px 2px 10px -4px rgb(77, 77, 77);
      padding: 20px;
      color: white;
    }
    .table-body {
      background-color: yellow;
      padding: 20px;
    }
  }
}
</style>