import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    page: '',
    isMobile: false,
    mainIcon: '',
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
    setMainIcon(state, icon) {
      state.mainIcon = icon;
    },
  },

  getters: {
    getIsMobile(state) {
      return state.isMobile;
    },
    getUser(state) {
      return state.user;
    },
    getMainIcon(state) {
      return state.mainIcon;
    },
    getPageName(state) {
      return state.page;
    },
  },

  actions: {
    setIsMobile({ commit }, value) {
      commit('setIsMobile', value);
    },
  },
});
