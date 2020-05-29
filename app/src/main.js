import Vue from 'vue';
import Vuex from 'vuex';
import Fontawesome from '@fortawesome/fontawesome-free/css/all.css';
import BootstrapVue from 'bootstrap-vue';
import VueSweetalert2 from 'vue-sweetalert2';
import Swal from 'sweetalert2';
import Lodash from 'lodash';
import store from './store/index';
import moment from 'moment';
import App from './App.vue';
import router from './routes';
import ToggleButton from 'vue-js-toggle-button';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Services from './utils/services';
import VueFormWizard from 'vue-form-wizard';
import 'vue-form-wizard/dist/vue-form-wizard.min.css';

import 'sweetalert2/dist/sweetalert2.min.css';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import { ClientTable, Event } from 'vue-tables-2';
import { validateSession } from './utils/utils';
import importedComponents from './plugins/importedComponents';
import locale from 'element-ui/lib/locale/lang/pt-br';


Vue.use(ElementUI, { locale });

Vue.use(ToggleButton);
Vue.use(Fontawesome);
Vue.use(Lodash);
Vue.use(BootstrapVue);
Vue.use(VueSweetalert2);
Vue.use(Vuex);
Vue.use(ClientTable);
Vue.use(VueFormWizard);

Vue.use(importedComponents);

const service = new Services();

Vue.config.productionTip = false;

Vue.prototype.$http = service;
Vue.prototype.$apiUrl = router.options.apiUrl;
Vue.prototype.$moment = moment;
Vue.prototype.$_ = Lodash;


new Vue({
  router,
  store,
  async beforeMount() {
    moment.locale('pt-BR');
    
    try {
      if (router.currentRoute.name === 'login' || router.currentRoute.name === '404') return;
      
      await validateSession(router.options.apiUrl);
    } catch (err) {
      console.log('session err => ', err);

      const { response } = err;
      
      localStorage.removeItem('token');

      if (!response.data)
        return throwError();

      if (response.data.name === 'TokenExpiredError')
        return router.replace('/');
        
      return throwError();
    }
  },
  render: h => h(App),
}).$mount('#app');

function throwError() {
  Swal.fire({
    type: 'warning',
    title: 'Erro ao autentizar! Por favor, tente novamente.',
    confirmButtonColor: '#F34336',
  });

  router.replace('/');
}
