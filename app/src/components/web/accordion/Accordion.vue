<template>
  <div>
    <div
      class="header-info"
      :class="{ 'active-class' : !collapsed}"
      :style="`background-color: ${headerColor}`"
      @click="collapsed = !collapsed"
    >
      <div class="title">
        <i v-if="icon" :class="icon" class="text-muted fa-fw" />
        <p class="text-muted ml-3">{{ title }}</p>
      </div>
      <i :class="getCollapseIcon" />
    </div>
    <transition name="slide-fade">
      <div v-show="!collapsed" class="body-info">
        <slot />
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, default: '' },
    icon: { type: String, default: '' },
    headerColor: { type: String, default: '' },
    active: { type: Boolean, default: false },
  },

  data() {
    return {
      initialized: undefined,
    };
  },

  computed: {
    collapsed: {
      get() {
        if (this.locked) return false;
        if (this.initialized === undefined) return !this.active;
        return this.initialized;
      },

      set(val) {
        this.initialized = val;
      },
    },

    getCollapseIcon() {
      if (this.collapsed) return 'fa fa-caret-down';
      return 'fa fa-caret-up';
    },
  },

  methods: {
  },
};
</script>

<style lang="scss" scoped>
.header-info {
  .title {
    display: flex;
    align-items: center;
    i {
      font-size: 23px;
    }
  }
  background-color: white;
  padding: 5px 15px;
  margin: 5px 0px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  p {
    margin: 0px;
    font-family: 'roboto';
    color: #505050;
    letter-spacing: 0.5px;
  }
  i {
    display: flex;
    align-items: center;
    font-size: 2.2rem;
    color: #505050;
  }

  &:hover {
    background-color: #dfdede;
    transition: 0.2s;
  }
}

.slide-fade-enter-active {
  transition: all 0.2s ease;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
