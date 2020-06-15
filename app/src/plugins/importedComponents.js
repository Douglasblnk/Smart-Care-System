const importComponent = path => () => import('@/components/' + path + '.vue');

export default {
  install(Vue) {
    Vue.component('save-button', importComponent('button/save-button'));
    Vue.component('smart-button', importComponent('button/smart-button'));
    Vue.component('card', importComponent('card/card'));
    Vue.component('simple-button', importComponent('button/simple-button'));
    Vue.component('cancel-button', importComponent('button/cancel-button'));
    Vue.component('mobile-save-button', importComponent('button/mobile-save-button'));
    Vue.component('menu-button', importComponent('button/menu-button'));
    Vue.component('accordion', importComponent('accordion/accordion'));
    Vue.component('card-option', importComponent('card/card-option'));
    Vue.component('advanced-input', importComponent('inputs/advanced-input'));
    Vue.component('custom-select', importComponent('inputs/custom-select'));
    Vue.component('description', importComponent('inputs/description'));
    Vue.component('mobile-input', importComponent('inputs/mobile-input'));
    Vue.component('simple-input', importComponent('inputs/simple-input'));
    Vue.component('transfer-select', importComponent('inputs/transfer-select'));
    Vue.component('side-bar', importComponent('side-bar/sidebar'));
    Vue.component('top-bar', importComponent('top-bar/topbarDash'));
    Vue.component('mobile-topbar', importComponent('top-bar/mobile-topbar'));
    Vue.component('mobile-dashboard-items', importComponent('dashboard-items/dashboard-items'));
  },
};
