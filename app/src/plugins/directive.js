export default {
  install(Vue) {
    Vue.directive('click-outside', {
      bind(el, binding, vnode) {
        setTimeout(() => {
          el.clickOutsideEvent = event => {
            if (!(el === event.target || el.contains(event.target)))
              vnode.context[binding.expression](event);
          };
          document.body.addEventListener('click', el.clickOutsideEvent);
        });
      },
      unbind(el) {
        document.body.removeEventListener('click', el.clickOutsideEvent);
      },
    });
  },
};
