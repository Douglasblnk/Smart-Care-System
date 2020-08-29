import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue';
import Fontawesome from '@fortawesome/fontawesome-free/css/all.css';
import BootstrapVue from 'bootstrap-vue';
import VueSweetalert2 from 'vue-sweetalert2';
import Swal from 'sweetalert2';
import Lodash from 'lodash';
import moment from 'moment';
import { ClientTable } from 'vue-tables-2';
import VueFormWizard from 'vue-form-wizard';
import 'vue-form-wizard/dist/vue-form-wizard.min.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import router from './routes';
import store from './store/index';
import Services from './services/services';
import { validateSession } from './utils/utils';
import activities from './utils/activities';
import importedComponents from './plugins/importedComponents';

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
Vue.prototype.$activities = activities;

new Vue({
  router,
  store,
  async beforeMount() {
    moment.locale('pt-BR');
    
    try {
      if (router.currentRoute.name === 'login') return;
      
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
    title: 'Erro ao autenticar! Por favor, tente novamente.',
    confirmButtonColor: '#F34336',
  });

  router.replace('/');
}
