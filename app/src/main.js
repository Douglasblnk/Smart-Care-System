import Vue from 'vue';
import Vuex from 'vuex'
import Fontawesome from '@fortawesome/fontawesome-free/css/all.css';
import BootstrapVue from 'bootstrap-vue';
import VueSweetalert2 from 'vue-sweetalert2';
import { ClientTable } from 'vue-tables-2';
import Swal from 'sweetalert2';
import Lodash from 'lodash';
import store from './store/index'
import moment from 'moment';
import App from './App.vue';
import router from './routes';
import Http from './utils/http';
import { validate } from './utils/user-validate';
import VueFormWizard from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import ToggleButton from 'vue-js-toggle-button'

import 'sweetalert2/dist/sweetalert2.min.css';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import importedComponents from './plugins/importedComponents';

Vue.use(ToggleButton)
Vue.use(Fontawesome);
Vue.use(Lodash);
Vue.use(BootstrapVue);
Vue.use(VueSweetalert2);
Vue.use(Vuex);
Vue.use(ClientTable);
Vue.use(VueFormWizard)

Vue.use(importedComponents)

const http = new Http()

Vue.config.productionTip = false;

Vue.prototype.$apiUrl = router.options.apiUrl;
Vue.prototype.$setActivity = http.setActivity;
Vue.prototype.$moment = moment;
Vue.prototype.$_ = Lodash;
Vue.prototype.$http = http;

new Vue({
  router,
  store,
  async beforeMount() {
    moment.locale('pt-BR');
    
    try {
      if (router.currentRoute.name === 'login' || router.currentRoute.name === '404') return;

      await validate(router.options.apiUrl);
    } catch (err) {
      console.log(err);
      localStorage.removeItem('token');
      if (err.err.name === 'TokenExpiredError') return router.replace('/');

      Swal.fire({
        type: 'warning',
        title: 'Erro ao autentizar! Por favor, tente novamente.',
      });
      router.replace('/');
    }
  },
  render: h => h(App),
}).$mount('#app');
