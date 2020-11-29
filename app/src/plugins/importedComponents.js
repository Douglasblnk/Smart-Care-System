const importComponent = path => () => import('@/components/' + path + '.vue');

export default {
  install(Vue) {
    Vue.component('smart-input', importComponent('web/inputs/v2/SmartInput'));
    Vue.component('smart-input-text', importComponent('web/inputs/v2/SmartInputText'));
    Vue.component('smart-input-date', importComponent('web/inputs/v2/SmartInputDate'));
    Vue.component('smart-input-textarea', importComponent('web/inputs/v2/SmartInputTextarea'));
    Vue.component('smart-input-select', importComponent('web/inputs/v2/SmartInputSelect'));
    Vue.component('smart-button', importComponent('web/button/SmartButton'));
    Vue.component('menu-button', importComponent('web/button/MenuButton'));
    Vue.component('card', importComponent('web/card/Card'));
    Vue.component('accordion', importComponent('web/accordion/Accordion'));
    Vue.component('card-option', importComponent('web/card/CardOption'));
    Vue.component('advanced-input', importComponent('web/inputs/advanced-input'));
    Vue.component('custom-select', importComponent('web/inputs/custom-select'));
    Vue.component('description', importComponent('web/inputs/description'));
    Vue.component('mobile-input', importComponent('mobile/inputs/MobileInput'));
    Vue.component('simple-input', importComponent('web/inputs/simple-input'));
    Vue.component('back-button', importComponent('web/back-button/BackButton'));
  },
};
