import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {}    
  },

  mutations: {
    addUser(state, { email, nome, nivelAcesso, cracha }) {
      state.user = { email, nome, nivelAcesso, cracha }
    }
  }
});