import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    page: '',
  },

  mutations: {
    addUser(state, { email, nome, nivelAcesso, funcao, cracha }) {
      state.user = { email, nome, nivelAcesso, funcao, cracha };
    },
    addPageName(state, name) {
      state.page = name;
    },
  },
});