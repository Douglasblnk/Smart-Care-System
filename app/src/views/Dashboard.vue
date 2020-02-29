<template>
  <div class="root-dashboard-view">
    <div class="content-geral">
      <div class="menu-items">
        
      </div>
    </div>
    
  </div>
</template>

<script>



export default {
  components: {
    
  }
}
</script>

<style lang="scss">
.root-dashboard-view {
  .slide-fade-enter-active {
    transition: all 2s ease;
  }
  .slide-fade-leave-active {
    transition: all 2s cubic-bezier(1, 0.5, 0.8, 1);
  }
  .slide-fade-enter,
  .slide-fade-leave-to {
    transform: translateX(10px);
    opacity: 0;
  }
}
</style>
