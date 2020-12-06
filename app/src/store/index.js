import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    page: '',
    isMobile: false,
    mainIcon: '',
    showConsultFilter: false,
    isSidebarHided: false,
    isDetailRoute: false,
  },

  mutations: {
    addUser(state, { email, nome, nivelAcesso, funcao, cracha, userId }) {
      state.user = { email, nome, nivelAcesso, funcao, cracha, userId };
    },
    addPageName(state, name) {
      state.page = name;
    },
    isDetailRoute(state, value) {
      state.isDetailRoute = value;
    },
    setIsMobile(state, isMobile) {
      state.isMobile = isMobile;
    },
    setMainIcon(state, icon) {
      state.mainIcon = icon;
    },
    setShowConsultFilter(state, value) {
      state.showConsultFilter = value;
    },
    setIsSidebarHided(state, value) {
      state.isSidebarHided = value;
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
    getShowConsultFilter(state) {
      return state.showConsultFilter;
    },
    isSidebarHided(state) {
      return state.isSidebarHided;
    },
    isDetailRoute(state) {
      return state.isDetailRoute;
    }
  },

  actions: {
    setIsMobile({ commit }, value) {
      commit('setIsMobile', value);
    },
    hideSidebar({ commit }, value) {
      commit('setIsSidebarHided', value);
    },
  },
});
