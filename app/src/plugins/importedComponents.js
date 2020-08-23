const importComponent = path => () => import('@/components/' + path + '.vue');

export default {
  install(Vue) {
    Vue.component('smart-button', importComponent('web/button/SmartButton'));
    Vue.component('mobile-button', importComponent('mobile/button/MobileButton'));
    Vue.component('menu-button', importComponent('web/button/MenuButton'));
    Vue.component('card', importComponent('web/card/Card'));
    Vue.component('accordion', importComponent('web/accordion/Accordion'));
    Vue.component('card-option', importComponent('web/card/CardOption'));
    Vue.component('advanced-input', importComponent('web/inputs/advanced-input'));
    Vue.component('custom-select', importComponent('web/inputs/custom-select'));
    Vue.component('description', importComponent('web/inputs/description'));
    Vue.component('mobile-input', importComponent('web/inputs/MobileInput'));
    Vue.component('simple-input', importComponent('web/inputs/simple-input'));
    Vue.component('mobile-topbar', importComponent('mobile/top-bar/MobileHeader'));
  },
};
