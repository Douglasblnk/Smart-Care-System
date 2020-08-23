import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    page: '',
    isMobile: false,
  },

  mutations: {
    addUser(state, { email, nome, nivelAcesso, funcao, cracha, userId }) {
      state.user = { email, nome, nivelAcesso, funcao, cracha, userId };
    },
    addPageName(state, name) {
      state.page = name;
    },
    setIsMobile(state, isMobile) {
      state.isMobile = isMobile;
    },
  },

  getters: {
    getIsMobile(state) {
      return state.isMobile;
    },
  },

  actions: {
    setIsMobile({ commit }, value) {
      commit('setIsMobile', value);
    },
  },
});
