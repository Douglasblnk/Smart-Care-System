<template>
  <section class="root-bottom-navigation">
    <div class="navigation-wrapper">
      <bottom-navigation-items
        :show-options="showOptions"
        @update:closeOptions="closeConfig"
      />

      <div v-click-outside="closeConfig" class="floating-button">
        <div @click="openCloseConfig()">
          <i class="fa fa-cogs fa-fw" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import BottomNavigationItems from './BottomNavigationItems';

export default {
  name: 'BottomNavigation',
  components: {
    BottomNavigationItems,
  },
  props: {
    showOptions: { type: Boolean, default: false },
  },
  methods: {
    navigateToDashboard() {
      this.$router.push({ path: '/dashboard' });
    },
    openCloseConfig() {
      this.$emit('update:openCloseConfigs');
    },
    closeConfig() {
      this.$emit('update:closeConfig');
    },
  },
};
</script>

<style lang="scss" scoped>
.root-bottom-navigation {
  padding: 15px;
  .navigation-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    .floating-button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 60px;
      height: 60px;
      background-color: var(--duas-rodas-soft);
      box-shadow: 3px 3px 10px -4px black;
      border-radius: 100%;
      transition: .2s ease;
      &:active {
        transform: scale(0.9);
        background-color: rgb(223, 151, 151);
      }
      i {
        color: white;
        font-size: 24px;
        margin: 5px 0;
      }
      small {
        text-transform: uppercase;
        user-select: none;
        color: white;
      }
    }
  }
}
</style>
