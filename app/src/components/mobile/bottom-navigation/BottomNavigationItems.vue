<template>
  <section class="root-bottom-navigation-item">
    <transition name="slide-fade">
      <div v-if="showOptions">
        <div
          v-for="(options, index) in getRecommendedItems"
          :key="`options-${index}`"
          class="d-flex justify-content-end align-items-center"
        >
          <div class="action-text">
            <small>{{ options.name }}</small>
          </div>

          <div class="floation-option-wrapper">
            <div class="floating-options" @click="executeAction(options)">
              <i class="fa fa-fw" :class="options.icon" />
            </div>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
import { recommendedItems } from './utils/recommendedItems';

export default {
  name: 'BottomNavigationItem',
  props: {
    showOptions: { type: Boolean, default: false },
  },
  computed: {
    getRecommendedItems() {
      const currentPath = this.$route.path;
      
      return (recommendedItems[currentPath].options);
    },
  },
  methods: {
    async executeAction({ actions }) {
      actions();
      this.$emit('update:closeOptions');
    },
  },
};
</script>

<style lang="scss" scoped>
.root-bottom-navigation-item {
  position: relative;
  .action-text {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    padding: 4px 20px;
    margin: 0 10px;
    border-radius: 5px;
    small {
      display: inline-block;
      user-select: none;
    }
  }
  .floation-option-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 60px;
    .floating-options {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 45px;
      height: 45px;
      margin: 10px 0;
      background-color: var(--duas-rodas-soft);
      border-radius: 100%;
      transition: .2s ease;
      &:active {
        transform: scale(0.9);
        background-color: rgb(223, 151, 151);
      }
      i {
        color: white;
        font-size: 20px;
        margin: 5px 0;
      }
    }
  }
}
</style>
